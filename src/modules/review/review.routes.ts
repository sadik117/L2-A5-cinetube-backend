import express from "express";
import * as ReviewController from "./review.controller";
import auth from "../../middleware/auth";

const reviewRouter = express.Router();

// user routes
reviewRouter.post("/", ReviewController.createReview);
reviewRouter.get("/media/:mediaId", ReviewController.getReviewsByMedia);
reviewRouter.get("/user/my-reviews", ReviewController.getUserReviews);
reviewRouter.patch("/:id", ReviewController.updateReview);
reviewRouter.delete("/:id", ReviewController.deleteReview);

// admin routes
reviewRouter.get("/", auth("review", "read"), ReviewController.getAllReviews);
reviewRouter.patch("/approve/:id", auth("review", "approve"), ReviewController.approveReview);

export default reviewRouter;