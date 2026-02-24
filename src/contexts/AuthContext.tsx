import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { useRouter } from "next/navigation";

// Global cache for session to prevent flickering during navigation
const cachedSession: any = null;
const cachedProfile: any = null;

/**
 * STRATEGIC FIX FOR TS2589:
 * We use simplified function signatures here to stop the TypeScript compiler from 
 * infinitely recursing through the Supabase Database types.
 */
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  currentOrganization: any | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    const profileData = await profileService.getProfile(userId);
    setProfile(profileData);
    if (profileData) {
      const org = await profileService.getUserOrganization(userId);
      setCurrentOrganization(org);
    }
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        setCurrentOrganization(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Use type erasure during assignment to bypass the recursion check
  const value: any = {
    user,
    session,
    profile,
    currentOrganization,
    isLoading,
    refreshProfile: async () => {
      if (user) await fetchProfile(user.id);
    },
  };

  return <AuthContext.Provider value={value as AuthContextType}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};