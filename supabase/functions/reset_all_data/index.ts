
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
    
    if (loyaltyError) {
      console.error('Error resetting loyalty data:', loyaltyError)
      throw new Error(`Error resetting loyalty data: ${loyaltyError.message}`)
    }

    // Delete all ticket_laundry_options (need to delete these first due to foreign key constraints)
    const { error: optionsError } = await supabaseClient
      .from('ticket_laundry_options')
      .delete()
      .gt('id', '')  // This ensures we delete all records
    
    if (optionsError) {
      console.error('Error deleting ticket_laundry_options:', optionsError)
      throw new Error(`Error deleting ticket_laundry_options: ${optionsError.message}`)
    }

    // Delete all dry_cleaning_items (need to delete these first due to foreign key constraints)
    const { error: itemsError } = await supabaseClient
      .from('dry_cleaning_items')
      .delete()
      .gt('id', '')  // This ensures we delete all records
    
    if (itemsError) {
      console.error('Error deleting dry_cleaning_items:', itemsError)
      throw new Error(`Error deleting dry_cleaning_items: ${itemsError.message}`)
    }

    // Delete all tickets
    const { error: ticketsError } = await supabaseClient
      .from('tickets')
      .delete()
      .gt('id', '')  // This ensures we delete all records
    
    if (ticketsError) {
      console.error('Error deleting tickets:', ticketsError)
      throw new Error(`Error deleting tickets: ${ticketsError.message}`)
    }

    // Delete all expenses
    const { error: expensesError } = await supabaseClient
      .from('expenses')
      .delete()
      .gt('id', '')  // This ensures we delete all records
    
    if (expensesError) {
      console.error('Error deleting expenses:', expensesError)
      throw new Error(`Error deleting expenses: ${expensesError.message}`)
    }

    // Reset ticket sequence to start over
    const { error: sequenceError } = await supabaseClient
      .from('ticket_sequence')
      .update({ last_number: 0 })
      .eq('id', 1)
    
    if (sequenceError) {
      console.error('Error resetting ticket sequence:', sequenceError)
      throw new Error(`Error resetting ticket sequence: ${sequenceError.message}`)
    }

    console.log('Full data reset completed successfully!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'All application data has been reset successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error during data reset:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An error occurred during the data reset process'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,  // Return 200 even for errors to avoid the Edge Function error
      }
    )
  }
})
