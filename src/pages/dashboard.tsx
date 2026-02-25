import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Dashboard | Orchestrix" />
        <OverviewDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}