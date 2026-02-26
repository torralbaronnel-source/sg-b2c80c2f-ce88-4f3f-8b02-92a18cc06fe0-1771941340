import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user, isLoading, role } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // ONLY redirect if there is NO user. 
      // Do not redirect on other errors.
      if (!user) {
        console.log("No user session found, redirecting to login...");
        router.push("/login");
        return;
      }

      if (requiredPermission && role) {
        const r = role as any;
        if (r.hierarchy_level !== 0) {
          const perms = r.permissions || {};
          if (perms[requiredPermission]?.view === false) {
            router.push("/");
            return;
          }
        }
      }
      
      setIsAuthorized(true);
    }
  }, [user, isLoading, role, router, requiredPermission]);

  if (isLoading || (!isAuthorized && user)) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <div className="flex flex-col items-center text-center">
            <p className="text-base font-bold text-slate-900">Synchronizing Orchestrix</p>
            <p className="text-xs text-slate-500">Securing your session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}