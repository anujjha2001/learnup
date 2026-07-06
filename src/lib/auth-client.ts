/**
 * LearnUp Authentication Client Utility
 * Handles API calls, loading states, and error handling for the Auth module.
 */

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

async function request<T = any>(
  url: string,
  body: any,
  onLoading?: (loading: boolean) => void
): Promise<AuthResponse<T>> {
  if (onLoading) onLoading(true);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${res.status}`,
        status: res.status,
      };
    }

    return {
      success: true,
      data,
      status: res.status,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Network error. Please try again.",
      status: 500,
    };
  } finally {
    if (onLoading) onLoading(false);
  }
}

export const authClient = {
  /**
   * Register a new student or instructor
   */
  async register(
    params: {
      email: string;
      password: string;
      name: string;
      phone: string;
      role?: "STUDENT" | "INSTRUCTOR";
    },
    onLoading?: (loading: boolean) => void
  ): Promise<AuthResponse<{ message: string; userId: string; email: string }>> {
    return request("/api/auth/register", params, onLoading);
  },

  /**
   * Verify registration OTP
   */
  async verify(
    params: { email: string; otp: string },
    onLoading?: (loading: boolean) => void
  ): Promise<
    AuthResponse<{
      message: string;
      userId: string;
      isVerified: boolean;
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        phone: string;
        role: "STUDENT" | "INSTRUCTOR";
      };
    }>
  > {
    return request("/api/auth/verify", params, onLoading);
  },

  /**
   * Login credentials check
   */
  async login(
    params: { email: string; password: string },
    onLoading?: (loading: boolean) => void
  ): Promise<
    AuthResponse<{
      message: string;
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        phone: string;
        role: "STUDENT" | "INSTRUCTOR";
      };
    }>
  > {
    return request("/api/auth/login", params, onLoading);
  },

  /**
   * Forget password request to get OTP
   */
  async resetPassword(
    params: { email: string },
    onLoading?: (loading: boolean) => void
  ): Promise<AuthResponse<{ message: string; email: string }>> {
    return request("/api/auth/reset-password", params, onLoading);
  },

  /**
   * Finalize password reset via OTP
   */
  async verifyReset(
    params: { email: string; otp: string; newPassword: string },
    onLoading?: (loading: boolean) => void
  ): Promise<AuthResponse<{ message: string; userId: string }>> {
    return request("/api/auth/verify-reset", params, onLoading);
  },

  /**
   * Update active user profile details
   */
  async updateProfile(
    params: { userId: string; name: string; email: string; phone: string; password?: string },
    onLoading?: (loading: boolean) => void
  ): Promise<AuthResponse<{ message: string; user: any }>> {
    return request("/api/user/update", params, onLoading);
  },
};
