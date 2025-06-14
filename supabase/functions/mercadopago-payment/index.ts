
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
    } catch {
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
      return new Response(JSON.stringify({
        success: false,
        error: "El monto debe ser un número válido"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Ingresa un monto mayor a cero"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (!ticketId || typeof ticketId !== 'string' || ticketId.length < 3) {
      return new Response(JSON.stringify({
        success: false,
        error: "El Ticket ID es obligatorio"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Datos de test de MercadoPago
    const accessToken = "TEST-2GKWtsmurQ-121829-ac8c4f0e-8b7c-4d5e-9f1a-2b3c4d5e6f7g-571629761";

    const paymentData = {
      transaction_amount: Number(amount),
      description: description || "Pago Lavandería Ohana",
      payment_method_id: "account_money",
      installments: 1,
      payer: {
        id: "TESTUSER571629761",
        email: "test_user_571629761@testuser.com"
      },
      external_reference: ticketId,
      notification_url: `https://ebbarmqwvxkxqbzmkiby.supabase.co/functions/v1/mercadopago-webhook`,
      auto_return: "approved"
    };

    console.log('Creando pago MercadoPago:', paymentData);

    // Llamada API MercadoPago
    let mpResp;
    try {
      mpResp = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": `${ticketId}-${Date.now()}`
        },
        body: JSON.stringify(paymentData)
      });
    } catch (fetchError) {
      console.error("Error de red/fetch con MercadoPago:", fetchError);
      return new Response(JSON.stringify({
        success: false,
        error: "No se pudo contactar a MercadoPago",
        details: fetchError?.toString?.() || fetchError
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 502,
      });
    }

    const respStatus = mpResp.status;
    let mpJson;
    try {
      mpJson = await mpResp.json();
    } catch (parseError) {
      console.error("No se pudo parsear respuesta de MercadoPago:", parseError);
      return new Response(JSON.stringify({
        success: false,
        error: "Respuesta inválida de MercadoPago",
        details: parseError?.toString?.() || parseError
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 502,
      });
    }
    console.log("Respuesta de MercadoPago, status:", respStatus);
    console.log(mpJson);

    // Caso error 400 o similares de MP
    if (!mpResp.ok) {
      const errorMsg = mpJson.message || mpJson.error || mpJson.cause?.[0]?.description || "Error desconocido MercadoPago";
      console.error("Error API MercadoPago:", errorMsg, mpJson);
      return new Response(JSON.stringify({
        success: false,
        error: `[MercadoPago] ${errorMsg}`,
        details: mpJson
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: respStatus,
      });
    }

    // Devolvemos solo los campos útiles para el frontend
    return new Response(JSON.stringify({
      success: true,
      payment_id: mpJson.id,
      status: mpJson.status,
      status_detail: mpJson.status_detail,
      point_of_interaction: mpJson.point_of_interaction,
      payment_method: mpJson.payment_method_id,
      amount: mpJson.transaction_amount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error inesperado en función MercadoPago:', error);
    return new Response(JSON.stringify({ 
      error: error?.message || error?.toString() || 'Unexpected error occurred',
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
