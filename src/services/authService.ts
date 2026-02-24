import { supabase } from "@/integrations/supabase/client";
import type { AuthResponse, Session, User as AuthUser } from "@supabase/supabase-js";

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error };
    }

    // Verify profile exists
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        // If no profile exists, sign out immediately to prevent partial sessions
        await this.logout();
        return { 
          data: null, 
          error: new Error("Account found but profile is missing. Please contact support or sign up again.") 
        };
      }
    }

    return { data, error: null };
  },

  signUp: async (email: string, pass: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { data, error };
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
  }
};