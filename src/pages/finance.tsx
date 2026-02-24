import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <FinanceDashboardView />
    </ProtectedRoute>
  );
}