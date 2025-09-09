import { supabase } from '../lib/supabase';

export interface ChatRoom {
  id: string;
  name: string;
  description: string | null;
  technology: string | null;
  icon: string | null;
  color: string;
  is_public: boolean;
  max_members: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  user_role?: 'member' | 'moderator' | 'admin';
  last_message?: ChatMessage;
  unread_count?: number;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'code' | 'image' | 'file' | 'poll' | 'system';
  reply_to: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
  reactions?: MessageReaction[];
  code_snippet?: CodeSnippet;
  poll?: Poll;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface CodeSnippet {
  id: string;
  message_id: string;
  title: string | null;
  language: string;
  code: string;
  description: string | null;
  created_at: string;
}

export interface Poll {
  id: string;
  message_id: string;
  question: string;
  options: string[];
  multiple_choice: boolean;
  expires_at: string | null;
  created_at: string;
  votes?: PollVote[];
  total_votes?: number;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_index: number;
  created_at: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
  last_seen_at: string;
  is_muted: boolean;
  user?: {
    id: string;
    name: string;
    avatar: string;
    occupation: string;
  };
}

class ChatService {
  async getPublicRooms(userId?: string): Promise<ChatRoom[]> {
    try {
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          chat_room_members!inner(user_id, role)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!rooms) return [];

      const roomsWithMetadata = await Promise.all(
        rooms.map(async (room) => {
          const [memberCount, userRole, lastMessage] = await Promise.all([
            this.getRoomMemberCount(room.id),
            userId ? this.getUserRoleInRoom(room.id, userId) : Promise.resolve(null),
            this.getLastRoomMessage(room.id)
          ]);

          return {
            ...room,
            member_count: memberCount,
            user_role: userRole,
            last_message: lastMessage
          };
        })
      );

      return roomsWithMetadata;
    } catch (error) {
      console.error('Error fetching public rooms:', error);
      throw error;
    }
  }

  async getUserRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const { data: memberRooms, error } = await supabase
        .from('chat_room_members')
        .select(`
          role,
          joined_at,
          chat_rooms (
            *
          )
        `)
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      if (!memberRooms) return [];

      const rooms = memberRooms.map(memberRoom => memberRoom.chat_rooms).filter(Boolean);

      const roomsWithMetadata = await Promise.all(
        rooms.map(async (room: any) => {
          const memberRole = memberRooms.find(mr => mr.chat_rooms?.id === room.id)?.role;
          const [memberCount, lastMessage, unreadCount] = await Promise.all([
            this.getRoomMemberCount(room.id),
            this.getLastRoomMessage(room.id),
            this.getUnreadMessageCount(room.id, userId)
          ]);

          return {
            ...room,
            member_count: memberCount,
            user_role: memberRole,
            last_message: lastMessage,
            unread_count: unreadCount
          };
        })
      );

      return roomsWithMetadata;
    } catch (error) {
      console.error('Error fetching user rooms:', error);
      throw error;
    }
  }

  async getRoomMessages(roomId: string, userId?: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          users!chat_messages_user_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .eq('room_id', roomId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      if (!messages) return [];

      const messagesWithMetadata = await Promise.all(
        messages.map(async (message) => {
          const [reactions, codeSnippet, poll] = await Promise.all([
            this.getMessageReactions(message.id),
            message.message_type === 'code' ? this.getCodeSnippet(message.id) : Promise.resolve(null),
            message.message_type === 'poll' ? this.getPoll(message.id) : Promise.resolve(null)
          ]);

          return {
            ...message,
            user: message.users,
            reactions,
            code_snippet: codeSnippet,
            poll
          };
        })
      );

      // Update last seen for user
      if (userId) {
        await this.updateLastSeen(roomId, userId);
      }

      return messagesWithMetadata.reverse();
    } catch (error) {
      console.error('Error fetching room messages:', error);
      throw error;
    }
  }

  async sendMessage(
    roomId: string,
    userId: string,
    content: string,
    messageType: 'text' | 'code' | 'image' | 'file' | 'poll' = 'text',
    replyTo?: string,
    metadata?: any
  ): Promise<ChatMessage> {
    try {
      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            room_id: roomId,
            user_id: userId,
            content,
            message_type: messageType,
            reply_to: replyTo || null,
            metadata: metadata || null
          }
        ])
        .select(`
          *,
          users!chat_messages_user_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .single();

      if (error) throw error;

      return {
        ...message,
        user: message.users,
        reactions: [],
        code_snippet: null,
        poll: null
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async sendCodeSnippet(
    roomId: string,
    userId: string,
    title: string,
    language: string,
    code: string,
    description?: string
  ): Promise<ChatMessage> {
    try {
      // First create the message
      const message = await this.sendMessage(
        roomId,
        userId,
        `Compartilhou um snippet de código: ${title}`,
        'code'
      );

      // Then create the code snippet
      const { error: snippetError } = await supabase
        .from('chat_code_snippets')
        .insert([
          {
            message_id: message.id,
            title,
            language,
            code,
            description
          }
        ]);

      if (snippetError) throw snippetError;

      // Fetch the code snippet
      const codeSnippet = await this.getCodeSnippet(message.id);

      return {
        ...message,
        code_snippet: codeSnippet
      };
    } catch (error) {
      console.error('Error sending code snippet:', error);
      throw error;
    }
  }

  async createPoll(
    roomId: string,
    userId: string,
    question: string,
    options: string[],
    multipleChoice = false,
    expiresAt?: Date
  ): Promise<ChatMessage> {
    try {
      // First create the message
      const message = await this.sendMessage(
        roomId,
        userId,
        `Criou uma enquete: ${question}`,
        'poll'
      );

      // Then create the poll
      const { error: pollError } = await supabase
        .from('chat_polls')
        .insert([
          {
            message_id: message.id,
            question,
            options,
            multiple_choice: multipleChoice,
            expires_at: expiresAt?.toISOString() || null
          }
        ]);

      if (pollError) throw pollError;

      // Fetch the poll
      const poll = await this.getPoll(message.id);

      return {
        ...message,
        poll
      };
    } catch (error) {
      console.error('Error creating poll:', error);
      throw error;
    }
  }

  async voteOnPoll(pollId: string, userId: string, optionIndex: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_poll_votes')
        .insert([
          {
            poll_id: pollId,
            user_id: userId,
            option_index: optionIndex
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error voting on poll:', error);
      throw error;
    }
  }

  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_message_reactions')
        .insert([
          {
            message_id: messageId,
            user_id: userId,
            emoji
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  }

  async joinRoom(roomId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_room_members')
        .insert([
          {
            room_id: roomId,
            user_id: userId,
            role: 'member'
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_room_members')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }

  async getRoomMembers(roomId: string): Promise<RoomMember[]> {
    try {
      const { data: members, error } = await supabase
        .from('chat_room_members')
        .select(`
          *,
          users!chat_room_members_user_id_fkey (
            id,
            name,
            avatar,
            occupation
          )
        `)
        .eq('room_id', roomId)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      return members?.map(member => ({
        ...member,
        user: member.users
      })) || [];
    } catch (error) {
      console.error('Error fetching room members:', error);
      throw error;
    }
  }

  // Helper methods
  private async getRoomMemberCount(roomId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('chat_room_members')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', roomId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting room member count:', error);
      return 0;
    }
  }

  private async getUserRoleInRoom(roomId: string, userId: string): Promise<'member' | 'moderator' | 'admin' | null> {
    try {
      const { data: member, error } = await supabase
        .from('chat_room_members')
        .select('role')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return member?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  private async getLastRoomMessage(roomId: string): Promise<ChatMessage | null> {
    try {
      const { data: message, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          users!chat_messages_user_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .eq('room_id', roomId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return message ? {
        ...message,
        user: message.users,
        reactions: [],
        code_snippet: null,
        poll: null
      } : null;
    } catch (error) {
      console.error('Error getting last room message:', error);
      return null;
    }
  }

  private async getUnreadMessageCount(roomId: string, userId: string): Promise<number> {
    try {
      // Get user's last seen timestamp
      const { data: member, error: memberError } = await supabase
        .from('chat_room_members')
        .select('last_seen_at')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .single();

      if (memberError) return 0;

      // Count messages after last seen
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', roomId)
        .neq('user_id', userId) // Don't count own messages
        .eq('is_deleted', false)
        .gt('created_at', member.last_seen_at);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return 0;
    }
  }

  private async getMessageReactions(messageId: string): Promise<MessageReaction[]> {
    try {
      const { data: reactions, error } = await supabase
        .from('chat_message_reactions')
        .select(`
          *,
          users!chat_message_reactions_user_id_fkey (
            id,
            name
          )
        `)
        .eq('message_id', messageId);

      if (error) throw error;

      return reactions?.map(reaction => ({
        ...reaction,
        user: reaction.users
      })) || [];
    } catch (error) {
      console.error('Error getting message reactions:', error);
      return [];
    }
  }

  private async getCodeSnippet(messageId: string): Promise<CodeSnippet | null> {
    try {
      const { data: snippet, error } = await supabase
        .from('chat_code_snippets')
        .select('*')
        .eq('message_id', messageId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return snippet;
    } catch (error) {
      console.error('Error getting code snippet:', error);
      return null;
    }
  }

  private async getPoll(messageId: string): Promise<Poll | null> {
    try {
      const { data: poll, error } = await supabase
        .from('chat_polls')
        .select('*')
        .eq('message_id', messageId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!poll) return null;

      // Get poll votes
      const votes = await this.getPollVotes(poll.id);
      
      return {
        ...poll,
        votes,
        total_votes: votes.length
      };
    } catch (error) {
      console.error('Error getting poll:', error);
      return null;
    }
  }

  private async getPollVotes(pollId: string): Promise<PollVote[]> {
    try {
      const { data: votes, error } = await supabase
        .from('chat_poll_votes')
        .select(`
          *,
          users!chat_poll_votes_user_id_fkey (
            id,
            name
          )
        `)
        .eq('poll_id', pollId);

      if (error) throw error;

      return votes?.map(vote => ({
        ...vote,
        user: vote.users
      })) || [];
    } catch (error) {
      console.error('Error getting poll votes:', error);
      return [];
    }
  }

  private async updateLastSeen(roomId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_room_members')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('room_id', roomId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating last seen:', error);
    }
  }
}

export const chatService = new ChatService();