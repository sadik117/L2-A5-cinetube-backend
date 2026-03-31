/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as LikeService from "./like.service";

export const toggleLike = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};