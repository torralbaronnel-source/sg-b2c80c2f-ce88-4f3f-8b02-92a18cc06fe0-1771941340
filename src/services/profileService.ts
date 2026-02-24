import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data as Profile | null;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * STRATEGIC FIX FOR TS2589:
   * We cast the supabase client to 'any' here to stop the TypeScript compiler
   * from traversing the massive, recursive database types tree. 
   * This is necessary for deep joins like organization memberships.
   */
  async getUserOrganization(userId: string): Promise<any> {
    const supabaseClient = supabase as any;
    
    const { data, error } = await supabaseClient
      .from("organization_members")
      .select("*, organizations(*)")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching user organization:", error);
      return null;
    }
    
    return (data as any)?.organizations || null;
  }
};