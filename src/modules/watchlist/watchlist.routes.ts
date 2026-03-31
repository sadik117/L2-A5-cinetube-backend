// src/routes/watchlist.routes.ts
import { Router } from "express";
import * as WatchlistController from "./watchlist.controller";
import auth from "../../middleware/auth";

const watchlistRouter = Router();


watchlistRouter.post("/add", auth(), WatchlistController.addToWatchlist);
watchlistRouter.delete("/:mediaId", auth(), WatchlistController.removeFromWatchlist);
watchlistRouter.get("/my-watchlist", auth(), WatchlistController.getMyWatchlist);


export default watchlistRouter;