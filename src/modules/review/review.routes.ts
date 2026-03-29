import express from "express";
import * as ReviewController from "./review.controller";
import auth from "../../middleware/auth";

const reviewRouter = express.Router();

// user
reviewRouter.post("/", ReviewController.createReview);
reviewRouter.get("/media/:mediaId", ReviewController.getReviewsByMedia);

// admin
reviewRouter.patch("/approve/:id", auth("review", "approve"), ReviewController.approveReview);
reviewRouter.delete("/:id", auth("review", "delete"), ReviewController.deleteReview);

export default reviewRouter;