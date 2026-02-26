import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles && profile && !allowedRoles.includes(profile.role || "")) {
        // If user is logged in but doesn't have the required role, redirect to dashboard
        router.push("/dashboard");
      }
    }
  }, [user, profile, isLoading, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if user is logged in and has the required role (if specified)
  if (!user || (allowedRoles && profile && !allowedRoles.includes(profile.role || ""))) {
    return null;
  }

  return <>{children}</>;
}