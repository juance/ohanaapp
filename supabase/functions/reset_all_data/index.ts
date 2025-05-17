
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

    // Delete ticket data
    await supabaseClient
      .from('dry_cleaning_items')
      .delete()
      .not('id', 'is', null);
      
    await supabaseClient
      .from('ticket_laundry_options')
      .delete()
      .not('id', 'is', null);
      
    await supabaseClient
      .from('tickets')
      .delete()
      .not('id', 'is', null);
      
    // Reset ticket sequence
    await supabaseClient.rpc("reset_ticket_sequence");
      
    // Delete feedback and reset loyalty data
    await supabaseClient
      .from('customer_feedback')
      .delete()
      .not('id', 'is', null);
      
    await supabaseClient
      .from('customers')
      .update({
        loyalty_points: 0,
        valets_count: 0,
        free_valets: 0,
        valets_redeemed: 0
      })
      .not('id', 'is', null);
      
    // Delete analytics data
    await supabaseClient
      .from('dashboard_stats')
      .delete()
      .not('id', 'is', null);
      
    await supabaseClient
      .from('analytics_data')
      .delete()
      .not('id', 'is', null);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Todos los datos han sido reiniciados exitosamente" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in reset_all_data:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al reiniciar los datos" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
