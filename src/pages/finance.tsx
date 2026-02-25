import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Finance | Orchestrix" />
        <FinanceDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}