import { Router } from "express";
import * as CommentController from "./comment.controller";
import auth from "../../middleware/auth";


const commentRouter = Router();

// user
commentRouter.post("/", auth(), CommentController.createComment);
commentRouter.get("/review/:reviewId", CommentController.getComments);
commentRouter.patch("/:id", auth(), CommentController.updateComment);
commentRouter.delete("/:id", auth(), CommentController.deleteComment);

// admin
commentRouter.get("/", auth("ADMIN"), CommentController.getAllComments);
commentRouter.patch("/approve/:id", auth("ADMIN"), CommentController.approveComment);


export default commentRouter;