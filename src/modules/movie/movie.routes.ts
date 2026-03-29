import { Router } from "express";
import * as MovieController from "./movie.controller";
import auth from "../../middleware/auth";


const movieRouter = Router();

// user routes
movieRouter.get("/", MovieController.getMovies);
movieRouter.get("/:id", MovieController.getMovie);

// admin routes
movieRouter.post("/", auth("media", "create"), MovieController.createMovie);
movieRouter.patch("/:id", auth("media", "update"), MovieController.updateMovie);
movieRouter.delete("/:id", auth("media", "delete"), MovieController.deleteMovie);

export default movieRouter;