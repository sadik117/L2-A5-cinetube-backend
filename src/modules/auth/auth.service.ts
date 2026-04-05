/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  generateSessionToken,
} from "../../utils/token";
import { ILoginData } from "./auth.interface";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../utils/AppError";
import crypto from "crypto";
import cloudinary from "../../lib/cloudinary";
import streamifier from "streamifier";


const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "cine-tube/profiles", 
        resource_type: "image",
        transformation: [{ width: 400, height: 400, crop: "fill" }],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result!.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};


export const registerUser = async (
    name: string,
    email: string,
    password: string,
    file?: Express.Multer.File   // file from multer
  ) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl: string | null = null;

    // Upload image to Cloudinary if file exists
    if (file?.buffer) {
      try {
        imageUrl = await uploadToCloudinary(file.buffer);
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        // Continue registration even if image upload fails (non-blocking)
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: imageUrl,        // ← Save URL as String
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    const session = await createSession(user);

    return { user, session };
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
    throw new AppError("No refresh token found", 400);
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
    throw new AppError("Invalid session", 400);
  }

  // check expiration
  if (new Date() > session.expiresAt) {
    throw new AppError("Session expired", 400);
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
    throw new AppError("Google authentication failed", 400);
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


export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // save in DB
  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: hashedToken as string,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    },
  });

  // return raw token send via email
  return resetToken;
};


export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AppError("Token invalid or expired", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return true;
};


export const getCurrentUser = async (userId: string) => {

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,

        _count: {
          select: {
            reviews: true,
            watchlist: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  };