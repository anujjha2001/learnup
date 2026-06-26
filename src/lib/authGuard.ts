import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
  isVerified: boolean;
}

/**
 * useAuthGuard - A React Hook to prevent access in protected components if the user is not verified.
 * Redirects the user to the OTP verification page if not verified, or to login page if no session exists.
 * Returns true if verified, false otherwise.
 */
export function useAuthGuard(session: UserSession | null): boolean {
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/auth");
      return;
    }

    if (!session.isVerified) {
      router.push(`/auth/verify-otp?email=${encodeURIComponent(session.email)}`);
    }
  }, [session, router]);

  if (!session || !session.isVerified) {
    return false;
  }

  return true;
}

/**
 * isSessionVerified - A pure helper function to check if the session is authenticated and verified.
 * Suitable for middleware, route handlers, or server-side checks.
 */
export function isSessionVerified(session: any): boolean {
  if (!session) return false;
  return session.isVerified === true || session.user?.isVerified === true;
}
