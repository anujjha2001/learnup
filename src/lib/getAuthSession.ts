import { cookies } from "next/headers";
import { getServerSession as nextAuthGetServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export interface AuthSession {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * Unified session resolver for API route handlers.
 * Checks the custom `learnup_session` HttpOnly cookie first (email/password login),
 * then falls back to NextAuth OAuth session (Google / GitHub / LinkedIn).
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    // 1. Check custom session cookie (set by /api/auth/login)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("learnup_session");

    if (sessionCookie?.value) {
      try {
        const parsed = JSON.parse(sessionCookie.value) as AuthSession["user"] & { id: string };
        if (parsed?.id && parsed?.role) {
          return {
            id: parsed.id,
            user: {
              id: parsed.id,
              name: parsed.name || "",
              email: parsed.email || "",
              role: parsed.role?.toUpperCase() || "STUDENT",
            },
          };
        }
      } catch {
        // malformed cookie — fall through to NextAuth
      }
    }

    // 2. Fall back to NextAuth OAuth session
    const nextAuthSession = await nextAuthGetServerSession(authOptions);
    if (nextAuthSession?.user) {
      const userId = (nextAuthSession.user as any).id || nextAuthSession.user.email;
      return {
        id: userId,
        user: {
          id: userId,
          name: nextAuthSession.user.name || "",
          email: nextAuthSession.user.email || "",
          role: ((nextAuthSession as any).role || "STUDENT").toUpperCase(),
        },
      };
    }

    return null;
  } catch {
    return null;
  }
}
