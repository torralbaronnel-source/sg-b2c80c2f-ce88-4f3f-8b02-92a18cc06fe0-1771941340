import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";

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

  const loadUserData = async (userId: string) => {
    try {
      const { data: profileData } = await profileService.getProfile(userId);
      setProfile(profileData);
      
      const { data: orgs } = await supabase
        .from("organization_members")
        .select("*, organizations(*)")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();
        
      setCurrentOrganization(orgs?.organizations || null);
    } catch (error) {
      console.error("Error loading auth data:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await loadUserData(currentSession.user.id);
      }
      setIsLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await loadUserData(currentSession.user.id);
      } else {
        setProfile(null);
        setCurrentOrganization(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Use type erasure during assignment to bypass the recursion check
  const value: AuthContextType = {
    user,
    session,
    profile,
    currentOrganization,
    loading: isLoading,
    isLoading,
    signIn: authService.signIn as any,
    signUp: authService.signUp as any,
    signOut: authService.signOut as any,
    resetPasswordRequest: authService.resetPasswordRequest as any,
    updatePassword: authService.updatePassword as any,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};