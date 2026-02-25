import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, requiredPermission }: { children: React.ReactNode, requiredPermission?: string }) {
  const { user, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    
    if (!isLoading && user && role && requiredPermission) {
      const r = role as any;
      if (r.hierarchy_level !== 0) {
        const perms = r.permissions || {};
        if (perms[requiredPermission]?.view === false) {
          router.push("/");
        }
      }
    }
  }, [user, isLoading, role, router, requiredPermission]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDFCFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground">Orchestrix is loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}