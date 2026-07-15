import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import AdminUser from "../models/AdminUser";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@ragugoatform.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        const email = credentials.email.trim().toLowerCase();

        // 1. Check against Environment Variables first (great for fresh Vercel deployments)
        const envAdminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
        const envAdminPassword = process.env.SEED_ADMIN_PASSWORD;

        if (envAdminEmail && envAdminPassword && email === envAdminEmail && credentials.password === envAdminPassword) {
          await connectToDatabase();
          let user = await AdminUser.findOne({ email: envAdminEmail });
          
          if (!user) {
            // Auto-seed the database if this admin doesn't exist yet
            const passwordHash = await bcrypt.hash(envAdminPassword, 10);
            user = await AdminUser.create({
              name: "System Admin",
              email: envAdminEmail,
              passwordHash,
              role: "superadmin",
            });
          } else {
            // Ensure the password matches the ENV password to keep them synced
            const isValid = await bcrypt.compare(envAdminPassword, user.passwordHash);
            if (!isValid) {
              user.passwordHash = await bcrypt.hash(envAdminPassword, 10);
              await user.save();
            }
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        // 2. Fallback to Database Check
        await connectToDatabase();
        const user = await AdminUser.findOne({ email });

        // Generic message for both cases to prevent user enumeration.
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
