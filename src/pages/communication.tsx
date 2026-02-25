import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Communication | Orchestrix" />
        <CommunicationDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}