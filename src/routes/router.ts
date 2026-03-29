import { Router } from "express";
import movieRouter from "../modules/movie/movie.routes";
import reviewRouter from "../modules/review/review.routes";


const routes = Router();

routes.use("/movie", movieRouter);
routes.use("/review", reviewRouter);

export default routes;