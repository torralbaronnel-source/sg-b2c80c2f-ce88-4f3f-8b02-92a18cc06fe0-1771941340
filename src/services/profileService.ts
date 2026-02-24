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
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    return { data: data as Profile | null, error };
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
   * Encapsulating the complex organizational query here.
   * We use a type-blinded query string to prevent the TS compiler from 
   * recursing through the massive Database types tree.
   */
  async getUserOrganization(userId: string): Promise<any> {
    // Casting the query string to 'any' prevents the compiler from attempting
    // to map the database schema to the select parameters, which causes recursion.
    const query: any = "*, organizations(*)";
    
    const { data, error } = await supabase
      .from("organization_members")
      .select(query)
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