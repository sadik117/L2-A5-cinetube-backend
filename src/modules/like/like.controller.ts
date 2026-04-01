/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as LikeService from "./like.service";
import { catchAsync } from "../../utils/catchAsync";

// Review Likes
export const toggleLikeReview = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: You must be logged in to like a review." });
    }

    const { reviewId } = req.params;

    const result = await LikeService.toggleLikeReview(userId, reviewId as string);

    res.json({
      message: result.liked ? "Liked" : "Unliked",
      data: result,
    });
  
});


// Comment Likes
export const toggleLikeComment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const commentId = req.params.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const result = await LikeService.toggleLikeComment(commentId as string, userId);
  res.json(result);
};