import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RunOfShowView } from "@/components/Events/RunOfShowView";
import { SEO } from "@/components/SEO";

export default function TimelinesPage() {
  return (
    <ProtectedRoute>
      <SEO title="Master Run of Show | Orchestrix" description="Live minute-by-minute event timeline." />
      <div className="p-4 md:p-8">
         <RunOfShowView />
      </div>
    </ProtectedRoute>
  );
}