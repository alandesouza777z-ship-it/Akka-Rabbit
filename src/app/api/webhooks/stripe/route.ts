import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ============================================
// Stripe Webhook Handler (Prepared)
// ============================================

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // TODO: Verify Stripe signature when Stripe is configured
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

    // For now, parse the body as JSON
    const event = JSON.parse(body);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerEmail = session.customer_email;
        const planTier = session.metadata?.plan_tier || "pro";

        // Update user plan
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

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerEmail = subscription.metadata?.email;
        if (customerEmail) {
          await supabase
            .from("users")
            .update({ plan_tier: "starter", domains_limit: 1, requests_limit: 5000 })
            .eq("email", customerEmail);
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
