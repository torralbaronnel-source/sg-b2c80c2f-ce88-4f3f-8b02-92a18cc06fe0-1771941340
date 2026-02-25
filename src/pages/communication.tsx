import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <CommunicationDashboardView />
    </ProtectedRoute>
  );
}