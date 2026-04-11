/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

export const setAuthCookies = (res: Response, tokens: any) => {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days for access token,
    path: "/",
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day for refresh token,
    path: "/",
  });

  res.cookie("sessionToken", tokens.sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days for session token,
    path: "/",
  });
};