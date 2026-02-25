import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <CRMDashboardView />
    </ProtectedRoute>
  );
}