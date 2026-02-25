import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function LeadsPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Leads & Pipeline</h1>
        <p className="text-muted-foreground">Manage inquiries and sales funnel.</p>
      </div>
    </ProtectedRoute>
  );
}