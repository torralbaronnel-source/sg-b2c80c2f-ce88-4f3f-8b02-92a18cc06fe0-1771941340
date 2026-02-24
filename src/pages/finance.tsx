import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <SEO title="Finance | Orchestrix" />
      <FinanceDashboardView />
    </ProtectedRoute>
  );
}