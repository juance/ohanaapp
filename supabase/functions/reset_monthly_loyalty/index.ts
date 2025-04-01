
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

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Only allow this function to be called from the Supabase edge function hooks
    // In a real scenario, we would validate the JWT token here
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('Starting monthly loyalty program reset...')

    // Reset loyalty points back to 0
    const { data: updateData, error: updateError } = await supabaseClient
      .from('customers')
      .update({
        loyalty_points: 0
      })
      .not('loyalty_points', 'eq', 0)

    if (updateError) {
      throw updateError
    }

    console.log('Loyalty program reset completed successfully!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Loyalty program reset completed successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error resetting loyalty program:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An error occurred while resetting the loyalty program'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
