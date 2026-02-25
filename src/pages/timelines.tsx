import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function TimelinesPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Event Timelines</h1>
        <p className="text-muted-foreground">Master schedule and production run sheets.</p>
      </div>
    </ProtectedRoute>
  );
}