import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function GuestsPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Guest Lists</h1>
        <p className="text-muted-foreground">RSVP tracking and seating assignments.</p>
      </div>
    </ProtectedRoute>
  );
}