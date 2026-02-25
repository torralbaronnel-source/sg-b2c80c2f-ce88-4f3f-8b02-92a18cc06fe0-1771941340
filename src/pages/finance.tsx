import React from "react";
import { SEO } from "@/components/SEO";
import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <SEO title="Finance | Orchestrix" />
      <FinanceDashboardView />
    </ProtectedRoute>
  );
}