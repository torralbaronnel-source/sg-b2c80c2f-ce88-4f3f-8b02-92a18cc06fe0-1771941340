import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <SEO title="CRM & Clients | Orchestrix" />
      <CRMDashboardView />
    </ProtectedRoute>
  );
}