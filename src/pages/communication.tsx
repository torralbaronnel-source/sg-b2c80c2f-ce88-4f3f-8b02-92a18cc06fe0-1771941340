import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const CommunicationDashboardView = dynamic(
  () => import("@/components/Communication/CommunicationDashboardView").then(mod => mod.CommunicationDashboardView),
  { 
    ssr: false,
    loading: () => (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <div className="flex h-[600px] gap-4">
          <Skeleton className="w-80 h-full" />
          <Skeleton className="flex-1 h-full" />
        </div>
      </div>
    )
  }
);

export default function CommunicationPage() {
  return <CommunicationDashboardView />;
}