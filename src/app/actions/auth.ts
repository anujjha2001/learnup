"use server";

export interface NavbarSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

/**
 * getNavbarSession - Server action that reads the user's session from cookies.
 * Returns null if no session exists or if the token is invalid.
 *
 * Note: This is used on the client side via dynamic import to check for admin
 * role and redirect accordingly. In a real app, this would validate a JWT or
 * session token against a database. For now, it reads from a cookie.
 */
export async function getNavbarSession(): Promise<NavbarSession | null> {
  try {
    // Import cookies from next/headers to read the session cookie
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("learnup_token")?.value;

    if (!token) {
      return null;
    }

    // Decode the JWT token to get user info (without verifying in this lightweight check)
    // In production, you should verify the JWT signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    if (!payload || !payload.sub) return null;

    return {
      user: {
        id: payload.sub || payload.id || "",
        name: payload.name || "",
        email: payload.email || "",
        role: (payload.role || "student").toUpperCase(),
        avatar: payload.avatar || "",
      },
    };
  } catch {
    // Return null on any error (invalid token, no cookie, etc.)
    return null;
  }
}
