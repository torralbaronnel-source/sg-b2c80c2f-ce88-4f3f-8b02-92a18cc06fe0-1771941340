import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <CommunicationDashboardView />
    </ProtectedRoute>
  );
}