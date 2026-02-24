import { EventsDashboardView } from "@/components/Events/EventsDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <SEO title="Events Hub | Orchestrix" />
      <EventsDashboardView />
    </ProtectedRoute>
  );
}