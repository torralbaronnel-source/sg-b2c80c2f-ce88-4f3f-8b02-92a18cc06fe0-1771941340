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

  async trackLoginAttempt(email: string, successful: boolean, source: string = "web") {
    // In a production environment with proper table permissions, this would log to a security table.
    // For now, we use console logging as a placeholder for the security audit trail.
    console.log(`[SECURITY AUDIT] Login attempt for ${email} from ${source}: ${successful ? "SUCCESS" : "FAILURE"}`);
    
    // We can extend this with actual DB logging if a 'login_attempts' table exists
    try {
      await supabase.from("login_attempts").insert({
        email,
        successful,
        source,
        ip_address: "client-side-tracked",
        attempted_at: new Date().toISOString()
      });
    } catch (e) {
      // Silently fail if table doesn't exist yet to prevent blocking auth flow
    }
  }
};