import { useRouter } from "next/router";
import { AppLayout } from "@/components/Layout/AppLayout";
import { LiveEventDashboard } from "@/components/Events/LiveEventDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO 
          title={id ? `Event ${id} | Orchestrix` : "Event Details | Orchestrix"} 
          description="Real-time event monitoring and production control." 
        />
        <div className="p-4 md:p-6">
          {!id ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <LiveEventDashboard eventId={id as string} />
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}