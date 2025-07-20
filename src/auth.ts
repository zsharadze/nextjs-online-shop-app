import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "./app/services/auth.service";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        if (credentials === null) return null;

        try {
          const user = await findUserByEmail(credentials?.email);

          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isMatch) {
              return user;
            } else {
              return null;
            }
          } else {
            console.log("Login failed");
            return null;
          }
        } catch (error: any) {
          console.log("throwing general error", error);
          throw new Error(error);
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }: any) {
      // Attach role or other user data from the JWT

      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.sub; // Assign user ID
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role; // Store role in JWT
      }
      return token;
    },
  },
});