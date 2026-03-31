import { Router } from "express";
import * as MovieController from "./movie.controller";
import auth from "../../middleware/auth";



const movieRouter = Router();

// user routes
movieRouter.get("/", MovieController.getMovies);
movieRouter.get("/:id", MovieController.getMovie);

// admin routes
movieRouter.post("/", auth("ADMIN"), MovieController.createMovie);
movieRouter.patch("/:id", auth("ADMIN"), MovieController.updateMovie);
movieRouter.delete("/:id", auth("ADMIN"), MovieController.deleteMovie);

export default movieRouter;