import { Router } from "express";
import movieRouter from "../modules/movie/movie.routes";
import reviewRouter from "../modules/review/review.routes";
import authRouter from "../modules/auth/auth.routes";
import likeRouter from "../modules/like/like.routes";


const routes = Router();

routes.use("/movie", movieRouter);
routes.use("/review", reviewRouter);
routes.use("/auth", authRouter);
routes.use("/like", likeRouter);

export default routes;