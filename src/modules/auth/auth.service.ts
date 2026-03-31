/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  generateSessionToken,
} from "../../utils/token";
import { ILoginData, IRegisterData } from "./auth.interface";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

export const registerUser = async (data: IRegisterData) => {
  const { name, email, password, image } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name as string,
      email,
      password: hashedPassword,
      image: image || null,
    },
  });

  return createSession(user);
};

export const loginUser = async (data: ILoginData) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password!);

  if (!isMatch) throw new Error("Invalid password");

  return createSession(user);
};

// common session creation logic for both login and registration
const createSession = async (user: { id: string; role: string }) => {
  const payload = {
    id: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const sessionToken = generateSessionToken();

  // store session in DB
  await prisma.session.create({
    data: {
      id: generateSessionToken(),
      userId: user.id,
      token: sessionToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    sessionToken,
    user,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  // verify refresh token
  const decoded: any = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!,
  );

  // check if session exists in DB
  const session = await prisma.session.findFirst({
    where: {
      refreshToken,
      userId: decoded.id,
    },
  });

  if (!session) {
    throw new Error("Invalid session");
  }

  // check expiration
  if (new Date() > session.expiresAt) {
    throw new Error("Session expired");
  }

  // generate new access token
  const newAccessToken = generateAccessToken({
    id: decoded.id,
    role: decoded.role,
  });

  return newAccessToken;
};

export const logoutUser = async (sessionToken: string) => {
  if (!sessionToken) return;

  await prisma.session.deleteMany({
    where: { sessionToken },
  });
};

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

export const googleLoginService = async (code: string) => {
  //  exchange code for tokens
  const { tokens } = await client.getToken(code);

  // verify id_token
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Error("Google authentication failed");
  }

  // find or create user
  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: (payload.name as string) || "Google User",
        email: payload.email as string,
        image: (payload.picture as string) || null,
        password: "", // no password
      },
    });
  }

  // create tokens (same as your system)
  const jwtPayload = {
    id: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);
  const sessionToken = generateSessionToken();

  await prisma.session.create({
    data: {
      id: generateSessionToken(),
      userId: user.id as string,
      refreshToken: refreshToken as string,
      token: sessionToken as string,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    sessionToken,
    user,
  };
};
