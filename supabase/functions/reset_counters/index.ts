
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Parse request body
    const requestData = await req.json();
    console.log("Request data received:", requestData);
    
    let result;

    // Check what type of reset is being requested
    if (requestData && requestData.counter === "all") {
      console.log("Resetting all counters");
      result = await resetAllCounters(supabaseClient);
    } 
    // Check if the request is for resetting dashboard counters
    else if (requestData && requestData.counters) {
      console.log("Resetting dashboard counters:", requestData.counters);
      result = await resetDashboardCounters(supabaseClient, requestData.counters);
    }
    // Check if the request is for resetting a specific counter
    else if (requestData && requestData.counter) {
      console.log("Resetting specific counter:", requestData.counter);
      result = await resetSpecificCounter(supabaseClient, requestData.counter, requestData.options || {});
    }
    else {
      throw new Error("Invalid request format. Expected 'counter', 'counters', or other valid parameters.");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in reset_counters:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al reiniciar contadores" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function resetAllCounters(supabaseClient) {
  try {
    // Reset ticket sequence
    await supabaseClient.rpc("reset_ticket_sequence");
    
    // Delete ticket_laundry_options (need to delete these first due to foreign key constraints)
    await supabaseClient
      .from('ticket_laundry_options')
      .delete()
      .not('id', 'is', null);

    // Delete dry_cleaning_items (need to delete these first due to foreign key constraints)
    await supabaseClient
      .from('dry_cleaning_items')
      .delete()
      .not('id', 'is', null);

    // Delete all tickets
    await supabaseClient
      .from('tickets')
      .delete()
      .not('id', 'is', null);
      
    // Reset client counters
    await supabaseClient
      .from("customers")
      .update({
        loyalty_points: 0,
        free_valets: 0,
        valets_count: 0,
        valets_redeemed: 0
      })
      .not('id', 'is', null);
      
    // Delete expenses
    await supabaseClient
      .from('expenses')
      .delete()
      .not('id', 'is', null);
    
    return { 
      success: true, 
      message: "Todos los contadores han sido reiniciados exitosamente" 
    };
  } catch (error) {
    console.error("Error resetting all counters:", error);
    throw error;
  }
}

async function resetDashboardCounters(supabaseClient, counters) {
  const results = {
    tickets: false,
    paidTickets: false,
    revenue: false,
    expenses: false,
    freeValets: false
  };

  try {
    // Reset tickets counter
    if (counters.tickets) {
      try {
        // Delete ticket_laundry_options (need to delete these first due to foreign key constraints)
        await supabaseClient
          .from('ticket_laundry_options')
          .delete()
          .not('id', 'is', null);

        // Delete dry_cleaning_items (need to delete these first due to foreign key constraints)
        await supabaseClient
          .from('dry_cleaning_items')
          .delete()
          .not('id', 'is', null);

        // Delete all tickets
        await supabaseClient
          .from('tickets')
          .delete()
          .not('id', 'is', null);

        // Reset ticket sequence
        await supabaseClient.rpc("reset_ticket_sequence");

        results.tickets = true;
        console.log('Tickets counter reset successfully');
      } catch (error) {
        console.error('Error resetting tickets counter:', error);
      }
    }

    // Reset paid tickets counter
    if (counters.paidTickets) {
      try {
        // If tickets are already reset, we don't need to do anything extra
        if (results.tickets) {
          results.paidTickets = true;
        } else {
          // Update all tickets to be unpaid
          await supabaseClient
            .from('tickets')
            .update({
              is_paid: false,
              payment_method: null
            })
            .not('id', 'is', null);

          results.paidTickets = true;
          console.log('Paid tickets counter reset successfully');
        }
      } catch (error) {
        console.error('Error resetting paid tickets counter:', error);
      }
    }

    // Reset revenue data
    if (counters.revenue) {
      try {
        // If tickets are already reset, we don't need to do anything extra for revenue
        if (results.tickets) {
          results.revenue = true;
        } else {
          // Update all tickets to have zero revenue
          await supabaseClient
            .from('tickets')
            .update({
              total: 0
            })
            .not('id', 'is', null);

          results.revenue = true;
          console.log('Revenue data reset successfully');
        }
      } catch (error) {
        console.error('Error resetting revenue data:', error);
      }
    }

    // Reset expenses data
    if (counters.expenses) {
      try {
        // Delete all expenses
        await supabaseClient
          .from('expenses')
          .delete()
          .not('id', 'is', null);

        results.expenses = true;
        console.log('Expenses data reset successfully');
      } catch (error) {
        console.error('Error resetting expenses data:', error);
      }
    }

    // Reset free valets counter
    if (counters.freeValets) {
      try {
        // Reset free valets in customers table
        await supabaseClient
          .from('customers')
          .update({
            free_valets: 0,
            valets_count: 0,
            valets_redeemed: 0
          })
          .not('id', 'is', null);

        results.freeValets = true;
        console.log('Free valets counter reset successfully');
      } catch (error) {
        console.error('Error resetting free valets counter:', error);
      }
    }

    // Check if at least one counter was reset successfully
    const success = Object.values(results).some(Boolean);
    
    return {
      success,
      results,
      message: success 
        ? "Los contadores seleccionados han sido reiniciados exitosamente" 
        : "No se pudo reiniciar ningún contador"
    };
  } catch (error) {
    console.error("Error resetting dashboard counters:", error);
    throw error;
  }
}

async function resetSpecificCounter(supabaseClient, counter, options) {
  try {
    switch (counter) {
      case "tickets":
        // Reset ticket sequence
        await supabaseClient.rpc("reset_ticket_sequence");
        
        // Delete ticket_laundry_options (need to delete these first due to foreign key constraints)
        await supabaseClient
          .from('ticket_laundry_options')
          .delete()
          .not('id', 'is', null);

        // Delete dry_cleaning_items (need to delete these first due to foreign key constraints)
        await supabaseClient
          .from('dry_cleaning_items')
          .delete()
          .not('id', 'is', null);

        // Delete all tickets
        await supabaseClient
          .from('tickets')
          .delete()
          .not('id', 'is', null);
          
        return { 
          success: true, 
          message: "Numeración de tickets reiniciada a 0" 
        };
        
      case "clients":
        // Reset client counters
        await supabaseClient
          .from("customers")
          .update({
            loyalty_points: 0,
            free_valets: 0,
            valets_count: 0,
            valets_redeemed: 0
          })
          .not('id', 'is', null);
          
        return { 
          success: true, 
          message: "Contadores de clientes reiniciados" 
        };
        
      case "revenue":
        // Reset revenue data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        await supabaseClient
          .from('tickets')
          .update({
            total: 0,
            is_paid: false
          })
          .gte('created_at', thirtyDaysAgo.toISOString())
          .is('is_canceled', false);
          
        return { 
          success: true, 
          message: "Datos de ingresos reiniciados" 
        };

      case "loyalty":
        // Reset loyalty points and free valets
        await supabaseClient
          .from("customers")
          .update({
            loyalty_points: 0,
            free_valets: 0
          })
          .not('id', 'is', null);
          
        return { 
          success: true, 
          message: "Puntos de fidelidad y valets gratuitos reiniciados" 
        };
        
      default:
        throw new Error("Contador no válido");
    }
  } catch (error) {
    console.error(`Error resetting counter "${counter}":`, error);
    throw error;
  }
}
