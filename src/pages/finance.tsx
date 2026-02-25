import { AppLayout } from "@/components/Layout/AppLayout";
import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Finance Dashboard | Orchestrix" description="Track invoices, quotes, and event budgets." />
        <div className="p-4 md:p-6">
          <FinanceDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}