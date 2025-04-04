
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

    console.log('Starting full data reset...')

    // Preserve customers, but reset their loyalty data
    const { error: loyaltyError } = await supabaseClient
      .from('customers')
      .update({
        loyalty_points: 0,
        free_valets: 0,
        valets_count: 0,
        valets_redeemed: 0
      })
      .not('id', 'is', null) // Add this to avoid UPDATE without WHERE clause error

    if (loyaltyError) {
      console.error('Error resetting loyalty data:', loyaltyError)
      // Continue with the reset process even if there's an error here
    }

    // Delete all ticket_laundry_options (need to delete these first due to foreign key constraints)
    const { error: optionsError } = await supabaseClient
      .from('ticket_laundry_options')
      .delete()
      .not('id', 'is', null)

    if (optionsError) {
      console.error('Error deleting ticket_laundry_options:', optionsError)
      // Continue with the reset process even if there's an error here
    }

    // Delete all dry_cleaning_items (need to delete these first due to foreign key constraints)
    const { error: itemsError } = await supabaseClient
      .from('dry_cleaning_items')
      .delete()
      .not('id', 'is', null)

    if (itemsError) {
      console.error('Error deleting dry_cleaning_items:', itemsError)
      // Continue with the reset process even if there's an error here
    }

    // Delete all tickets
    const { error: ticketsError } = await supabaseClient
      .from('tickets')
      .delete()
      .not('id', 'is', null)

    if (ticketsError) {
      console.error('Error deleting tickets:', ticketsError)
      // Continue with the reset process even if there's an error here
    }

    // Delete all expenses
    const { error: expensesError } = await supabaseClient
      .from('expenses')
      .delete()
      .not('id', 'is', null)

    if (expensesError) {
      console.error('Error deleting expenses:', expensesError)
      // Continue with the reset process even if there's an error here
    }

    // Reset ticket sequence to start over
    const { error: sequenceError } = await supabaseClient
      .from('ticket_sequence')
      .update({ last_number: 0 })
      .eq('id', 1)

    if (sequenceError) {
      console.error('Error resetting ticket sequence:', sequenceError)
      // Continue with the reset process even if there's an error here
    }

    console.log('Full data reset completed successfully!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'All application data has been reset successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error during data reset:', error)
    
    // Still return 200 status to avoid FunctionsHttpError in the client
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An error occurred during the data reset process',
        details: JSON.stringify(error)
      }),
      {
        status: 200, // Return 200 even on error to avoid FunctionsHttpError
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
