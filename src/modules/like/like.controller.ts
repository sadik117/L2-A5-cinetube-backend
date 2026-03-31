/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as LikeService from "./like.service";
import { catchAsync } from "../../utils/catchAsync";

export const toggleLike = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: You must be logged in to like a review." });
    }

    const { reviewId } = req.params;

    const result = await LikeService.toggleLike(userId, reviewId as string);

    res.json({
      message: result.liked ? "Liked" : "Unliked",
      data: result,
    });
  
});