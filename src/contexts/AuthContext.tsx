import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";

// Breaking the circular dependency by using simplified function types
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
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

  const value: AuthContextType = {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};