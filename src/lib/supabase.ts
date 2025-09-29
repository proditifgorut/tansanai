import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (url?: string, key?: string): SupabaseClient | null => {
  if (supabaseClient) {
    return supabaseClient;
  }
  if (url && key) {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  }
  return null;
};
