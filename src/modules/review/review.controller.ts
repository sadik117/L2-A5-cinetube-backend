/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as ReviewService from "./review.service";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  
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
  });


// get user's own reviews including unpublished
export const getUserReviews = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.id;

    if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await ReviewService.getUserReviews(userId);
    res.json(result);
  
});



// public approved reviews for a movie/series
export const getReviewsByMedia = catchAsync(async (req: Request, res: Response) => {

    const result = await ReviewService.getReviewsByMedia(
      req.params.mediaId as string
    );
  
    res.json(result);
 
});


// admin get all reviews
export const getAllReviews = catchAsync(async (req: Request, res: Response) => {

    const result = await ReviewService.getAllReviews();

    res.json(result);
  
});


// approve review by admin
export const approveReview = catchAsync(async (req: Request, res: Response) => {

    const result = await ReviewService.approveReview(req.params.id as string);

    res.status(201).json({ 
      message: "Review approved successfully", 
      data: result 
    });
  
});

// unpublish / reject review by admin 
export const unpublishReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Review ID is required", 400);
  }

  const result = await ReviewService.unpublishReview(id);

  res.status(200).json({
    status: "success",
    message: "Review has been unpublished successfully",
    data: result
  });
});


// edit review only for unpublished reviews
export const updateReview = catchAsync(async (req: Request, res: Response) => {

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
  });



export const deleteReview = catchAsync(async (req: Request, res: Response) => {

    const result = await ReviewService.deleteReview(req.params.id as string);

    res.json({ 
      message: "Review deleted successfully", 
      data: result 
    });
  
});