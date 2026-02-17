// auth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { connectToDB } from "./lib/connectDB";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        const { email, password } = credentials ?? {};
        if (!email || !password) throw new Error("Email and password are required");

        const user = await User.findOne({ email }).select("+password");
        if (!user || !user.password) throw new Error("Invalid credentials");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Invalid credentials");
        // console.log("✅ Fetched user from DB:", user);


        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username, // ✅ ensure this is available
          role: user.role || "user",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username; // ✅ store in token
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          username: token.username, // ✅ include in session
          role: token.role,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
