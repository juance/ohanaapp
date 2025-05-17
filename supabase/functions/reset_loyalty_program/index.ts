
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

    console.log('Starting loyalty program reset...')

    // Reset all loyalty-related fields to zero
    const { data: updateData, error: updateError } = await supabaseClient
      .from('customers')
      .update({
        loyalty_points: 0,
        valets_count: 0,
        free_valets: 0,
        valets_redeemed: 0
      })
      .not('id', 'is', null)

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
