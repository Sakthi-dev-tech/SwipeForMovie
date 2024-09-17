import { createClient } from '@supabase/supabase-js'
import {SUPABASE_KEY, EXPO_PUBLIC_SUPABASE_URL} from './SupabaseAPIKeys.js'

export const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_KEY,
) 