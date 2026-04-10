import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fseiujydpjhsaghhmmmz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZWl1anlkcGpoc2FnaGhtbW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3ODI3ODgsImV4cCI6MjA5MTM1ODc4OH0.zWx4J9xQ4ViSxdnMSpPKbHuOml_8Hr75pX9rsu_o6Ms'

export const supabase = createClient(supabaseUrl, supabaseKey)