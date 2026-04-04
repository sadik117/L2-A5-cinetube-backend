import { Router } from "express";
import * as AdminController from "./admin.controller";
import auth from "../../middleware/auth";


const adminRouter = Router();

adminRouter.get("/dashboard", auth("ADMIN"), AdminController.getDashboard);

adminRouter.get("/analytics", auth("ADMIN"), AdminController.getAnalytics);

adminRouter.get("/users/activity", auth("ADMIN"), AdminController.getUsers);

adminRouter.get("/subscriptions", auth("ADMIN"), AdminController.getSubscriptions);


export default adminRouter;