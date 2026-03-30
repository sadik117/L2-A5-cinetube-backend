import express from "express";
import * as ReviewController from "./review.controller";
import auth from "../../middleware/auth";

const reviewRouter = express.Router();

// user routes
reviewRouter.post("/", auth(), ReviewController.createReview);
reviewRouter.get("/media/:mediaId", auth(), ReviewController.getReviewsByMedia);
reviewRouter.get("/user/my-reviews", auth(), ReviewController.getUserReviews);
reviewRouter.patch("/:id", auth(), ReviewController.updateReview);
reviewRouter.delete("/:id", auth(), ReviewController.deleteReview);

// admin routes
reviewRouter.get("/", auth("ADMIN"), ReviewController.getAllReviews);
reviewRouter.patch("/approve/:id", auth("ADMIN"), ReviewController.approveReview);

export default reviewRouter;