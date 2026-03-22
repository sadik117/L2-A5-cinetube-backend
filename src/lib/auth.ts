import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


export const auth = betterAuth({

    baseURL: process.env.BETTER_AUTH_URL! || "http://localhost:5000",
    basePath: "/api/v1/auth",

    database: prismaAdapter(prisma, {
        
        provider: "postgresql",
    }),
    emailAndPassword:{
        enabled: true
    },
    // socialProviders:{
    //     google:
    // }
});