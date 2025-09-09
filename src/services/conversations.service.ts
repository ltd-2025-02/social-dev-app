import { supabase } from '../lib/supabase';

export interface Conversation {
  id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
  unread_count?: number;
  other_participant?: {
    id: string;
    name: string;
    avatar: string;
    occupation: string;
  };
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
    occupation: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    name: string;
    avatar: string;
  };
}

class ConversationsService {
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const { data: participantConversations, error } = await supabase
        .from('conversation_participants')
        .select(`
          *,
          conversations (
            *,
            conversation_participants!inner (
              *,
              users!conversation_participants_user_id_fkey (
                id,
                name,
                avatar,
                occupation
              )
            )
          )
        `)
        .eq('user_id', userId)
        .order('last_read_at', { ascending: false });

      if (error) throw error;

      if (!participantConversations) return [];

      const conversations = participantConversations
        .map(pc => pc.conversations)
        .filter(Boolean);

      const conversationsWithMetadata = await Promise.all(
        conversations.map(async (conversation: any) => {
          const [lastMessage, unreadCount] = await Promise.all([
            this.getLastMessage(conversation.id),
            this.getUnreadMessageCount(conversation.id, userId)
          ]);

          // Find the other participant (not the current user)
          const otherParticipant = conversation.conversation_participants
            ?.find((p: any) => p.user_id !== userId)?.users;

          return {
            ...conversation,
            participants: conversation.conversation_participants?.map((p: any) => ({
              ...p,
              user: p.users
            })),
            last_message: lastMessage,
            unread_count: unreadCount,
            other_participant: otherParticipant
          };
        })
      );

      return conversationsWithMetadata;
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      throw error;
    }
  }

  async getOrCreateConversation(userId1: string, userId2: string): Promise<Conversation> {
    try {
      // First, try to find existing conversation
      const existingConversation = await this.findConversationBetweenUsers(userId1, userId2);
      
      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert([
          {
            created_by: userId1
          }
        ])
        .select('*')
        .single();

      if (conversationError) throw conversationError;

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          {
            conversation_id: conversation.id,
            user_id: userId1
          },
          {
            conversation_id: conversation.id,
            user_id: userId2
          }
        ]);

      if (participantsError) throw participantsError;

      // Get the complete conversation with participants
      return await this.getConversationById(conversation.id, userId1);
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async getConversationById(conversationId: string, userId: string): Promise<Conversation> {
    try {
      const { data: conversation, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants (
            *,
            users!conversation_participants_user_id_fkey (
              id,
              name,
              avatar,
              occupation
            )
          )
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      const [lastMessage, unreadCount] = await Promise.all([
        this.getLastMessage(conversation.id),
        this.getUnreadMessageCount(conversation.id, userId)
      ]);

      // Find the other participant
      const otherParticipant = conversation.conversation_participants
        ?.find((p: any) => p.user_id !== userId)?.users;

      return {
        ...conversation,
        participants: conversation.conversation_participants?.map((p: any) => ({
          ...p,
          user: p.users
        })),
        last_message: lastMessage,
        unread_count: unreadCount,
        other_participant: otherParticipant
      };
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async getConversationMessages(conversationId: string, userId: string, limit = 50, offset = 0): Promise<Message[]> {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          users!messages_sender_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      if (!messages) return [];

      // Mark messages as read
      await this.markMessagesAsRead(conversationId, userId);

      return messages.map(message => ({
        ...message,
        sender: message.users
      })).reverse();
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text'
  ): Promise<Message> {
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: senderId,
            content,
            message_type: messageType
          }
        ])
        .select(`
          *,
          users!messages_sender_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .single();

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Create notification for other participants
      await this.createMessageNotification(conversationId, senderId, message.id);

      return {
        ...message,
        sender: message.users
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      // Mark all unread messages in this conversation as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .eq('is_read', false);

      // Update participant's last read timestamp
      await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    try {
      // Check if user is participant
      const { data: participant } = await supabase
        .from('conversation_participants')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)
        .single();

      if (!participant) {
        throw new Error('User is not a participant in this conversation');
      }

      // Remove user from conversation
      await supabase
        .from('conversation_participants')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

      // Check if conversation has any participants left
      const { data: remainingParticipants } = await supabase
        .from('conversation_participants')
        .select('id')
        .eq('conversation_id', conversationId);

      // If no participants left, delete the conversation and its messages
      if (!remainingParticipants || remainingParticipants.length === 0) {
        await supabase
          .from('messages')
          .delete()
          .eq('conversation_id', conversationId);

        await supabase
          .from('conversations')
          .delete()
          .eq('id', conversationId);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  async searchMessages(conversationId: string, query: string): Promise<Message[]> {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          users!messages_sender_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .eq('conversation_id', conversationId)
        .textSearch('content', query)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return messages?.map(message => ({
        ...message,
        sender: message.users
      })) || [];
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  // Helper methods
  private async findConversationBetweenUsers(userId1: string, userId2: string): Promise<Conversation | null> {
    try {
      // Find conversations where both users are participants
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants!inner (
            user_id
          )
        `);

      if (error) throw error;

      if (!conversations) return null;

      // Filter conversations to find one with exactly these two users
      for (const conversation of conversations) {
        const participantIds = conversation.conversation_participants.map((p: any) => p.user_id);
        
        if (participantIds.length === 2 && 
            participantIds.includes(userId1) && 
            participantIds.includes(userId2)) {
          return await this.getConversationById(conversation.id, userId1);
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding conversation between users:', error);
      return null;
    }
  }

  private async getLastMessage(conversationId: string): Promise<Message | null> {
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .select(`
          *,
          users!messages_sender_id_fkey (
            id,
            name,
            avatar
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return message ? {
        ...message,
        sender: message.users
      } : null;
    } catch (error) {
      console.error('Error getting last message:', error);
      return null;
    }
  }

  private async getUnreadMessageCount(conversationId: string, userId: string): Promise<number> {
    try {
      // Get user's last read timestamp
      const { data: participant, error: participantError } = await supabase
        .from('conversation_participants')
        .select('last_read_at')
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)
        .single();

      if (participantError) return 0;

      // Count messages after last read
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId) // Don't count own messages
        .gt('created_at', participant.last_read_at);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return 0;
    }
  }

  private async createMessageNotification(conversationId: string, senderId: string, messageId: string): Promise<void> {
    try {
      // Get sender info
      const { data: sender } = await supabase
        .from('users')
        .select('name')
        .eq('id', senderId)
        .single();

      if (!sender) return;

      // Get other participants
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId)
        .neq('user_id', senderId);

      if (!participants) return;

      // Create notifications for other participants
      const notifications = participants.map(participant => ({
        user_id: participant.user_id,
        type: 'message' as const,
        title: `Nova mensagem de ${sender.name}`,
        reference_id: messageId,
        reference_type: 'message' as const
      }));

      if (notifications.length > 0) {
        await supabase
          .from('notifications')
          .insert(notifications);
      }
    } catch (error) {
      console.error('Error creating message notification:', error);
    }
  }
}

export const conversationsService = new ConversationsService();