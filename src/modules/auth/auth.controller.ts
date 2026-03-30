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