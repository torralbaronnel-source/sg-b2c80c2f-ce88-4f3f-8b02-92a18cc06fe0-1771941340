import React from "react";
import { LiveEventDashboard } from "@/components/Events/LiveEventDashboard";
import { useRouter } from "next/router";

export default function LiveEventPage() {
  const router = useRouter();
  const { id } = router.query;
  
  return <LiveEventDashboard eventId={id as string} />;
}