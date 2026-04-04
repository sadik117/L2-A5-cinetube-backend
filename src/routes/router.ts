import { Router } from "express";
import movieRouter from "../modules/movie/movie.routes";
import reviewRouter from "../modules/review/review.routes";
import authRouter from "../modules/auth/auth.routes";
import likeRouter from "../modules/like/like.routes";
import watchlistRouter from "../modules/watchlist/watchlist.routes";
import commentRouter from "../modules/comment/comment.routes";
import paymentRouter from "../modules/payment/payment.routes";
import adminRouter from "../modules/admin/admin.routes";


const routes = Router();

routes.use("/movie", movieRouter);
routes.use("/review", reviewRouter);
routes.use("/auth", authRouter);
routes.use("/like", likeRouter);
routes.use("/watchlist", watchlistRouter);
routes.use("/comment", commentRouter);
routes.use("/payment", paymentRouter);
routes.use("/admin", adminRouter);  

export default routes;