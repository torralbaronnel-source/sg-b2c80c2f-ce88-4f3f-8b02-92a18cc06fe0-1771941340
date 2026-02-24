import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <OverviewDashboardView />
    </ProtectedRoute>
  );
}