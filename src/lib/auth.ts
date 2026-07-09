import { z } from "zod";
import { useProfileStore } from "@/store/profileStore";

// EMAIL VALIDATION: Reject spaces, require valid username and domain parts, and standard TLD
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;

export const EmailSchema = z
  .string()
  .min(5, "Email is too short")
  .max(100, "Email is too long")
  .regex(emailRegex, "Invalid email format")
  .refine((val) => {
    // Prevent dummy emails like "a@b.cd" or repeating dots
    const parts = val.split("@");
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    if (local.length < 2 || domain.length < 4) return false;
    if (domain.includes("..") || domain.startsWith(".") || domain.endsWith(".")) return false;
    return true;
  }, "Invalid email format and domain boundaries");

// PHONE VALIDATION: Match international or standard 10-digit formats and reject dummy inputs
const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;

export const PhoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .max(18, "Phone number is too long")
  .regex(phoneRegex, "Invalid phone number format")
  .refine((val) => {
    // Strip styling characters
    const digits = val.replace(/[\s+()-]/g, "");
    
    // Reject repeated digits (e.g., "9999999999", "1111111111")
    if (/^(\d)\1{9,}$/.test(digits)) return false;
    
    // Reject sequential counts (e.g., "1234567890", "0987654321", "0123456789")
    const sequentialUp = "0123456789012345";
    const sequentialDown = "9876543210987654";
    if (sequentialUp.includes(digits) || sequentialDown.includes(digits)) {
      return false;
    }
    
    return true;
  }, "Please enter a valid, active phone number (no fake/repeated sequences)");

// PASSWORD VALIDATION: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special symbol
export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .refine((val) => {
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasDigit = /\d/.test(val);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);
    return hasUpper && hasLower && hasDigit && hasSpecial;
  }, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");

// Auth schemas
export const LoginValidationSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Password is required"),
});

export const RegisterValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: EmailSchema,
  phone: PhoneSchema,
  password: PasswordSchema,
});

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "student" | "instructor";
  avatar: string;
}

// Session Sync Utilities
export const authService = {
  getCurrentUser(): UserSession | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("learnup_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  register(data: z.infer<typeof RegisterValidationSchema>, role: "student" | "instructor"): Promise<UserSession> {
    return new Promise((resolve, reject) => {
      // Simulate network request
      setTimeout(() => {
        try {
          // Double validation check
          RegisterValidationSchema.parse(data);

          const newUser: UserSession = {
            id: `usr-${Date.now()}`,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: role,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=3525cd&color=fff`,
          };

          localStorage.setItem("learnup_user", JSON.stringify(newUser));
          localStorage.setItem("user_email", newUser.email);
          localStorage.setItem("user_name", newUser.name);
          localStorage.setItem("user_avatar", newUser.avatar);
          localStorage.setItem("user_tier", role === "student" ? "Premium Student" : "Senior Instructor");
          const token = `jwt-session-token-placeholder-${newUser.id}-${role.toUpperCase()}-${role === "instructor" ? "PENDING" : "APPROVED"}-${Date.now()}`;
          localStorage.setItem("learnup_token", token);
          if (typeof document !== "undefined") {
            document.cookie = `learnup_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          }

          // Sync zustand store
          const store = useProfileStore.getState();
          store.updateProfile({
            fullName: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            tier: role === "student" ? "Premium Student" : "Senior Instructor",
          });

          // Dispatch profile update trigger
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("profile_update_event"));
          }

          resolve(newUser);
        } catch (err: any) {
          reject(err.errors?.[0]?.message || "Validation failed during registration");
        }
      }, 600);
    });
  },

  login(data: z.infer<typeof LoginValidationSchema>, role: "student" | "instructor"): Promise<UserSession> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          LoginValidationSchema.parse(data);

          // Get existing details or generate default
          const storedName = localStorage.getItem("user_name") || (role === "student" ? "Anuj Jha" : "Amit");
          const avatar = localStorage.getItem("user_avatar") || `https://ui-avatars.com/api/?name=${encodeURIComponent(storedName)}&background=3525cd&color=fff`;

          const sessionUser: UserSession = {
            id: role === "student" ? "std-1" : "inst-1",
            name: storedName,
            email: data.email,
            role: role,
            avatar: avatar,
          };

          localStorage.setItem("learnup_user", JSON.stringify(sessionUser));
          localStorage.setItem("user_email", sessionUser.email);
          localStorage.setItem("user_name", sessionUser.name);
          const token = `jwt-session-token-placeholder-${sessionUser.id}-${role.toUpperCase()}-APPROVED-${Date.now()}`;
          localStorage.setItem("learnup_token", token);
          if (typeof document !== "undefined") {
            document.cookie = `learnup_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          }

          // Sync zustand
          const store = useProfileStore.getState();
          store.updateProfile({
            fullName: sessionUser.name,
            email: sessionUser.email,
            avatar: sessionUser.avatar,
            tier: role === "student" ? "Premium Student" : "Senior Instructor",
          });

          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("profile_update_event"));
          }

          resolve(sessionUser);
        } catch (err: any) {
          reject(err.errors?.[0]?.message || "Validation failed during login");
        }
      }, 600);
    });
  },

  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("learnup_user");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    document.cookie = "learnup_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

import { getServerSession as nextAuthGetServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function getServerSession() {
  try {
    const session = await nextAuthGetServerSession(authOptions);
    if (!session || !session.user) return null;
    
    return {
      id: (session.user as any).id || session.user.email,
      user: {
        id: (session.user as any).id || session.user.email,
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session as any).role?.toUpperCase() || "STUDENT",
        avatar: session.user.image || ""
      }
    };
  } catch {
    return null;
  }
}

