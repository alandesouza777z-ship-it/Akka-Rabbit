import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ============================================
// Stripe Checkout Session Creator
// Generates a checkout link with PIX + Card
// ============================================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, planTier, customerEmail } = body;

    if (!priceId || !planTier) {
      return NextResponse.json(
        { error: "priceId and planTier are required" },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session with PIX enabled
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "pix"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        plan_tier: planTier,
      },
      customer_email: customerEmail || undefined,
      success_url: `${APP_URL}/dashboard?payment=success&plan=${planTier}`,
      cancel_url: `${APP_URL}/#pricing`,
      // PIX-specific: allow async payment confirmation
      payment_method_options: {
        pix: {
          expires_after_seconds: 900, // QR Code expires in 15 minutes
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[Checkout Error]:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout" },
      { status: 500 }
    );
  }
}
