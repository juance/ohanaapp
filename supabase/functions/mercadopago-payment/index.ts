
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
    const { amount, description, ticketId } = await req.json();
    
    // Using the correct test token you provided
    const accessToken = "TEST-2GKWtsmurQ-121829-ac8c4f0e-8b7c-4d5e-9f1a-2b3c4d5e6f7g-571629761";
    
    console.log('Creating MercadoPago payment for:', { amount, description, ticketId });

    const paymentData = {
      transaction_amount: amount,
      description: description || 'Pago Lavandería Ohana',
      payment_method_id: 'account_money',
      installments: 1,
      payer: {
        id: 'TESTUSER571629761',
        email: 'test_user_571629761@testuser.com'
      },
      external_reference: ticketId,
      notification_url: `https://ebbarmqwvxkxqbzmkiby.supabase.co/functions/v1/mercadopago-webhook`,
      auto_return: 'approved'
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${Date.now()}-${Math.random()}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('MercadoPago API Error:', errorData);
      throw new Error(`MercadoPago API Error: ${response.status}`);
    }

    const payment = await response.json();
    console.log('Payment created successfully:', payment);

    return new Response(JSON.stringify({
      success: true,
      payment_id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      point_of_interaction: payment.point_of_interaction
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
