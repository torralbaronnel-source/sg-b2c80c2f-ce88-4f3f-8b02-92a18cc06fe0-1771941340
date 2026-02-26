import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const CRMDashboardView = dynamic(
  () => import("@/components/CRM/CRMDashboardView").then(mod => mod.CRMDashboardView),
  { 
    ssr: false,
    loading: () => (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[600px] col-span-2" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    )
  }
);

export default function CRMPage() {
  return <CRMDashboardView />;
}