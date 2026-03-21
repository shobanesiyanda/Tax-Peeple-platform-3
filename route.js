import Stripe from "stripe";
import { hasStripeEnv } from "@/lib/env";

const priceMap = {
  starter: { amount: 2990, name: "Starter Compliance Pack" },
  "tax-ready": { amount: 4990, name: "Tax Ready Pack" },
  "tender-ready": { amount: 6990, name: "Tender Ready Pack" },
};

export async function POST(req) {
  try {
    const body = await req.json();
    const plan = priceMap[body.plan] || { amount: body.amount || 0, name: body.name || "Tax Peeple Service" };

    if (!hasStripeEnv()) {
      return Response.json({
        url: "/pricing?demoCheckout=1",
        warning: "Stripe environment variables missing. Demo mode active."
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
      line_items: [{
        price_data: {
          currency: "zar",
          product_data: { name: plan.name },
          unit_amount: plan.amount * 100,
        },
        quantity: 1,
      }],
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message || "Checkout error" }, { status: 500 });
  }
}
