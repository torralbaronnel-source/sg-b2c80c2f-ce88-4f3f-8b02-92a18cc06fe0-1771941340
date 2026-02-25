import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { profileService, type Profile } from "@/services/profileService";
import { serverService } from "@/services/serverService";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  currentServer: any | null;
  currentOrganization: any | null; // Alias for backward compatibility
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  selectServer: (serverId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentServer, setCurrentServer] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch server metadata
  const refreshServerContext = async () => {
    try {
      const activeServer = await serverService.getSelectedServer();
      console.log("AuthContext: Active server fetched:", activeServer?.name);
      setCurrentServer(activeServer);
      return activeServer;
    } catch (err) {
      console.error("AuthContext: Failed to refresh server context", err);
      return null;
    }
  };

  const fetchProfileData = async (userId: string) => {
    try {
      const profileData = await profileService.getProfile(userId);
      setProfile(profileData);
      await refreshServerContext();
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectServer = async (serverId: string) => {
    console.log("AuthContext: Selecting server:", serverId);
    localStorage.setItem("selectedServerId", serverId);
    
    // Sync with database for RLS consistency
    if (user) {
      await supabase
        .from("profiles")
        .update({ current_server_id: serverId })
        .eq("id", user.id);
    }

    const server = await refreshServerContext();
    if (server) {
      // Force a slight delay or state update to ensure components re-render
      setCurrentServer({ ...server });
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
        setCurrentServer(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    profile,
    currentServer,
    currentOrganization: currentServer,
    isLoading,
    refreshProfile: async () => {
      if (user) await fetchProfileData(user.id);
    },
    selectServer,
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