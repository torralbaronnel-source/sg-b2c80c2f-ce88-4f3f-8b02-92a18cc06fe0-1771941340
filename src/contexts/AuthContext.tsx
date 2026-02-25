import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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
  selectServer: (serverId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentServer, setCurrentServer] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshServerContext = useCallback(async () => {
    try {
      const activeServer = await serverService.getSelectedServer();
      console.log("AuthContext: Active server fetched:", activeServer?.name);
      setCurrentServer(activeServer);
      return activeServer;
    } catch (err) {
      console.error("AuthContext: Failed to refresh server context", err);
      return null;
    }
  }, []);

  const fetchProfileData = useCallback(async (userId: string) => {
    try {
      const profileData = await profileService.getProfile(userId);
      setProfile(profileData);
      
      // If profile has a current_server_id, prioritize it
      if (profileData?.current_server_id) {
        localStorage.setItem("selectedServerId", profileData.current_server_id);
      }
      
      await refreshServerContext();
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }, [refreshServerContext]);

  const selectServer = async (serverId: string) => {
    console.log("AuthContext: Selecting server:", serverId);
    localStorage.setItem("selectedServerId", serverId);
    
    if (user) {
      await supabase
        .from("profiles")
        .update({ current_server_id: serverId })
        .eq("id", user.id);
    }

    const server = await refreshServerContext();
    if (server) {
      setCurrentServer({ ...server });
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfileData(session.user.id);
      } else {
        // Even if not logged in, try to load server from localstorage for public views if needed
        await refreshServerContext();
      }
      setIsLoading(false);
    };

    initAuth();

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
  }, [fetchProfileData, refreshServerContext]);

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