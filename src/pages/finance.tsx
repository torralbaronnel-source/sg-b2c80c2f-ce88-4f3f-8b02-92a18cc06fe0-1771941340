import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const FinanceDashboardView = dynamic(
  () => import("@/components/Finance/FinanceDashboardView").then(mod => mod.FinanceDashboardView),
  { 
    ssr: false,
    loading: () => (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }
);

export default function FinancePage() {
  return <FinanceDashboardView />;
}