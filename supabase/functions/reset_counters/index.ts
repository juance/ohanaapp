
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

    const { data: body } = await req.json();
    const { counter, options } = body || { counter: null, options: {} };

    let result;

    switch (counter) {
      case "tickets":
        // Reiniciar el contador de tickets
        const { data: ticketsResult, error: ticketsError } = await supabaseClient.rpc(
          "reset_ticket_sequence"
        );
        
        if (ticketsError) throw ticketsError;
        result = { success: true, message: "Numeración de tickets reiniciada a 0" };
        break;
        
      case "clients":
        // Reiniciar el contador de clientes (valets, puntos, etc.)
        const { error: clientsError } = await supabaseClient
          .from("customers")
          .update({
            loyalty_points: 0,
            free_valets: 0,
            valets_count: 0,
            valets_redeemed: 0
          })
          .eq("id", options?.clientId || "all")
          .is("id", options?.clientId ? null : "not.null");
          
        if (clientsError) throw clientsError;
        result = { success: true, message: "Contadores de clientes reiniciados" };
        break;
        
      case "revenue":
        // Reiniciar los datos de ingresos
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { error: revenueError } = await supabaseClient
          .from("tickets")
          .update({
            total: 0,
            is_paid: false
          })
          .gte("created_at", thirtyDaysAgo.toISOString())
          .is("is_canceled", false);
          
        if (revenueError) throw revenueError;
        result = { success: true, message: "Datos de ingresos reiniciados" };
        break;

      case "all":
        // Reiniciar todos los contadores
        const resetTickets = await supabaseClient.rpc("reset_ticket_sequence");
        
        const resetClients = await supabaseClient
          .from("customers")
          .update({
            loyalty_points: 0,
            free_valets: 0,
            valets_count: 0,
            valets_redeemed: 0
          });
          
        const resetRevenue = await supabaseClient
          .from("tickets")
          .update({
            total: 0,
            is_paid: false
          })
          .is("is_canceled", false);
          
        if (resetTickets.error || resetClients.error || resetRevenue.error) {
          throw new Error("Error al reiniciar todos los contadores");
        }
        
        result = { success: true, message: "Todos los contadores han sido reiniciados" };
        break;
        
      default:
        throw new Error("Contador no válido");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error en reset_counters:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al reiniciar contadores" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
