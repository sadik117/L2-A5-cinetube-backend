import { Router } from "express";
import auth from "../../middleware/auth";
import { toggleLikeComment, toggleLikeReview } from "./like.controller";


const likeRouter = Router();

// toggle like <-> unlike
likeRouter.post("/review/:reviewId", auth(), toggleLikeReview);
likeRouter.post("/comment/:commentId", auth(), toggleLikeComment);

export default likeRouter;