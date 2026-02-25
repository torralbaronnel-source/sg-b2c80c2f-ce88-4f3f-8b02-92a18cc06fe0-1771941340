import { AppLayout } from "@/components/Layout/AppLayout";
import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";
import { SEO } from "@/components/SEO";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SEO title="Dashboard | Orchestrix" />
      <AppLayout>
        <OverviewDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}