import { Router } from "express";
import * as MovieController from "./movie.controller";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/cloudinaryUpload";


const movieRouter = Router();

// user routes
movieRouter.get("/", MovieController.getMovies);
movieRouter.get("/:id", MovieController.getMovie);
movieRouter.get("/streaming/:id", auth(), MovieController.getStreamingLink);

// admin routes
movieRouter.post("/", auth("ADMIN"), upload.single("coverImage"), MovieController.createMovie);
movieRouter.patch("/:id", auth("ADMIN"), MovieController.updateMovie);
movieRouter.delete("/:id", auth("ADMIN"), MovieController.deleteMovie);


export default movieRouter;