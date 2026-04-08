import { Router } from "express";
import * as AdminController from "./admin.controller";
import auth from "../../middleware/auth";



const adminRouter = Router();

adminRouter.get("/dashboard", auth("ADMIN"), AdminController.getDashboard);

adminRouter.get("/users/activity", auth("ADMIN"), AdminController.getUsers);

adminRouter.get("/subscriptions", auth("ADMIN"), AdminController.getSubscriptions);

adminRouter.get("/subscriptions/analytics", auth("ADMIN"), AdminController.getSubscriptionsAnalytics);


export default adminRouter;