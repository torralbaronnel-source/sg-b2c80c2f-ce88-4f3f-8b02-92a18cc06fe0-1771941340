import { AppLayout } from "@/components/Layout/AppLayout";
import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="CRM | Orchestrix" description="Manage clients, leads, and event relationships." />
        <div className="p-4 md:p-6">
          <CRMDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}