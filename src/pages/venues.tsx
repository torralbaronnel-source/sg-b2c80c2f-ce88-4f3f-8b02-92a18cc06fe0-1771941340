import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function VenuesPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Venues</h1>
        <p className="text-muted-foreground">Venue directory and floor plan management.</p>
      </div>
    </ProtectedRoute>
  );
}