
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('MercadoPago payment function called');
    let payload;
    try {
      payload = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({
        success: false,
        error: "Request body must be JSON"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const { amount, description, ticketId } = payload || {};
    console.log('Payment request data:', { amount, description, ticketId });

    // INPUT VALIDATION
    if (typeof amount !== "number" || isNaN(amount)) {
      console.error('Invalid amount:', amount);
      return new Response(JSON.stringify({
        success: false,
        error: "El monto debe ser un número válido"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (!amount || amount <= 0) {
      console.error('Amount must be greater than zero:', amount);
      return new Response(JSON.stringify({
        success: false,
        error: "Ingresa un monto mayor a cero"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (!ticketId || typeof ticketId !== 'string' || ticketId.length < 3) {
      console.error('Invalid ticketId:', ticketId);
      return new Response(JSON.stringify({
        success: false,
        error: "El Ticket ID es obligatorio"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Updated MercadoPago credentials
    const accessToken = "TEST-1276318702369620-061405-675482fd2025b24a27ca8a2d93d0cdf0-136940674";

    // Simplified payment data for testing
    const paymentData = {
      transaction_amount: Number(amount),
      description: description || "Pago Lavandería Ohana",
      payment_method_id: "account_money",
      payer: {
        email: "test_user_136940674@testuser.com"
      },
      external_reference: ticketId,
      notification_url: `https://ebbarmqwvxkxqbzmkiby.supabase.co/functions/v1/mercadopago-webhook`
    };

    console.log('Creating MercadoPago payment with data:', JSON.stringify(paymentData, null, 2));

    // MercadoPago API call
    let mpResp;
    try {
      console.log('Making request to MercadoPago API...');
      mpResp = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": `${ticketId}-${Date.now()}`
        },
        body: JSON.stringify(paymentData)
      });
      
      console.log('MercadoPago API response status:', mpResp.status);
      
    } catch (fetchError) {
      console.error("Network error with MercadoPago:", fetchError);
      return new Response(JSON.stringify({
        success: false,
        error: "No se pudo contactar a MercadoPago",
        details: String(fetchError)
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    let mpJson;
    try {
      mpJson = await mpResp.json();
      console.log('MercadoPago response body:', JSON.stringify(mpJson, null, 2));
    } catch (parseError) {
      console.error("Could not parse MercadoPago response:", parseError);
      return new Response(JSON.stringify({
        success: false,
        error: "Respuesta inválida de MercadoPago",
        details: String(parseError)
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Handle MercadoPago API errors
    if (!mpResp.ok) {
      const errorMsg = mpJson.message || mpJson.error || mpJson.cause?.[0]?.description || "Error desconocido MercadoPago";
      console.error("MercadoPago API error:", errorMsg, mpJson);
      
      // Return a successful HTTP response but with error details
      return new Response(JSON.stringify({
        success: false,
        error: `MercadoPago Error: ${errorMsg}`,
        status_code: mpResp.status,
        details: mpJson
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Always return 200 to avoid edge function errors
      });
    }

    // Success response
    console.log('Payment created successfully:', mpJson.id);
    return new Response(JSON.stringify({
      success: true,
      payment_id: mpJson.id,
      status: mpJson.status,
      status_detail: mpJson.status_detail,
      point_of_interaction: mpJson.point_of_interaction,
      payment_method: mpJson.payment_method_id,
      amount: mpJson.transaction_amount,
      mp_response: mpJson
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Unexpected error in MercadoPago function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Error interno del servidor',
      details: String(error)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Return 200 to avoid edge function errors
    });
  }
});
