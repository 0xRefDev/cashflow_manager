import { LoginPayload, LoginResponse, RegisterPayload } from "@/types/auth.types";
import { UserResponse } from "@/types/user.types";
import { UserProfile } from "@/types/profile.types";

export const authService = {
  async getMe(): Promise<UserResponse> {
    const res = await fetch("/api/v1/user/me");
    if (!res.ok) throw new Error("Session expired");
    const data = await res.json();
    return data.user;
  },

  async getProfile(): Promise<UserProfile> {
    const res = await fetch("/api/v1/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();
    return data.profile;
  },

  async register(payload: RegisterPayload): Promise<{ success: boolean }> {
    const res = await fetch("/api/v1/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? "Error al crear la cuenta");
    }

    return res.json();
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await fetch("/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? "Error al iniciar sesión");
    }

    return res.json();
  },

  async logout() {
    await fetch("/api/logout", { method: "POST" });
  },

  async sendOtp(email: string): Promise<{ success: boolean }> {
    const res = await fetch("/api/v1/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? "Failed to send verification code");
    }

    return res.json();
  },

  async verifyOtp(email: string, code: string): Promise<{ success: boolean }> {
    const res = await fetch("/api/v1/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? "Invalid verification code");
    }

    return res.json();
  },
};
