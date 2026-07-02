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
  }
};

export async function getServerSession() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("learnup_token")?.value;
    if (!token) return null;

    let uid = "";
    let role = "STUDENT";
    let name = "";
    let email = "";

    // Support placeholder tokens in local development
    if (token.startsWith("jwt-session-token-placeholder-") || token.startsWith("oauth-jwt-placeholder-")) {
      const prefix = token.startsWith("jwt-session-token-placeholder-")
        ? "jwt-session-token-placeholder-"
        : "oauth-jwt-placeholder-";
      const idAndTimestamp = token.replace(prefix, "");
      const parts = idAndTimestamp.split("-");
      if (parts.length >= 4) {
        uid = parts.slice(0, parts.length - 3).join("-");
      } else {
        uid = parts.slice(0, parts.length - 1).join("-");
      }

      const { db } = await import("@/lib/db");
      const dbUser = await db.user.findUnique({
        where: { id: uid }
      });
      if (!dbUser) return null;
      role = dbUser.role;
      name = dbUser.name || "";
      email = dbUser.email;
    } else {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      if (!payload) return null;
      uid = payload.sub || payload.id || "";
      role = payload.role || "student";
      name = payload.name || "";
      email = payload.email || "";
    }

    return {
      id: uid,
      user: {
        id: uid,
        name: name,
        email: email,
        role: role.toUpperCase(),
      }
    };
  } catch {
    return null;
  }
}

