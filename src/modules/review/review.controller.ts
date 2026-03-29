/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as ReviewService from "./review.service";

export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { mediaId, rating, content, tags, isSpoiler } = req.body;

    // validate required fields
    if (!mediaId || !rating || !content) {
      return res.status(400).json({ message: "Missing required fields: mediaId, rating, content" });
    }

    // validate rating is 1-10
    if (typeof rating !== "number" || rating < 1 || rating > 10) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 10" });
    }

    // validate tags is array if provided
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }

    const result = await ReviewService.createReview(userId, {
      mediaId,
      rating,
      content,
      tags: tags || [],
      isSpoiler: isSpoiler || false,
    });

    res.status(201).json({
      message: "Review submitted, waiting for approval",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get user's own reviews including unpublished
export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await ReviewService.getUserReviews(userId);
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// public approved reviews for a movie/series
export const getReviewsByMedia = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getReviewsByMedia(
      req.params.mediaId as string
    );
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// admin get all reviews
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getAllReviews();
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// approve review by admin
export const approveReview = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.approveReview(req.params.id as string);
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// edit review only for unpublished reviews
export const updateReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rating, content, tags, isSpoiler } = req.body;

    // Validate rating if provided
    if (rating !== undefined) {
      if (typeof rating !== "number" || rating < 1 || rating > 10) {
        return res.status(400).json({ message: "Rating must be a number between 1 and 10" });
      }
    }

    // Validate tags is array if provided
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }

    const result = await ReviewService.updateReview(req.params.id as string, userId, {
      rating,
      content,
      tags,
      isSpoiler,
    });

    res.json({
      message: "Review updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Unauthorized")) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes("Cannot edit")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.deleteReview(req.params.id as string);
    res.json({ message: "Review deleted successfully", data: result });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};