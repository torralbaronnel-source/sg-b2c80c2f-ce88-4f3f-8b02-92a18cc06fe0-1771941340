import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && router.pathname !== "/login" && router.pathname !== "/signup") {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6264a7] border-t-transparent" />
      </div>
    );
  }

  // Allow login and signup pages to render without redirecting to login
  if (!user && (router.pathname === "/login" || router.pathname === "/signup")) {
    return <>{children}</>;
  }

  if (!user) return null;

  return <>{children}</>;
}