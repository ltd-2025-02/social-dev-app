
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
