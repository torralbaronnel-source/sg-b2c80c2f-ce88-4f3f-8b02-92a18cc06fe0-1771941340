import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";
import type { AuthUser } from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  profile: any | null;
  loading: boolean;
  activeOrg: any | null;
  setActiveOrg: (org: any) => void;
  organizations: any[];
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [activeOrg, setActiveOrg] = useState<any | null>(null);

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
    setOrganizations([]);
    setActiveOrg(null);
  };

  const fetchProfileAndOrgs = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      setProfile(profileData);

      const orgs = await authService.getUserOrganizations();
      setOrganizations(orgs || []);
      
      // Default to first org if available and none selected
      if (orgs && orgs.length > 0 && !activeOrg) {
        setActiveOrg(orgs[0].organizations);
      }
    } catch (error) {
      console.error("Error fetching auth data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          await fetchProfileAndOrgs(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        await fetchProfileAndOrgs(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setOrganizations([]);
        setActiveOrg(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, activeOrg, setActiveOrg, organizations, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};