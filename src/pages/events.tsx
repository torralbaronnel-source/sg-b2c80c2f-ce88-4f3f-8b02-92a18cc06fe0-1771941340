import { EventsDashboardView } from "@/components/Events/EventsDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <EventsDashboardView />
    </ProtectedRoute>
  );
}