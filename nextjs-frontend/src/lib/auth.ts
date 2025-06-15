import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { AdapterUser } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
        // If user exists but no credentials account, link it
        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: "credentials",
          },
        });
        if (!account) {
          await prisma.account.create({
            data: {
              userId: user.id,
              type: "credentials",
              provider: "credentials",
              providerAccountId: user.email,
            },
          });
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // If Google sign-in and user exists with same email, link Google to user
      if (account?.provider === "google" && user?.email) {
        const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (existingUser) {
          // Check if Google account is already linked
          const googleAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: "google",
            },
          });
          if (!googleAccount) {
            // Link Google account
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: "oauth",
                provider: "google",
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                id_token: account.id_token,
              },
            });
          }
        }
      }
      return true;
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email!,
        },
      });
      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
      };
    },
  },
}; 