
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
    const body = await req.json();
    console.log('MercadoPago webhook received:', body);

    // MercadoPago sends different types of notifications
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Get payment details from MercadoPago using the correct token
      const accessToken = "TEST-2GKWtsmurQ-121829-ac8c4f0e-8b7c-4d5e-9f1a-2b3c4d5e6f7g-571629761";
      
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!paymentResponse.ok) {
        throw new Error(`Failed to fetch payment: ${paymentResponse.status}`);
      }

      const payment = await paymentResponse.json();
      console.log('Payment details:', payment);

      // Update ticket status in Supabase based on payment status
      const supabase = createClient(
        'https://ebbarmqwvxkxqbzmkiby.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViYmFybXF3dnhreHFiem1raWJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg3MDExMywiZXhwIjoyMDU5NDQ2MTEzfQ.YLFzKGCkMBfqJxvmH7fEj2TCQMi3jDu7fKmD0qgWF88'
      );

      if (payment.external_reference) {
        const updateData: any = {
          updated_at: new Date().toISOString()
        };

        if (payment.status === 'approved') {
          updateData.is_paid = true;
          updateData.payment_method = 'mercadopago';
        } else if (payment.status === 'rejected') {
          updateData.is_paid = false;
        }

        const { error } = await supabase
          .from('tickets')
          .update(updateData)
          .eq('id', payment.external_reference);

        if (error) {
          console.error('Error updating ticket:', error);
        } else {
          console.log('Ticket updated successfully');
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
