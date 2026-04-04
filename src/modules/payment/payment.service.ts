/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/AppError";


// [NOTE] -> This service contains the core business logic for handling payments, including creating checkout sessions and processing webhook events from Stripe.
export const createCheckoutSession = async (userId: string): Promise<{ url: string | null }> => {

  if (!userId) {
    throw new AppError("userId is required to create checkout session", 400);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Monthly Subscription",
              description: "Access to premium features of CineTube",
            },
            unit_amount: 500,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { 
        userId: userId 
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe checkout session creation failed:", error.message);
    throw error;
  }
};



// [NOTE] -> This function processes incoming webhook events from Stripe. It verifies the event's signature to ensure it's from Stripe, then handles specific event types (like successful checkout sessions) to update the user's subscription status in the database.
export const handleWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"] as string;
  const rawBody = req.body; // Must be raw body (Buffer)

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout for subscription
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const userId = session.metadata?.userId;

    if (!userId) {
      return res.status(400).send("Missing userId");
    }

    try {
      const now = new Date();
      const subscriptionEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      await prisma.subscription.create({
        data: {
          userId,
          stripeSessionId: session.id,
          stripeCustomerId: (session.customer as string) || null,
          status: "active",
          plan: "monthly",
          currentPeriodStart: now,
          currentPeriodEnd: subscriptionEnd,
        },
      });
      
      // console.log(`Subscription created for user ${userId}`);
;
    } catch (dbError: any) {
      console.error("Failed to create subscription in database:", dbError.message);
    }
  }

  res.status(200).send("OK");
};