import { Router } from "express";
import * as AuthController from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", AuthController.registerUser);
authRouter.post("/login", AuthController.loginUser);
authRouter.post("/refresh-token", AuthController.refreshToken);
authRouter.post("/logout", AuthController.logoutUser);
authRouter.get("/login/google", AuthController.googleLogin);
authRouter.get("/login/google/callback", AuthController.googleCallback);

export default authRouter;