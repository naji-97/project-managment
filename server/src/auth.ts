// server/src/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email";
const prisma = new PrismaClient();
// const sendEmail = async (emailData: { to: string; subject: string; text: string }) => {
//   // Implement with your email service (Nodemailer, SendGrid, Resend, etc.)
//   console.log('Sending email:', emailData);
//   // Example with console log for development:
//   console.log(`📧 Email to: ${emailData.to}`);
//   console.log(`📧 Subject: ${emailData.subject}`);
//   console.log(`📧 Body: ${emailData.text}`);
  
//   // In production, implement actual email sending:
//   // await yourEmailService.send(emailData);
// };

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // ✅ you’re using Neon
    }),
     trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://project-managment-lilac.vercel.app",
    "https://*.vercel.app" // Wildcard for all Vercel previews
],

    
    user:{
        modelName: "User",
        fields: {
            id: "id",
            email: "email",
            name: "name",
            emailVerified: "emailVerified",
            image: "image",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            
        },
        additionalFields: {
            username: {
                type: "string",
                unique: false, // usernames should be unique
                required: true, // make it true if you want to force users to set a username
                input:true
            },
            profilePictureUrl: {
                type: "string",
                unique: false, // usernames should be unique
                required: false, // make it true if you want to force users to set a username
                input:false,
                defaultValue: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80"
            },
        }
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
          sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
      // You can add additional logic here, like logging or notifications
    },
    },
 
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            scope: ["profile", "email"],
            mapProfileToUser: (profile) => {
            return {
                name: `${profile.given_name}${profile.family_name}`,
                profilePictureUrl: profile.picture,
                username: profile.given_name, // Simple username from email
            }
            }
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,   
            scope: ["read:user", "user:email"],
            mapProfileToUser: (profile) => {
                return {
                    profilePictureUrl: profile.avatar_url,
                    username: profile.login,
                    name: profile.name
                }
            }
        },
    },
    
    session: {
        expiresIn: 1 * 24 * 60 * 60, // 1 days

    },
   advanced:{
    useSecureCookies: true, // Set to true in production (requires HTTPS)
    defaultCookieAttributes: {
        sameSite:"none", //process.env.NODE_ENV === "production" ? "none" : "lax",
        secure:true, // process.env.NODE_ENV === "production", // Set to true in production (requires HTTPS)
        httpOnly: true, // process.env.NODE_ENV === "production", // Set to true in production
        // domain: process.env.NODE_ENV === "production" ? ".vercel.app" : "localhost",
        
        
    },
    cookies: {
        session_token:{
            name: "__Secure-auth-session",
        }
   },
   
   },
    api: {
        basePath: "/api/auth"
    },
    plugins: [nextCookies()],
});
