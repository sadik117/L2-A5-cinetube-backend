/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as PaymentService from "./payment.service";
import { stripe } from "../../lib/stripe";

export const createCheckout = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const session = await PaymentService.createCheckoutSession(userId);

  res.json(session);
};


// This endpoint will be called by Stripe when a payment event occurs (e.g., successful payment, subscription update, etc.). It verifies the webhook signature and then processes the event accordingly.
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await PaymentService.handleWebhook(event);

  res.json({ received: true });
};