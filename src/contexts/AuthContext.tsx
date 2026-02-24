import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, type AuthUser } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { useRouter } from "next/router";

interface AuthContextType {
  user: AuthUser | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  organizations: any[];
  currentOrganization: any | null;
  setCurrentOrganization: (org: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<any | null>(null);
  const router = useRouter();

  const fetchUserData = async (userId: string) => {
    try {
      // profileService.getProfile returns { data, error }
      const { data: profileData } = await profileService.getProfile(userId);
      setProfile(profileData || null);

      const { data: orgData } = await authService.getUserOrganizations(userId);
      const orgs = orgData || [];
      setOrganizations(orgs);
      
      if (orgs.length > 0 && !currentOrganization) {
        setCurrentOrganization(orgs[0].organizations);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          if (currentUser) {
            await fetchUserData(currentUser.id);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const subscription = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          await fetchUserData(currentUser.id);
        }
      } else {
        setUser(null);
        setProfile(null);
        setOrganizations([]);
        setCurrentOrganization(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await authService.signOut();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signOut, 
      organizations, 
      currentOrganization, 
      setCurrentOrganization 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};