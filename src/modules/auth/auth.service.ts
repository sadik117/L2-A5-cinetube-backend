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
    process.env.JWT_REFRESH_SECRET!
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