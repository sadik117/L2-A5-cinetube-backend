import { Router } from "express";
import auth from "../../middleware/auth";
import * as PaymentController from "./payment.controller";

const paymentRouter = Router();

paymentRouter.post("/checkout", auth(), PaymentController.createCheckout);

paymentRouter.post("/webhook", PaymentController.stripeWebhook);

paymentRouter.get("/my-subscription", auth(), PaymentController.getMySubscription);

export default paymentRouter;