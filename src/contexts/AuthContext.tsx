import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Role = Database["public"]["Tables"]["roles"]["Row"];

interface AuthContextType {
  user: User | null;
  profile: any | null;
  role: Role | null;
  isLoading: boolean;
  currentServer: { id: string; name: string } | null;
  setCurrentServer: (server: { id: string; name: string } | null) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [currentServer, setCurrentServerState] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileAndRole = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          *,
          current_server:servers!profiles_current_server_id_fkey (id, name),
          roles (*)
        `)
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);
      setRole(profileData?.roles || null);
      
      if (profileData?.current_server) {
        setCurrentServerState({
          id: profileData.current_server.id,
          name: profileData.current_server.name
        });
      }
    } catch (error) {
      console.error("AuthContext: Fetch failed", error);
    }
  }, []);

  const setCurrentServer = (server: { id: string; name: string } | null) => {
    setCurrentServerState(server);
  };

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfileAndRole(user.id);
  }, [user, fetchProfileAndRole]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfileAndRole(session.user.id);
        }
      } catch (error) {
        console.error("AuthContext: Initialization failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndRole(session.user.id);
      } else {
        setProfile(null);
        setRole(null);
        setCurrentServerState(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfileAndRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        currentServer,
        setCurrentServer,
        refreshProfile,
        signOut,
      }}
    >
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