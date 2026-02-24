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
interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  currentOrganization: any | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPasswordRequest: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUserData = async (userId: string) => {
    try {
      // 1. Load Profile via simplified service
      const profileData = await profileService.getProfile(userId);
      setProfile(profileData);
      
      // 2. Load Organization
      const { data: membership, error: orgError } = await supabase
        .from("organization_members")
        .select(`*, organizations(*)`)
        .eq("profile_id", userId)
        .limit(1)
        .maybeSingle();

      if (!orgError && membership) {
        setCurrentOrganization(membership);
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    }
  };

  useEffect(() => {
    // Initial session check
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("AuthContext: Initial session", session?.user?.id);
        if (session) {
          await loadUserData(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("AuthContext: Init error", error);
        setIsLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthContext: Auth State Change", event, session?.user?.id);
      
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        
        const profileData = await profileService.getProfile(session.user.id);
        setProfile(profileData);
        
        // Ensure we only redirect once the profile is loaded or created
        if (profileData && (window.location.pathname === "/login" || window.location.pathname === "/signup" || window.location.pathname === "/")) {
          router.push("/dashboard");
        }
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
    loading: isLoading,
    isLoading,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut,
    resetPasswordRequest: authService.resetPasswordRequest,
    updatePassword: authService.updatePassword,
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