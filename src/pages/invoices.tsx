import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Invoices | Orchestrix" />
        <FinanceDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}