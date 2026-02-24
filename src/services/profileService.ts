import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  role?: string;
};

export const profileService = {
  getProfile: async (id: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      // If profile doesn't exist, create it from auth data
      if (!data) {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;
        
        if (user && user.id === id) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email!,
              full_name: user.user_metadata?.full_name || "New User",
              role: "admin" // Default first user/admin role
            })
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating auto-profile:", createError);
            return null;
          }
          return newProfile as Profile;
        }
      }

      return data as Profile;
    } catch (err) {
      console.error("Unexpected error in getProfile:", err);
      return null;
    }
  },

  async updateProfile(userId: string, updates: { 
    full_name?: string; 
    avatar_url?: string;
    bio?: string;
    role?: string;
  }): Promise<boolean> {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile:", error);
      return false;
    }
    return true;
  },

  async getUserOrganization(profileId: string) {
    const { data, error } = await supabase
      .from("organization_members")
      .select("*, organizations(*)")
      .eq("profile_id", profileId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user organization:", error);
      return null;
    }
    
    return (data as any)?.organizations || null;
  }
};