
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ebbarmqwvxkxqbzmkiby.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViYmFybXF3dnhreHFiem1raWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzAxMTMsImV4cCI6MjA1OTQ0NjExM30.y6I_OF2BWOtlo0MlXcOtmL1-N2EbBqNPrdALeJwZXNk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'ohanaapp',
      },
    },
  }
);
