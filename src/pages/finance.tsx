import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import FinanceDashboardView from "@/components/Finance/FinanceDashboardView";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <SEO title="Finance Dashboard | Orchestrix" description="Track invoices, quotes, and event budgets." />
      <div className="p-4 md:p-6">
        <FinanceDashboardView />
      </div>
    </ProtectedRoute>
  );
}