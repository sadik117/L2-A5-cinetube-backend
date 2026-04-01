/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import { setAuthCookies } from "../../utils/setCookie";
import { catchAsync } from "../../utils/catchAsync";
import { sendResetEmail } from "../../utils/sendEmail";


export const loginUser = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthService.loginUser(req.body);

    setAuthCookies(res, result);

    res.json({
      message: "Login successful",
      user: result.user,
    });

});


export const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.registerUser(req.body);

    setAuthCookies(res, result);

    res.status(201).json({
      message: "Registration successful",
      user: result.user,
    });

});


export const refreshToken = catchAsync(async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;

    const newAccessToken = await AuthService.refreshAccessToken(
      refreshToken
    );

    // update access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000, // 30 min
    });

    res.json({
      message: "Access token refreshed",
    });

});


export const logoutUser = catchAsync(async (req: Request, res: Response) => {

  const sessionToken = req.cookies.sessionToken;

    await AuthService.logoutUser(sessionToken);

    // clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("sessionToken");

    res.json({
      message: "Logged out successfully",
    });

});


// redirect to Google
export const googleLogin = (req: Request, res: Response) => {
  const url =
  `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${process.env.GOOGLE_CLIENT_ID}` +
  `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
  `&response_type=code` +
  `&scope=openid%20email%20profile` +
  `&access_type=offline` +
  `&prompt=consent`;

  res.redirect(url);
};


// callback
export const googleCallback = catchAsync(async (req: Request, res: Response) => {

    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ message: "No code provided" });
    }

    const result = await AuthService.googleLoginService(code);

    // set cookies
    setAuthCookies(res, result);

    // redirect to frontend
    res.redirect("http://localhost:3000");

});


export const forgotPassword = catchAsync(async (req: Request, res: Response) => {

    const { email } = req.body;

    const token = await AuthService.forgotPassword(email);

    const resetURL = `http://localhost:3000/reset-password/${token}`;

    await sendResetEmail(email, resetURL);

    res.json({
      message: "Password reset email sent",
    });

});


export const resetPassword = catchAsync(async (req: Request, res: Response) => {

    const { token } = req.params;
    const { password } = req.body;

    await AuthService.resetPassword(token as string, password);

    res.json({
      message: "Password reset successfully",
    });
  
});