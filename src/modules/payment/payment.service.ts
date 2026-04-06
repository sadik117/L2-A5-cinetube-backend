/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/AppError";

// [NOTE] -> This service contains the core business logic for handling payments, including creating checkout sessions and processing webhook events from Stripe.
export const createCheckoutSession = async (
  userId: string,
  plan: "monthly" | "yearly",
): Promise<{ url: string | null }> => {
  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  const isYearly = plan === "yearly";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: isYearly ? "Yearly Subscription" : "Monthly Subscription",
          },
          unit_amount: isYearly ? 4800 : 500, //  $48 / $5
          recurring: {
            interval: isYearly ? "year" : "month", //  fixed type
          },
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,

    metadata: {
      userId,
      plan,
    },
  });

  return { url: session.url };
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
      process.env.STRIPE_WEBHOOK_SECRET!,
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

    const plan = session.metadata?.plan || "monthly";

    const now = new Date();

    const subscriptionEnd =
      plan === "yearly"
        ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await prisma.subscription.create({
      data: {
        userId,
        stripeSessionId: session.id,
        stripeCustomerId: (session.customer as string) || null,
        status: "active",
        plan,
        currentPeriodStart: now,
        currentPeriodEnd: subscriptionEnd,
      },
    });
  }
};

export const getMySubscription = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "active",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return subscription;
};
