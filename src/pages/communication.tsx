import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <SEO title="Communication | Orchestrix" description="Unified communication and concierge management." />
      <div className="p-4 md:p-6">
        <CommunicationDashboardView />
      </div>
    </ProtectedRoute>
  );
}