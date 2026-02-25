import React from "react";
import { SEO } from "@/components/SEO";
import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <SEO title="CRM & Clients | Orchestrix" />
      <CRMDashboardView />
    </ProtectedRoute>
  );
}