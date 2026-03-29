import { Router } from "express";
import movieRouter from "../modules/movie/movie.routes";


const routes = Router();

routes.use("/movie", movieRouter);

export default routes;