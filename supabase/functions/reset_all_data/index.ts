
// Supabase Edge Function: reset_all_data
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get variables from environment
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Initialize Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting data reset process...");

    // Delete all tickets and related data
    await supabase.from("dry_cleaning_items").delete().gt("id", "0");
    await supabase.from("ticket_laundry_options").delete().gt("id", "0");
    
    console.log("Cleared ticket items and options");
    
    // Delete all tickets
    await supabase.from("tickets").delete().gt("id", "0");
    console.log("Cleared tickets");

    // Reset customer loyalty points and valets
    const { error: customerError } = await supabase
      .from("customers")
      .update({
        loyalty_points: 0,
        valets_count: 0,
        free_valets: 0,
        valets_redeemed: 0
      })
      .gt("id", "0");

    if (customerError) {
      throw customerError;
    }
    console.log("Reset customer loyalty data");

    // Delete all expenses
    await supabase.from("expenses").delete().gt("id", "0");
    console.log("Cleared expenses");

    // Reset the ticket sequence
    await supabase.rpc("reset_ticket_sequence");
    console.log("Reset ticket sequence");
    
    // Add log entry
    await supabase
      .from("ticket_sequence_resets")
      .insert({
        reset_by: "admin",
        notes: "Full system reset via admin function",
      });

    return new Response(
      JSON.stringify({ success: true, message: "All data has been reset" }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error in reset_all_data function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
