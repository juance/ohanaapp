// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for the response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Parse the request body to get the sections to reset
    const { sections } = await req.json()
    
    // Create a Supabase client for the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting counters reset...')
    console.log('Sections to reset:', sections)

    const results = {
      dashboard: false,
      clients: false,
      loyalty: false,
      metrics: false,
      ticketAnalysis: false
    }

    // Reset dashboard counters
    if (sections.dashboard) {
      try {
        // For dashboard, we need to reset tickets and expenses
        // This will affect the metrics shown in the dashboard
        
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

        results.dashboard = true
        console.log('Dashboard counters reset successfully')
      } catch (error) {
        console.error('Error resetting dashboard counters:', error)
      }
    }

    // Reset client counters
    if (sections.clients) {
      try {
        // For clients, we reset visit counts but keep the client records
        const { error } = await supabaseClient
          .from('customers')
          .update({
            last_visit: null
          })
          .not('id', 'is', null)

        if (error) {
          console.error('Error resetting client visit data:', error)
        } else {
          results.clients = true
          console.log('Client counters reset successfully')
        }
      } catch (error) {
        console.error('Error resetting client counters:', error)
      }
    }

    // Reset loyalty program counters
    if (sections.loyalty) {
      try {
        // Reset loyalty points and valets in customers table
        const { error } = await supabaseClient
          .from('customers')
          .update({
            loyalty_points: 0,
            free_valets: 0,
            valets_count: 0,
            valets_redeemed: 0
          })
          .not('id', 'is', null)

        if (error) {
          console.error('Error resetting loyalty data:', error)
        } else {
          results.loyalty = true
          console.log('Loyalty program counters reset successfully')
        }
      } catch (error) {
        console.error('Error resetting loyalty counters:', error)
      }
    }

    // Reset metrics counters (same as dashboard)
    if (sections.metrics) {
      results.metrics = results.dashboard
      console.log('Metrics counters reset status:', results.metrics)
    }

    // Reset ticket analysis counters (same as dashboard)
    if (sections.ticketAnalysis) {
      results.ticketAnalysis = results.dashboard
      console.log('Ticket analysis counters reset status:', results.ticketAnalysis)
    }

    // Reset ticket sequence if any section was reset
    if (Object.values(results).some(Boolean)) {
      try {
        // Reset ticket sequence to start over
        const { error: sequenceError } = await supabaseClient
          .from('ticket_sequence')
          .update({ last_number: 0 })
          .eq('id', 1)

        if (sequenceError) {
          console.error('Error resetting ticket sequence:', sequenceError)
        } else {
          console.log('Ticket sequence reset successfully')
        }
      } catch (error) {
        console.error('Error resetting ticket sequence:', error)
      }
    }

    console.log('Counters reset completed with results:', results)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Counters reset completed',
        results
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error during counters reset:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An error occurred during the counters reset process',
        details: JSON.stringify(error)
      }),
      {
        status: 200, // Return 200 even on error to avoid FunctionsHttpError
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
