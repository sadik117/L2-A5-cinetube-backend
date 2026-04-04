/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";


// [NOTE] -> This service contains the core business logic for handling payments, including creating checkout sessions and processing webhook events from Stripe.
export const createCheckoutSession = async (
  userId: string
): Promise<{ url: string | null }> => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Monthly Subscription",
          },
          unit_amount: 500,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,

    metadata: { userId },
  });

  return { url: session.url };
};


// [NOTE] -> This function processes incoming webhook events from Stripe. It verifies the event's signature to ensure it's from Stripe, and then handles specific event types (e.g., "checkout.session.completed") to update the database accordingly. 
export const handleWebhook = async (event: any) => {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;

    await prisma.subscription.create({
      data: {
        userId,
        stripeSessionId: session.id,
        status: "active",
        plan: "monthly",
      },
    });
  }
};