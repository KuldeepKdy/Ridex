import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/db";
import User from "./models/user.model";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(credentials, request) {
         console.log("authorize started");
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const email = credentials.email;
        const password = credentials.password as string;
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User does not exist");
        }
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
          throw new Error("Incorrect password");
        }
        console.log("returning user");
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          await User.create({
            name: user.name,
            email: user.email,
          });
        }
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
      }
      return true;
    },
    async jwt({ token, user }) {
      console.log("JWT CALLBACK");
      console.log({ token, user });
      if (user) {
        token.id = user?.id;
        token.name = user?.name;
        token.email = user?.email;
        token.role = user?.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("SESSION CALLBACK");
      console.log({ session, token });
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
});
