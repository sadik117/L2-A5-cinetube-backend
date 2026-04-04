import { Router } from "express";
import auth from "../../middleware/auth";
import * as PaymentController from "./payment.controller";
import express from "express";

const paymentRouter = Router();

paymentRouter.post("/checkout", auth(), PaymentController.createCheckout);

paymentRouter.post("/webhook",
  express.raw({ type: "application/json" }), 
  PaymentController.stripeWebhook
);

export default paymentRouter;