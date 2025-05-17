
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client for the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting metrics reset...')

    // Clear dashboard_stats table
    const { error: deleteError } = await supabaseClient
      .from('dashboard_stats')
      .delete()
      .not('id', 'is', null)

    if (deleteError) {
      console.error('Error deleting dashboard stats:', deleteError)
      throw deleteError
    }

    console.log('Metrics reset completed successfully!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Metrics reset completed successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error resetting metrics:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An error occurred while resetting metrics'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
