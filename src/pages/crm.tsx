import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="CRM | Orchestrix" />
        <CRMDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}