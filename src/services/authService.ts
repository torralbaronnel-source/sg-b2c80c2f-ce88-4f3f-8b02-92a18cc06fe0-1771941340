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

  async logout() {
    return await supabase.auth.signOut();
  },

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      // We check the profiles table as a proxy for registered users
      // This is safer than exposing actual auth.users existence
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (error) return false;
      return !!data;
    } catch {
      return false;
    }
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