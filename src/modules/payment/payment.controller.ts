/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as PaymentService from "./payment.service";
import { catchAsync } from "../../utils/catchAsync";


export const createCheckout = catchAsync(async (req: Request, res: Response) => {

    const userId = (req as any).user?.id;
    const { plan } = req.body;

    if (!userId) {
      console.error("No userId found in authenticated request");
      return res.status(401).json({ 
        error: "Unauthorized - No user ID found" 
      });
    }

    const { url } = await PaymentService.createCheckoutSession(userId, plan);

    res.status(200).json({ 
      success: true, 
      url 
    });

});


export const stripeWebhook = async (req: Request, res: Response) => {
  await PaymentService.handleWebhook(req, res);
};


export const getMySubscription = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await PaymentService.getMySubscription(userId);

    res.json(result);

});