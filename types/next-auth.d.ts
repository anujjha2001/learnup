import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    id: string;
    role: string;
    user: {
      id: string;
      role: string;
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    isVerified: boolean;
  }
}
