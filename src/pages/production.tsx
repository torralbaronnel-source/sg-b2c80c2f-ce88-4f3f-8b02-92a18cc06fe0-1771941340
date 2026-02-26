import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ProductionHubView = dynamic(
  () => import("@/components/Production/ProductionHubView").then(mod => mod.ProductionHubView),
  { 
    ssr: false,
    loading: () => (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }
);

export default function ProductionPage() {
  return <ProductionHubView />;
}