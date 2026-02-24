import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <CRMDashboardView />
    </ProtectedRoute>
  );
}