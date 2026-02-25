import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";
import { SEO } from "@/components/SEO";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <SEO title="Finance | Orchestrix" />
      <FinanceDashboardView />
    </ProtectedRoute>
  );
}