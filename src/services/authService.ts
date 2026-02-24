import { supabase } from "@/integrations/supabase/client";
import type { AuthResponse, Session, User as AuthUser } from "@supabase/supabase-js";

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  async resetPasswordRequest(email: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
    });
  },

  async updatePassword(password: string) {
    return await supabase.auth.updateUser({ password });
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async trackLoginAttempt(email: string, success: boolean, userId?: string) {
    try {
      await supabase.from("login_attempts").insert({
        email,
        success,
        user_id: userId,
        attempt_time: new Date().toISOString(),
      });
    } catch (error) {
      // Silently fail if table doesn't exist yet to prevent blocking auth flow
    }
  }
};