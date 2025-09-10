import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://liuvdlifoqurfyoqlxdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpdXZkbGlmb3F1cmZ5b3FseGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMDUxOTMsImV4cCI6MjA3Mjc4MTE5M30.tW958nxenRvDMVYNwzDIrnmmMcyIWgVgVwMXckT0Vfw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string | null;
          name: string | null;
          email: string | null;
          avatar: string | null;
          persona_id: string | null;
          occupation: string | null;
          company: string | null;
          bio: string | null;
          website: string | null;
          about: string | null;
          location: string | null;
          phone: string | null;
          headline: string | null;
          profile_visibility: 'public' | 'connections' | 'private';
          profile_completion_percentage: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          name?: string | null;
          email?: string | null;
          avatar?: string | null;
          persona_id?: string | null;
          occupation?: string | null;
          company?: string | null;
          bio?: string | null;
          website?: string | null;
          about?: string | null;
          location?: string | null;
          phone?: string | null;
          headline?: string | null;
          profile_visibility?: 'public' | 'connections' | 'private';
          profile_completion_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string | null;
          name?: string | null;
          email?: string | null;
          avatar?: string | null;
          persona_id?: string | null;
          occupation?: string | null;
          company?: string | null;
          bio?: string | null;
          website?: string | null;
          about?: string | null;
          location?: string | null;
          phone?: string | null;
          headline?: string | null;
          profile_visibility?: 'public' | 'connections' | 'private';
          profile_completion_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      connections: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_rooms: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          technology?: string | null;
          icon?: string | null;
          color?: string;
          is_public?: boolean;
          max_members?: number;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          technology?: string | null;
          icon?: string | null;
          color?: string;
          is_public?: boolean;
          max_members?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
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
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          content: string;
          message_type?: 'text' | 'code' | 'image' | 'file' | 'poll' | 'system';
          reply_to?: string | null;
          is_edited?: boolean;
          is_deleted?: boolean;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          content?: string;
          message_type?: 'text' | 'code' | 'image' | 'file' | 'poll' | 'system';
          reply_to?: string | null;
          is_edited?: boolean;
          is_deleted?: boolean;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          message_type: 'text' | 'image' | 'file';
          is_read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          message_type?: 'text' | 'image' | 'file';
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          message_type?: 'text' | 'image' | 'file';
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'like' | 'comment' | 'follow' | 'message' | 'mention';
          title: string;
          content: string | null;
          reference_id: string | null;
          reference_type: 'post' | 'comment' | 'user' | 'message' | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'like' | 'comment' | 'follow' | 'message' | 'mention';
          title: string;
          content?: string | null;
          reference_id?: string | null;
          reference_type?: 'post' | 'comment' | 'user' | 'message' | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'like' | 'comment' | 'follow' | 'message' | 'mention';
          title?: string;
          content?: string | null;
          reference_id?: string | null;
          reference_type?: 'post' | 'comment' | 'user' | 'message' | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      profile_skills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          category: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other';
          years_of_experience: number | null;
          is_endorsed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          category?: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other';
          years_of_experience?: number | null;
          is_endorsed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          category?: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other';
          years_of_experience?: number | null;
          is_endorsed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};