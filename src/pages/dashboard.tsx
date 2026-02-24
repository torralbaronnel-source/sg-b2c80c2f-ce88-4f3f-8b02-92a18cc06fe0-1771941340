import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SEO title="Dashboard | Orchestrix" />
      <OverviewDashboardView />
    </ProtectedRoute>
  );
}