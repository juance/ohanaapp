
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

    // Delete customer feedback
    await supabaseClient
      .from('customer_feedback')
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
    
    // Delete dashboard stats
    await supabaseClient
      .from('dashboard_stats')
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
    // Handle both array and object formats
    const normalizedCounters = {};

    // If counters is an array, convert it to an object
    if (Array.isArray(counters)) {
      counters.forEach(counter => {
        normalizedCounters[counter] = true;
      });
    } else {
      // If counters is already an object, use it directly
      Object.assign(normalizedCounters, counters);
    }

    // Reset tickets counter
    if (normalizedCounters.tickets) {
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
    if (normalizedCounters.paidTickets) {
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
    if (normalizedCounters.revenue) {
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

          // Delete dashboard stats
          await supabaseClient
            .from('dashboard_stats')
            .delete()
            .not('id', 'is', null);

          results.revenue = true;
          console.log('Revenue data reset successfully');
        }
      } catch (error) {
        console.error('Error resetting revenue data:', error);
      }
    }

    // Reset expenses data
    if (normalizedCounters.expenses) {
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
    if (normalizedCounters.freeValets) {
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
          message: "Tickets y numeración reiniciados a 0"
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

      case "pending":
        // Delete only pending tickets
        await supabaseClient
          .from('tickets')
          .delete()
          .eq('status', 'processing');

        await supabaseClient
          .from('tickets')
          .delete()
          .eq('status', 'pending');

        return {
          success: true,
          message: "Pedidos pendientes eliminados"
        };

      case "delivered":
        // Delete delivered tickets
        await supabaseClient
          .from('tickets')
          .delete()
          .eq('status', 'delivered');

        return {
          success: true,
          message: "Historial de pedidos entregados eliminado"
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
          message: "Programa de fidelidad reiniciado"
        };

      case "analysis":
        // Delete customer feedback data
        await supabaseClient
          .from('customer_feedback')
          .delete()
          .not('id', 'is', null);

        return {
          success: true,
          message: "Datos de análisis de tickets eliminados"
        };

      case "revenue":
      case "metrics":
        // Delete dashboard stats
        await supabaseClient
          .from('dashboard_stats')
          .delete()
          .not('id', 'is', null);

        // Reset revenue in tickets if they exist
        await supabaseClient
          .from('tickets')
          .update({
            total: 0
          })
          .not('id', 'is', null);

        return {
          success: true,
          message: "Métricas y estadísticas reiniciadas"
        };

      default:
        throw new Error("Tipo de contador no válido: " + counter);
    }
  } catch (error) {
    console.error(`Error resetting counter "${counter}":`, error);
    throw error;
  }
}
