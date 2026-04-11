// [NOTE- Using custom auth so skip this file for now but keeping it for google authentication later]

// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { prisma } from "./prisma";

// export const auth = betterAuth({
//   basePath: "/api/auth",
//   baseURL: process.env.BETTER_AUTH_URL!,

//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),

//   trustedOrigins: [
//     "http://localhost:3000",
//     "https://cinetube-universe.vercel.app",
//   ],

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     },
//   },

//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // 7 days

//     cookie: {
//       sameSite: "none", 
//       secure: true,     
//     },
//   },

// });