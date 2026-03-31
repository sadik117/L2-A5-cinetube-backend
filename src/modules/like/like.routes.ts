import { Router } from "express";
import { toggleLike } from "./like.controller";
import auth from "../../middleware/auth";


const likeRouter = Router();

// toggle like <-> unlike
likeRouter.post("/:reviewId", auth(), toggleLike);

export default likeRouter;