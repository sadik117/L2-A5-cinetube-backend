/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as CommentService from "./comment.service";
import { catchAsync } from "../../utils/catchAsync";


// create comment and reply
export const createComment = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { reviewId, content, parentId } = req.body;

    if (!reviewId || !content) {
      return res.status(400).json({ message: "reviewId, content required" });
    }

    const result = await CommentService.createComment(
      userId,
      reviewId,
      content,
      parentId
    );

    res.status(201).json({
      message: "Comment submitted for approval",
      data: result,
    });
  
});


// get comments for a review
export const getComments = catchAsync(async (req: Request, res: Response) => {

  const reviewId = req.params.reviewId;

  const result = await CommentService.getCommentsByReview(reviewId as string);
  res.json(result);

});


// get all comments by admin
export const getAllComments = catchAsync(async (_req: Request, res: Response) => {

  const result = await CommentService.getAllComments();
  res.json(result);

});


// approve comment by admin
export const approveComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentService.approveComment(req.params.id as string);
  res.json({ message: "Approved", data: result });
});


// Update comment 
export const updateComment = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.id;
    const { content } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await CommentService.updateComment(
      req.params.id as string,
      userId,
      content
    );

    res.json({ message: "Updated", data: result });

});


// delete comment 
export const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

    const result = await CommentService.deleteComment(
      req.params.id as string,
      userId
    );

    res.json({ message: "Deleted", data: result });

});