import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// ============================================
// Stripe Webhook Handler (Production-Ready)
// Supports: PIX, Card, Boleto
// ============================================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify Stripe signature (prevents spoofing)
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (event.type) {
      // Payment completed (works for PIX, Card, Boleto)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const planTier = session.metadata?.plan_tier || "pro";

        console.log(`[Webhook] Checkout completed: ${customerEmail} → ${planTier}`);

        if (customerEmail) {
          const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("email", customerEmail)
            .single();

          if (user) {
            const limits: Record<string, { domains_limit: number; requests_limit: number }> = {
              starter: { domains_limit: 1, requests_limit: 5000 },
              pro: { domains_limit: 5, requests_limit: 50000 },
              enterprise: { domains_limit: 999, requests_limit: 999999 },
            };

            await supabase
              .from("users")
              .update({
                plan_tier: planTier,
                ...limits[planTier],
              })
              .eq("id", user.id);

            console.log(`[Webhook] User ${user.id} upgraded to ${planTier}`);
          } else {
            console.warn(`[Webhook] User not found for email: ${customerEmail}`);
          }
        }
        break;
      }

      // PIX payment confirmed asynchronously
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const planTier = session.metadata?.plan_tier || "pro";

        console.log(`[Webhook] Async payment (PIX) succeeded: ${customerEmail} → ${planTier}`);

        if (customerEmail) {
          const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("email", customerEmail)
            .single();

          if (user) {
            const limits: Record<string, { domains_limit: number; requests_limit: number }> = {
              starter: { domains_limit: 1, requests_limit: 5000 },
              pro: { domains_limit: 5, requests_limit: 50000 },
              enterprise: { domains_limit: 999, requests_limit: 999999 },
            };

            await supabase
              .from("users")
              .update({
                plan_tier: planTier,
                ...limits[planTier],
              })
              .eq("id", user.id);
          }
        }
        break;
      }

      // PIX payment failed (expired QR code, insufficient funds)
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.warn(`[Webhook] Async payment (PIX) failed for: ${session.customer_details?.email}`);
        break;
      }

      // Subscription cancelled
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get customer email from Stripe
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = (customer as Stripe.Customer).email;

        if (customerEmail) {
          await supabase
            .from("users")
            .update({ plan_tier: "starter", domains_limit: 1, requests_limit: 5000 })
            .eq("email", customerEmail);

          console.log(`[Webhook] Subscription cancelled for: ${customerEmail}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook Error]:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
