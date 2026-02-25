import { PortalAdminView } from "@/components/Admin/PortalAdminView";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Portal Admin | Orchestrix" />
        <PortalAdminView />
      </AppLayout>
    </ProtectedRoute>
  );
}