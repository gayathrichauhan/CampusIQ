import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fseiujydpjhsaghhmmmz.supabase.co'
const supabaseKey = 'YOUR_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)