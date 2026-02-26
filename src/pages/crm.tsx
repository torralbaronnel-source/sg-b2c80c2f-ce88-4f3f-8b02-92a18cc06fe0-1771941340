import React from "react";
import dynamic from "next/dynamic";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";

// Optimization: Dynamic import for large CRM module
const CRMDashboardView = dynamic(
  () => import("@/components/CRM/CRMDashboardView").then(mod => mod.CRMDashboardView),
  { 
    loading: () => (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500/20" />
      </div>
    ),
    ssr: false 
  }
);

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <SEO title="CRM | Orchestrix" description="Manage clients, leads, and event relationships." />
      <div className="p-4 md:p-6">
        <CRMDashboardView />
      </div>
    </ProtectedRoute>
  );
}