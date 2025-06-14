
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
    
    const { amount, description, ticketId } = await req.json();
    console.log('Payment request data:', { amount, description, ticketId });
    
    // Validate input
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount provided');
    }
    
    // Using the correct test access token
    const accessToken = "TEST-2GKWtsmurQ-121829-ac8c4f0e-8b7c-4d5e-9f1a-2b3c4d5e6f7g-571629761";
    
    console.log('Creating MercadoPago payment for:', { amount, description, ticketId });

    const paymentData = {
      transaction_amount: Number(amount),
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

    console.log('Payment data to send:', JSON.stringify(paymentData, null, 2));

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${Date.now()}-${Math.random()}`
      },
      body: JSON.stringify(paymentData)
    });

    console.log('MercadoPago API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('MercadoPago API Error Response:', errorText);
      
      // Try to parse the error for more details
      try {
        const errorData = JSON.parse(errorText);
        console.error('MercadoPago API Error Details:', errorData);
        
        return new Response(JSON.stringify({
          success: false,
          error: `MercadoPago API Error: ${errorData.message || errorData.error || 'Unknown error'}`,
          details: errorData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      } catch {
        return new Response(JSON.stringify({
          success: false,
          error: `MercadoPago API Error: ${response.status} - ${errorText}`,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
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
    console.error('Unexpected error in payment function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unexpected error occurred',
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
