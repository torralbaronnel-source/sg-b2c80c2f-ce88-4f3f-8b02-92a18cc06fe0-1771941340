import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const EventsDashboardView = dynamic(
  () => import("@/components/Events/EventsDashboardView").then(mod => mod.EventsDashboardView),
  { 
    ssr: false,
    loading: () => (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }
);

export default function EventsPage() {
  return <EventsDashboardView />;
}