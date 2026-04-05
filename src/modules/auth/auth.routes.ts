import { Router } from "express";
import * as AuthController from "./auth.controller";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/cloudinaryUpload";

const authRouter = Router();

authRouter.post("/register", upload.single("image"), AuthController.registerUser);
authRouter.post("/login", AuthController.loginUser);
authRouter.post("/refresh-token", AuthController.refreshToken);
authRouter.post("/logout", AuthController.logoutUser);
authRouter.get("/login/google", AuthController.googleLogin);
authRouter.get("/login/google/callback", AuthController.googleCallback);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/reset-password/:token", AuthController.resetPassword);
authRouter.get("/me", auth(), AuthController.getCurrentUser);

export default authRouter;