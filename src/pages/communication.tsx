import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <SEO title="Communication | Orchestrix" />
      <CommunicationDashboardView />
    </ProtectedRoute>
  );
}