import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <FinanceDashboardView />
    </ProtectedRoute>
  );
}