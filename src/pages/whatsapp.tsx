import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WhatsAppManagerView } from "@/components/WhatsApp/WhatsAppManagerView";

const WhatsAppPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-100 flex h-screen overflow-hidden">
        <WhatsAppManagerView coordinatorId="1" />
      </div>
    </ProtectedRoute>
  );
};

export default WhatsAppPage;