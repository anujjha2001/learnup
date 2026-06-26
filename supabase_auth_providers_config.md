# Supabase & NextAuth.js Provider Configurations

This configuration guide outlines the setup required to enable Google, LinkedIn, and GitHub OAuth login for LearnUp LMS using either Supabase Auth or NextAuth.js.

---

## Option 1: Supabase OAuth Configurations (Used in Codebase)

To configure OAuth providers on your Supabase project:
1. Go to the **Supabase Dashboard** -> **Authentication** -> **Providers**.
2. Enable the respective toggle switches for Google, LinkedIn, and GitHub.
3. Supply the Client IDs and Secrets obtained from developer consoles.
4. Set the redirect URL to match your application callback path (e.g. `http://localhost:3000/auth/callback` or `${window.location.origin}/auth/dashboard/student`).

### Provider Details & Developer Consoles
- **Google Cloud Console**: Set OAuth Authorized redirect URI to `https://<project-ref>.supabase.co/auth/v1/callback`
- **GitHub Developer Settings**: Register OAuth application and set callback URL to `https://<project-ref>.supabase.co/auth/v1/callback`
- **LinkedIn Developer Console**: Add OAuth 2.0 redirect URI to `https://<project-ref>.supabase.co/auth/v1/callback`

---

## Option 2: NextAuth.js Configuration (`/app/api/auth/[...nextauth]/route.ts`)

If migrating to NextAuth.js, use the following configuration schema:

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user) {
        // Map user attributes to standard session structure
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.isVerified = user.isVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    verifyRequest: "/auth/verify-otp",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
```
