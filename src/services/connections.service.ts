import { supabase } from '../lib/supabase';

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
    occupation: string;
    company: string;
    location: string;
    mutual_connections?: number;
  };
}

export interface UserConnection {
  id: string;
  name: string;
  avatar: string;
  occupation: string;
  company: string;
  location: string;
  connection_status: 'none' | 'pending' | 'accepted' | 'blocked' | 'sent';
  mutual_connections: number;
  skills?: string[];
  profile_completion_percentage?: number;
}

export interface ConnectionStats {
  total_connections: number;
  pending_requests: number;
  sent_requests: number;
  mutual_connections: number;
}

class ConnectionsService {
  async getUserConnections(userId: string, status: 'accepted' | 'pending' | 'all' = 'accepted'): Promise<Connection[]> {
    try {
      let query = supabase
        .from('connections')
        .select(`
          *,
          users!connections_following_id_fkey (
            id,
            name,
            avatar,
            occupation,
            company,
            location
          )
        `)
        .eq('follower_id', userId);

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      query = query.order('created_at', { ascending: false });

      const { data: connections, error } = await query;

      if (error) throw error;

      if (!connections) return [];

      // Add mutual connections count for each connection
      const connectionsWithMutuals = await Promise.all(
        connections.map(async (connection) => {
          const mutualCount = await this.getMutualConnectionsCount(userId, connection.following_id);
          
          return {
            ...connection,
            user: {
              ...connection.users,
              mutual_connections: mutualCount
            }
          };
        })
      );

      return connectionsWithMutuals;
    } catch (error) {
      console.error('Error fetching user connections:', error);
      throw error;
    }
  }

  async getConnectionRequests(userId: string): Promise<Connection[]> {
    try {
      const { data: requests, error } = await supabase
        .from('connections')
        .select(`
          *,
          users!connections_follower_id_fkey (
            id,
            name,
            avatar,
            occupation,
            company,
            location
          )
        `)
        .eq('following_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!requests) return [];

      // Add mutual connections count for each request
      const requestsWithMutuals = await Promise.all(
        requests.map(async (request) => {
          const mutualCount = await this.getMutualConnectionsCount(userId, request.follower_id);
          
          return {
            ...request,
            user: {
              ...request.users,
              mutual_connections: mutualCount
            }
          };
        })
      );

      return requestsWithMutuals;
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      throw error;
    }
  }

  async sendConnectionRequest(followerId: string, followingId: string): Promise<void> {
    try {
      // Check if connection already exists
      const existing = await this.getConnectionStatus(followerId, followingId);
      
      if (existing !== 'none') {
        throw new Error('Connection already exists or pending');
      }

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            follower_id: followerId,
            following_id: followingId,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      // Create notification
      await this.createConnectionNotification(followerId, followingId, 'follow');
    } catch (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }
  }

  async acceptConnectionRequest(requestId: string): Promise<void> {
    try {
      const { data: connection, error: updateError } = await supabase
        .from('connections')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('status', 'pending')
        .select('follower_id, following_id')
        .single();

      if (updateError) throw updateError;

      if (!connection) {
        throw new Error('Connection request not found or already processed');
      }

      // Create reciprocal connection
      await supabase
        .from('connections')
        .insert([
          {
            follower_id: connection.following_id,
            following_id: connection.follower_id,
            status: 'accepted'
          }
        ]);

      // Create notification for the requester
      await this.createConnectionNotification(
        connection.following_id, 
        connection.follower_id, 
        'follow'
      );
    } catch (error) {
      console.error('Error accepting connection request:', error);
      throw error;
    }
  }

  async rejectConnectionRequest(requestId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', requestId)
        .eq('status', 'pending');

      if (error) throw error;
    } catch (error) {
      console.error('Error rejecting connection request:', error);
      throw error;
    }
  }

  async removeConnection(userId: string, connectionUserId: string): Promise<void> {
    try {
      // Remove both directions of the connection
      await Promise.all([
        supabase
          .from('connections')
          .delete()
          .eq('follower_id', userId)
          .eq('following_id', connectionUserId),
        supabase
          .from('connections')
          .delete()
          .eq('follower_id', connectionUserId)
          .eq('following_id', userId)
      ]);
    } catch (error) {
      console.error('Error removing connection:', error);
      throw error;
    }
  }

  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    try {
      // Remove existing connections if any
      await this.removeConnection(userId, blockedUserId);

      // Create block relationship
      const { error } = await supabase
        .from('connections')
        .insert([
          {
            follower_id: userId,
            following_id: blockedUserId,
            status: 'blocked'
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', blockedUserId)
        .eq('status', 'blocked');

      if (error) throw error;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  }

  async getConnectionStatus(userId: string, otherUserId: string): Promise<'none' | 'pending' | 'accepted' | 'blocked' | 'sent'> {
    try {
      const [sentRequest, receivedRequest] = await Promise.all([
        // Check if user sent a request to the other user
        supabase
          .from('connections')
          .select('status')
          .eq('follower_id', userId)
          .eq('following_id', otherUserId)
          .single(),
        // Check if user received a request from the other user
        supabase
          .from('connections')
          .select('status')
          .eq('follower_id', otherUserId)
          .eq('following_id', userId)
          .single()
      ]);

      if (sentRequest.data) {
        if (sentRequest.data.status === 'blocked') return 'blocked';
        if (sentRequest.data.status === 'accepted') return 'accepted';
        if (sentRequest.data.status === 'pending') return 'sent';
      }

      if (receivedRequest.data) {
        if (receivedRequest.data.status === 'blocked') return 'blocked';
        if (receivedRequest.data.status === 'accepted') return 'accepted';
        if (receivedRequest.data.status === 'pending') return 'pending';
      }

      return 'none';
    } catch (error) {
      console.error('Error getting connection status:', error);
      return 'none';
    }
  }

  async searchUsers(query: string, userId: string, filters?: {
    location?: string;
    occupation?: string;
    company?: string;
  }): Promise<UserConnection[]> {
    try {
      let dbQuery = supabase
        .from('users')
        .select(`
          id,
          name,
          avatar,
          occupation,
          company,
          location,
          profile_completion_percentage,
          profile_skills (
            name
          )
        `)
        .neq('id', userId); // Exclude current user

      // Add search filters
      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,occupation.ilike.%${query}%,company.ilike.%${query}%`);
      }

      if (filters?.location) {
        dbQuery = dbQuery.ilike('location', `%${filters.location}%`);
      }

      if (filters?.occupation) {
        dbQuery = dbQuery.ilike('occupation', `%${filters.occupation}%`);
      }

      if (filters?.company) {
        dbQuery = dbQuery.ilike('company', `%${filters.company}%`);
      }

      dbQuery = dbQuery.limit(50);

      const { data: users, error } = await dbQuery;

      if (error) throw error;

      if (!users) return [];

      // Get connection status and mutual connections for each user
      const usersWithConnectionInfo = await Promise.all(
        users.map(async (user) => {
          const [connectionStatus, mutualCount] = await Promise.all([
            this.getConnectionStatus(userId, user.id),
            this.getMutualConnectionsCount(userId, user.id)
          ]);

          return {
            id: user.id,
            name: user.name || 'Nome não informado',
            avatar: user.avatar || '',
            occupation: user.occupation || 'Ocupação não informada',
            company: user.company || '',
            location: user.location || '',
            connection_status: connectionStatus,
            mutual_connections: mutualCount,
            skills: user.profile_skills?.map((skill: any) => skill.name) || [],
            profile_completion_percentage: user.profile_completion_percentage || 0
          };
        })
      );

      return usersWithConnectionInfo;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async getConnectionStats(userId: string): Promise<ConnectionStats> {
    try {
      const [totalConnections, pendingRequests, sentRequests] = await Promise.all([
        // Total accepted connections
        supabase
          .from('connections')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', userId)
          .eq('status', 'accepted'),
        // Pending requests received
        supabase
          .from('connections')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', userId)
          .eq('status', 'pending'),
        // Sent requests pending
        supabase
          .from('connections')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', userId)
          .eq('status', 'pending')
      ]);

      return {
        total_connections: totalConnections.count || 0,
        pending_requests: pendingRequests.count || 0,
        sent_requests: sentRequests.count || 0,
        mutual_connections: 0 // This would need more complex calculation
      };
    } catch (error) {
      console.error('Error getting connection stats:', error);
      return {
        total_connections: 0,
        pending_requests: 0,
        sent_requests: 0,
        mutual_connections: 0
      };
    }
  }

  async getMutualConnections(userId: string, otherUserId: string): Promise<UserConnection[]> {
    try {
      // Get connections of both users
      const [userConnections, otherUserConnections] = await Promise.all([
        supabase
          .from('connections')
          .select('following_id')
          .eq('follower_id', userId)
          .eq('status', 'accepted'),
        supabase
          .from('connections')
          .select('following_id')
          .eq('follower_id', otherUserId)
          .eq('status', 'accepted')
      ]);

      if (!userConnections.data || !otherUserConnections.data) return [];

      // Find mutual connections
      const userConnectionIds = new Set(userConnections.data.map(c => c.following_id));
      const mutualConnectionIds = otherUserConnections.data
        .map(c => c.following_id)
        .filter(id => userConnectionIds.has(id));

      if (mutualConnectionIds.length === 0) return [];

      // Get user details for mutual connections
      const { data: mutualUsers, error } = await supabase
        .from('users')
        .select('id, name, avatar, occupation, company, location')
        .in('id', mutualConnectionIds);

      if (error) throw error;

      return mutualUsers?.map(user => ({
        id: user.id,
        name: user.name || 'Nome não informado',
        avatar: user.avatar || '',
        occupation: user.occupation || 'Ocupação não informada',
        company: user.company || '',
        location: user.location || '',
        connection_status: 'accepted' as const,
        mutual_connections: 0,
        skills: []
      })) || [];
    } catch (error) {
      console.error('Error getting mutual connections:', error);
      return [];
    }
  }

  // Helper methods
  private async getMutualConnectionsCount(userId: string, otherUserId: string): Promise<number> {
    try {
      const [userConnections, otherUserConnections] = await Promise.all([
        supabase
          .from('connections')
          .select('following_id')
          .eq('follower_id', userId)
          .eq('status', 'accepted'),
        supabase
          .from('connections')
          .select('following_id')
          .eq('follower_id', otherUserId)
          .eq('status', 'accepted')
      ]);

      if (!userConnections.data || !otherUserConnections.data) return 0;

      const userConnectionIds = new Set(userConnections.data.map(c => c.following_id));
      const mutualCount = otherUserConnections.data
        .filter(c => userConnectionIds.has(c.following_id))
        .length;

      return mutualCount;
    } catch (error) {
      console.error('Error getting mutual connections count:', error);
      return 0;
    }
  }

  private async createConnectionNotification(followerId: string, followingId: string, type: 'follow'): Promise<void> {
    try {
      // Get follower info
      const { data: follower } = await supabase
        .from('users')
        .select('name')
        .eq('id', followerId)
        .single();

      if (!follower) return;

      const title = type === 'follow' 
        ? `${follower.name} quer se conectar com você`
        : `${follower.name} aceitou sua solicitação de conexão`;

      await supabase
        .from('notifications')
        .insert([
          {
            user_id: followingId,
            type: 'follow',
            title: title,
            reference_id: followerId,
            reference_type: 'user'
          }
        ]);
    } catch (error) {
      console.error('Error creating connection notification:', error);
    }
  }
}

export const connectionsService = new ConnectionsService();