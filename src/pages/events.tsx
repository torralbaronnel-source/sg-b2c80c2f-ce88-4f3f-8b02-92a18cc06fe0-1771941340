import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EventsDashboardView } from "@/components/Events/EventsDashboardView";

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <EventsDashboardView />
    </ProtectedRoute>
  );
}