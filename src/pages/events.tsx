import { AppLayout } from "@/components/Layout/AppLayout";
import { EventsDashboardView } from "@/components/Events/EventsDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Events Dashboard | Orchestrix" description="Manage and monitor all your scheduled events." />
        <div className="p-4 md:p-6">
          <EventsDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}