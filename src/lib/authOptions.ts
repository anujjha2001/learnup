import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

// Ensure NEXTAUTH_URL has a protocol to prevent ERR_INVALID_URL during build
if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http")) {
  process.env.NEXTAUTH_URL = "https://" + process.env.NEXTAUTH_URL;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user) {
          throw new Error("Invalid credentials.");
        }
        if (user.password !== credentials.password) {
          throw new Error("Invalid credentials.");
        }
        if (!user.isVerified) {
          throw new Error("unverified");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github' || account?.provider === 'linkedin') {
        const dbUser = await db.user.findUnique({
          where: { email: user.email as string }
        });
        
        if (!dbUser) {
          let selectedRole = "STUDENT";
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            const roleCookie = cookieStore.get("selected_role")?.value;
            if (roleCookie === "instructor") {
              selectedRole = "INSTRUCTOR";
            }
          } catch (e) {
            console.error("Error reading role cookie in signIn:", e);
          }

          const newUser = await db.user.create({
            data: {
              email: user.email as string,
              name: user.name || "",
              role: selectedRole,
              isVerified: true,
              password: "",
              avatar: user.image || "",
              status: selectedRole === "INSTRUCTOR" ? "PENDING" : "APPROVED",
              instructor: selectedRole === "INSTRUCTOR" ? {
                create: {
                  isApproved: false,
                  cvUrl: "",
                  degreeUrl: "",
                  collegeName: "",
                  courseName: ""
                }
              } : undefined
            }
          });

          await db.wallet.create({
            data: {
              userId: newUser.id,
              balance: selectedRole === "STUDENT" ? 20000.0 : 0.0,
            }
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isVerified = (user as any).isVerified !== false;
      }
      if (token.email && !token.id) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email }
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isVerified = dbUser.isVerified;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session as any).id = token.id;
        (session as any).role = token.role;
        (session.user as any).isVerified = token.isVerified;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl + "/dashboard";
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
