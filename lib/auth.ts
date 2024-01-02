import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      profile(profile: GithubProfile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: profile.type.toLowerCase() ?? "user",
        };
      },
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub.toString(),
          name: profile.name,
          username: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "user",
        };
      },
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "sample@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // confirm data exists
          if (!credentials?.email || !credentials?.password) return null;

          const existingUser = await db.user.findUnique({
            where: { email: credentials?.email },
          });

          if (!existingUser) return null;

          // check if password is valid
          const isPasswordValid = await compare(
            credentials?.password,
            existingUser?.password as string
          );

          if (!isPasswordValid) return null;

          // return user data if valid
          return {
            id: existingUser.id.toString(),
            name: existingUser.name,
            username: existingUser.username as string,
            email: existingUser.email,
            role: existingUser.role as string,
          };
        } catch (err: any) {
          console.log(err.message);
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    // role based access control #persisting-the-role
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          name: user.name,
          username: user.username,
          role: user.role,
        };
      }
      return token;
    },
    // if you want to use the role in client component
    async session({ session, token }) {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            name: token.name,
            username: token.username,
            role: token.role,
          },
        };
      }
      return session;
    },
  },
};
