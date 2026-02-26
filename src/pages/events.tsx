import React from "react";
import dynamic from "next/dynamic";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";

// Optimization: Dynamic import for large Events module
const EventsDashboardView = dynamic(
  () => import("@/components/Events/EventsDashboardView").then(mod => mod.EventsDashboardView),
  { 
    loading: () => (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500/20" />
      </div>
    ),
    ssr: false 
  }
);

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <SEO title="Events | Orchestrix" description="Event management and scheduling." />
      <div className="p-4 md:p-6">
        <EventsDashboardView />
      </div>
    </ProtectedRoute>
  );
}