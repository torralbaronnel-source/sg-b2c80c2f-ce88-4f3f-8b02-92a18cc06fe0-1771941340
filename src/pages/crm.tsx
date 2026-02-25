import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";
import { SEO } from "@/components/SEO";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <SEO title="CRM | Orchestrix" />
      <CRMDashboardView />
    </ProtectedRoute>
  );
}