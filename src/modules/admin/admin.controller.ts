import { Request, Response } from "express";
import * as AdminService from "./admin.service";
import { catchAsync } from "../../utils/catchAsync";

export const getDashboard = async (_req: Request, res: Response) => {
  const data = await AdminService.getDashboardStats();
  res.json(data);
};


export const getUsers = async (_req: Request, res: Response) => {
  const data = await AdminService.getUserActivity();
  res.json(data);
};

export const getSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSubscriptions();

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getSubscriptionsAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSubscriptionsAnalytics();

  res.status(200).json({
    success: true,
    data: result,
  });
});