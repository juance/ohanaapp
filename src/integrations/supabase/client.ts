
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with placeholder values
// In a real app, these would be environment variables
export const supabase = createClient(
  'https://ebbarmqwvxkxqbzmkiby.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViYmFybXF3dnhreHFiem1raWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzAxMTMsImV4cCI6MjA1OTQ0NjExM30.y6I_OF2BWOtlo0MlXcOtmL1-N2EbBqNPrdALeJwZXNk'
);

export default supabase;
