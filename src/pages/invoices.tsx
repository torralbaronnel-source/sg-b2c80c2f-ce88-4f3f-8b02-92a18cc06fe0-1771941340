import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import FinanceDashboardView from "@/components/Finance/FinanceDashboardView";

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <SEO title="Invoices | Orchestrix" />
      <div className="p-4 md:p-6">
        <FinanceDashboardView />
      </div>
    </ProtectedRoute>
  );
}