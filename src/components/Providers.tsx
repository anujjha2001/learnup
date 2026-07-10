"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useProfileStore } from "@/store/profileStore";

function SessionSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const updateProfile = useProfileStore((state) => state.updateProfile);

  useEffect(() => {
    if (session?.user) {
      updateProfile({
        fullName: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || "")}&background=3525cd&color=fff`,
        tier: (session as any).role === "INSTRUCTOR" ? "Senior Instructor" : "Premium Student",
      });

      // Sync localStorage keys to prevent page-level code from reading stale localStorage
      localStorage.setItem("user_email", session.user.email || "");
      localStorage.setItem("user_name", session.user.name || "");
      localStorage.setItem("user_avatar", session.user.image || "");
      localStorage.setItem("user_tier", (session as any).role === "INSTRUCTOR" ? "Senior Instructor" : "Premium Student");
      
      const legacyUser = {
        id: (session as any).id || session.user.email,
        name: session.user.name || "",
        email: session.user.email || "",
        role: ((session as any).role || "student").toLowerCase(),
        avatar: session.user.image || "",
        isVerified: true
      };
      localStorage.setItem("learnup_user", JSON.stringify(legacyUser));
    }
  }, [session, updateProfile]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync>{children}</SessionSync>
    </SessionProvider>
  );
}
