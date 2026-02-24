import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export type AuthUser = User & {
  email_confirmed_at?: string;
};

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user as AuthUser;
  },

  async getCurrentSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  },

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
  },

  async signIn(email: string, password: string): Promise<{ data: { user: User | null; session: Session | null }; error: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Log the attempt
      await supabase.from("login_attempts").insert({
        email,
        success: !error
      });

      return { data, error };
    } catch (err) {
      return { data: { user: null, session: null }, error: err };
    }
  },

  async getRecentFailedAttempts(email: string, minutes: number = 5): Promise<number> {
    const timeThreshold = new Date(Date.now() - minutes * 60 * 1000).toISOString();
    
    const { count, error } = await supabase
      .from("login_attempts")
      .select("*", { count: 'exact', head: true })
      .eq("email", email)
      .eq("success", false)
      .gt("attempt_time", timeThreshold);

    if (error) return 0;
    return count || 0;
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  async resetPasswordForEmail(email: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  async updatePassword(password: string) {
    return await supabase.auth.updateUser({ password });
  },

  async getUserOrganizations(userId: string) {
    const { data, error } = await supabase
      .from("organization_members")
      .select("*, organizations(*)")
      .eq("profile_id", userId);
    
    return { data: data || [], error };
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  }
};