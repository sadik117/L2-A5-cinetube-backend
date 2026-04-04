import { Request, Response } from "express";
import * as AdminService from "./admin.service";

export const getDashboard = async (_req: Request, res: Response) => {
  const data = await AdminService.getDashboardStats();
  res.json(data);
};

export const getAnalytics = async (_req: Request, res: Response) => {
  const data = await AdminService.getMediaAnalytics();
  res.json(data);
};

export const getPendingReviews = async (_req: Request, res: Response) => {
  const data = await AdminService.getPendingReviews();
  res.json(data);
};

export const getUsers = async (_req: Request, res: Response) => {
  const data = await AdminService.getUserActivity();
  res.json(data);
};

export const getSubscriptions = async (_req: Request, res: Response) => {
  const data = await AdminService.getSubscriptionAnalytics();
  res.json(data);
};