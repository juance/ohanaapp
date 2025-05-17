
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

    console.log("Starting complete data reset...");
    
    // Lista de todas las tablas que necesitamos limpiar
    const tablesToClean = [
      // Primero eliminar tablas con dependencias (foreign keys)
      'ticket_laundry_options',
      'dry_cleaning_items',
      'customer_feedback',
      
      // Luego tablas principales
      'tickets',
      'expenses',
      
      // Otras tablas que podrían contener datos
      'error_logs',
      'inventory_items',
      'dashboard_stats'
    ];
    
    // Eliminar datos de todas las tablas
    for (const table of tablesToClean) {
      try {
        console.log(`Deleting all data from ${table}...`);
        const { error } = await supabaseClient
          .from(table)
          .delete()
          .not('id', 'is', null);
          
        if (error) {
          console.error(`Error deleting data from ${table}:`, error);
          // Continuar con las siguientes tablas incluso si hay un error
        } else {
          console.log(`Successfully deleted all data from ${table}`);
        }
      } catch (error) {
        console.error(`Error processing table ${table}:`, error);
        // Continuar con las siguientes tablas incluso si hay un error
      }
    }
    
    // Reiniciar contadores de clientes
    try {
      console.log("Resetting customer counters...");
      const { error } = await supabaseClient
        .from("customers")
        .update({
          loyalty_points: 0,
          free_valets: 0,
          valets_count: 0,
          valets_redeemed: 0
        })
        .not('id', 'is', null);
        
      if (error) {
        console.error("Error resetting customer counters:", error);
      } else {
        console.log("Successfully reset customer counters");
      }
    } catch (error) {
      console.error("Error resetting customer counters:", error);
    }
    
    // Reiniciar secuencia de tickets
    try {
      console.log("Resetting ticket sequence...");
      const { error } = await supabaseClient.rpc("reset_ticket_sequence");
      
      if (error) {
        console.error("Error resetting ticket sequence:", error);
      } else {
        console.log("Successfully reset ticket sequence");
      }
    } catch (error) {
      console.error("Error resetting ticket sequence:", error);
    }
    
    console.log("Complete data reset finished");

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
    console.error("Error in reset_all_data_complete:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al reiniciar todos los datos" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
