import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToDatabase } from "./db";
import AdminUser from "../models/AdminUser";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@ragugoatfarm.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        await connectToDatabase();
        // mongoose is already imported at the top of the file
        console.log("LOGIN ATTEMPT - DB URI:", process.env.MONGODB_URI);
        console.log("LOGIN ATTEMPT - DB Name:", mongoose.connection.name);
        
        console.log("LOGIN ATTEMPT - Raw Email:", credentials.email);
        const email = credentials.email.trim().toLowerCase();
        console.log("LOGIN ATTEMPT - Trimmed Email:", email);

        const user = await AdminUser.findOne({ email });
        console.log("LOGIN ATTEMPT - Found User:", user ? user.email : "null");

        if (!user) {
          throw new Error("No admin found with this email");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
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
