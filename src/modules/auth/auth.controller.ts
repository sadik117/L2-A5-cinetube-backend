/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import { setAuthCookies } from "../../utils/setCookie";


export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);

    setAuthCookies(res, result);

    res.json({
      message: "Login successful",
      user: result.user,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};


export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.registerUser(req.body);

    setAuthCookies(res, result);

    res.status(201).json({
      message: "Registration successful",
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const refreshToken = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};


export const logoutUser = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.cookies.sessionToken;

    await AuthService.logoutUser(sessionToken);

    // clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("sessionToken");

    res.json({
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


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
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ message: "No code provided" });
    }

    const result = await AuthService.googleLoginService(code);

    // set cookies
    setAuthCookies(res, result);

    // redirect to frontend
    res.redirect("http://localhost:3000");
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};