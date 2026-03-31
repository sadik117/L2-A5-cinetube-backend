import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import * as WatchlistService from "./watchlist.service";
import { AppError } from "../../utils/AppError";


export const addToWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;      
  const { mediaId } = req.body;

  if (!mediaId) {
    throw new AppError("Media ID is required", 400); 
  }

  const result = await WatchlistService.addToWatchlist(userId!, mediaId);

  res.status(201).json({
    status: "success",
    message: "Added to watchlist successfully",
    data: result
  });
});


export const removeFromWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { mediaId } = req.params;

  const result = await WatchlistService.removeFromWatchlist(userId!, mediaId as string);

  res.status(200).json({
    status: "success",
    message: "Removed from watchlist successfully",
    data: result
  });
});


export const getMyWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const watchlist = await WatchlistService.getUserWatchlist(userId!);

  res.status(200).json({
    status: "success",
    results: watchlist.length,
    data: watchlist
  });
});