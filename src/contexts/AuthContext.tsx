import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { profileService, type Profile } from "@/services/profileService";
import { serverService } from "@/services/serverService";
import { useRouter } from "next/navigation";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  currentOrganization: any | null;
  currentServer: any | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<any | null>(null);
  const [currentServer, setCurrentServer] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileData = async (userId: string) => {
    const profileData = await profileService.getProfile(userId);
    setProfile(profileData);
    if (profileData) {
      const [org, server] = await Promise.all([
        profileService.getUserOrganization(userId),
        serverService.getSelectedServer()
      ]);
      setCurrentOrganization(org);
      setCurrentServer(server);
    }
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileData(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        await fetchProfileData(session.user.id);
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

  const value: AuthContextType = {
    user,
    session,
    profile,
    currentOrganization,
    currentServer,
    isLoading,
    refreshProfile: async () => {
      if (user) await fetchProfileData(user.id);
    },
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