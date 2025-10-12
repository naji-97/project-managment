// server/src/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
const prisma = new PrismaClient();
const sendEmail = async (emailData: { to: string; subject: string; text: string }) => {
  // Implement with your email service (Nodemailer, SendGrid, Resend, etc.)
  console.log('Sending email:', emailData);
  // Example with console log for development:
  console.log(`📧 Email to: ${emailData.to}`);
  console.log(`📧 Subject: ${emailData.subject}`);
  console.log(`📧 Body: ${emailData.text}`);
  
  // In production, implement actual email sending:
  // await yourEmailService.send(emailData);
};

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
            }
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
    
    session: {
        expiresIn: 1 * 24 * 60 * 60, // 1 days

    },
   advanced:{
    useSecureCookies: true, // Set to true in production (requires HTTPS)
    defaultCookieAttributes: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production", // Set to true in production (requires HTTPS)
        httpOnly: false, // Set to true in production
        
    },
    cookies: {
        session_token:{
            name: "auth-session",
            
            
        }
   },
   },
    api: {
        basePath: "/api/auth"
    },
    plugins: [nextCookies()],
});
