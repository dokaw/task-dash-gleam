
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Update payment status
      await supabaseClient
        .from("payments")
        .update({ status: "paid", updated_at: new Date().toISOString() })
        .eq("stripe_session_id", sessionId);

      // Create notification for tasker
      const { data: payment } = await supabaseClient
        .from("payments")
        .select("*, tasks(title)")
        .eq("stripe_session_id", sessionId)
        .single();

      if (payment) {
        await supabaseClient.from("notifications").insert({
          user_id: payment.tasker_id,
          task_id: payment.task_id,
          type: "payment_received",
          title: "Payment Received!",
          message: `You have received payment for the task "${payment.tasks.title}".`,
        });
      }
    }

    return new Response(JSON.stringify({ status: session.payment_status }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
