import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'mention';
  title: string;
  content: string | null;
  reference_id: string | null;
  reference_type: 'post' | 'comment' | 'user' | 'message' | null;
  is_read: boolean;
  created_at: string;
  actor?: {
    id: string;
    name: string;
    avatar: string;
  };
  reference_data?: any;
}

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  messages: boolean;
  mentions: boolean;
  push_notifications: boolean;
  email_notifications: boolean;
}

class NotificationsService {
  async getUserNotifications(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      if (!notifications) return [];

      // Enrich notifications with actor data and reference data
      const enrichedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          const [actor, referenceData] = await Promise.all([
            this.getNotificationActor(notification),
            this.getNotificationReferenceData(notification)
          ]);

          return {
            ...notification,
            actor,
            reference_data: referenceData
          };
        })
      );

      return enrichedNotifications;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread notifications count:', error);
      return 0;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async deleteAllNotifications(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }

  async createNotification(
    userId: string,
    type: 'like' | 'comment' | 'follow' | 'message' | 'mention',
    title: string,
    content?: string,
    referenceId?: string,
    referenceType?: 'post' | 'comment' | 'user' | 'message'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: userId,
            type,
            title,
            content: content || null,
            reference_id: referenceId || null,
            reference_type: referenceType || null
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getNotificationsByType(
    userId: string,
    type: 'like' | 'comment' | 'follow' | 'message' | 'mention',
    limit = 20
  ): Promise<Notification[]> {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      if (!notifications) return [];

      // Enrich notifications
      const enrichedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          const [actor, referenceData] = await Promise.all([
            this.getNotificationActor(notification),
            this.getNotificationReferenceData(notification)
          ]);

          return {
            ...notification,
            actor,
            reference_data: referenceData
          };
        })
      );

      return enrichedNotifications;
    } catch (error) {
      console.error('Error fetching notifications by type:', error);
      throw error;
    }
  }

  async getRecentActivity(userId: string, days = 7): Promise<Notification[]> {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', dateThreshold.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (!notifications) return [];

      // Enrich notifications
      const enrichedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          const [actor, referenceData] = await Promise.all([
            this.getNotificationActor(notification),
            this.getNotificationReferenceData(notification)
          ]);

          return {
            ...notification,
            actor,
            reference_data: referenceData
          };
        })
      );

      return enrichedNotifications;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  // Notification settings would typically be stored in a user preferences table
  // For now, we'll simulate with localStorage or AsyncStorage
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    // In a real app, this would come from the database
    return {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
      mentions: true,
      push_notifications: true,
      email_notifications: false
    };
  }

  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<void> {
    // In a real app, this would update the database
    console.log('Updating notification settings for user:', userId, settings);
  }

  // Real-time notification subscription
  subscribeToNotifications(userId: string, onNotification: (notification: Notification) => void) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          const notification = payload.new as any;
          
          // Enrich the notification
          const [actor, referenceData] = await Promise.all([
            this.getNotificationActor(notification),
            this.getNotificationReferenceData(notification)
          ]);

          onNotification({
            ...notification,
            actor,
            reference_data: referenceData
          });
        }
      )
      .subscribe();
  }

  // Helper methods
  private async getNotificationActor(notification: Notification): Promise<{ id: string; name: string; avatar: string; } | undefined> {
    try {
      // Extract actor ID from different notification types
      let actorId: string | null = null;

      if (notification.type === 'follow' && notification.reference_type === 'user') {
        actorId = notification.reference_id;
      } else if (notification.type === 'like' || notification.type === 'comment') {
        // For likes and comments, we need to trace back to find the user
        if (notification.reference_type === 'post') {
          // Get the most recent like/comment on this post to find the actor
          const table = notification.type === 'like' ? 'post_likes' : 'comments';
          const { data } = await supabase
            .from(table)
            .select('user_id')
            .eq(notification.type === 'like' ? 'post_id' : 'post_id', notification.reference_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          actorId = data?.user_id || null;
        }
      } else if (notification.type === 'message') {
        // For messages, get the sender
        if (notification.reference_id) {
          const { data } = await supabase
            .from('messages')
            .select('sender_id')
            .eq('id', notification.reference_id)
            .single();
          
          actorId = data?.sender_id || null;
        }
      }

      if (!actorId) return undefined;

      // Get user info
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, avatar')
        .eq('id', actorId)
        .single();

      if (error || !user) return undefined;

      return {
        id: user.id,
        name: user.name || 'Usuário',
        avatar: user.avatar || ''
      };
    } catch (error) {
      console.error('Error getting notification actor:', error);
      return undefined;
    }
  }

  private async getNotificationReferenceData(notification: Notification): Promise<any> {
    try {
      if (!notification.reference_id || !notification.reference_type) {
        return null;
      }

      switch (notification.reference_type) {
        case 'post':
          const { data: post } = await supabase
            .from('posts')
            .select('id, content, created_at')
            .eq('id', notification.reference_id)
            .single();
          return post;

        case 'comment':
          const { data: comment } = await supabase
            .from('comments')
            .select('id, content, created_at')
            .eq('id', notification.reference_id)
            .single();
          return comment;

        case 'user':
          const { data: user } = await supabase
            .from('users')
            .select('id, name, avatar, occupation')
            .eq('id', notification.reference_id)
            .single();
          return user;

        case 'message':
          const { data: message } = await supabase
            .from('messages')
            .select('id, content, created_at')
            .eq('id', notification.reference_id)
            .single();
          return message;

        default:
          return null;
      }
    } catch (error) {
      console.error('Error getting notification reference data:', error);
      return null;
    }
  }
}

export const notificationsService = new NotificationsService();