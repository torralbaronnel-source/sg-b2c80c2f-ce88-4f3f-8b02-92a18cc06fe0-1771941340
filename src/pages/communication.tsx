import React from "react";
import Head from "next/head";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Communication Hub | Orchestrix</title>
      </Head>
      {/* 
        AppLayout is already applied globally in _app.tsx.
        Removing the duplicate AppLayout here to fix the double layout issue.
      */}
      <main className="h-[calc(100vh-64px)] w-full overflow-hidden">
        <CommunicationDashboardView />
      </main>
    </ProtectedRoute>
  );
}