import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="CRM & Clients | Orchestrix" />
        <CRMDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}