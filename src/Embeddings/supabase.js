import { createClient } from '@supabase/supabase-js'
import { EXPO_PUBLIC_SUPABASE_URL, SUPABASE_KEY } from '../api/SupabaseAPIKeys.js'

export const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_KEY,
)