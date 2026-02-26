import React from "react";
import dynamic from "next/dynamic";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";

// Optimization: Dynamic import for Production Hub
const ProductionHubView = dynamic(
  () => import("@/components/Production/ProductionHubView").then(mod => mod.ProductionHubView),
  { 
    loading: () => (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500/20" />
      </div>
    ),
    ssr: false 
  }
);

export default function ProductionPage() {
  return (
    <ProtectedRoute>
      <SEO title="Production Hub | Orchestrix" description="Strategic production workflows." />
      <div className="p-4 md:p-6">
        <ProductionHubView />
      </div>
    </ProtectedRoute>
  );
}