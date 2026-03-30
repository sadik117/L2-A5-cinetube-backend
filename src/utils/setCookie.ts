/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

export const setAuthCookies = (res: Response, tokens: any) => {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days for access token,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day for refresh token,
  });

  res.cookie("sessionToken", tokens.sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days for session token,
  });
};