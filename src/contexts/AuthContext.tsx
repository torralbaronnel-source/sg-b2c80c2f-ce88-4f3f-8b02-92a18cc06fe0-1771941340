import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  currentServer: { id: string; name: string } | null;
  setCurrentServer: (server: { id: string; name: string } | null) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [currentServer, setCurrentServerState] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // Single joined query to get profile and current server details at once
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          current_server:servers!profiles_current_server_id_fkey (
            id,
            name,
            industry,
            blueprint
          )
        `)
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.warn("No profile found for user");
          return;
        }
        throw error;
      }

      setProfile(data);
      
      if (data?.current_server) {
        setCurrentServerState({
          id: data.current_server.id,
          name: data.current_server.name
        });
      }
    } catch (error) {
      console.error("AuthContext: Profile fetch failed", error);
    }
  }, []);

  const setCurrentServer = (server: { id: string; name: string } | null) => {
    setCurrentServerState(server);
  };

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setCurrentServerState(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, currentServer, setCurrentServer, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};