import { MobileCheckInView } from "@/components/Events/MobileCheckInView";
import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor } from "lucide-react";

export default function GuestsPage() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("mobile");

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-2xl font-bold">Guest Management</h1>
          <div className="flex bg-muted p-1 rounded-lg">
            <Button 
              variant={viewMode === "desktop" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("desktop")}
              className="gap-2"
            >
              <Monitor className="h-4 w-4" />
              Desktop Admin
            </Button>
            <Button 
              variant={viewMode === "mobile" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("mobile")}
              className="gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Mobile Check-In
            </Button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-muted/30">
          {viewMode === "mobile" ? (
            <div className="mx-auto max-w-[450px] h-full shadow-2xl relative">
              <MobileCheckInView />
            </div>
          ) : (
            <div className="p-8">
              {/* Desktop View Placeholder */}
              <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground border-2 border-dashed rounded-xl">
                <Monitor className="h-12 w-12 mb-4 opacity-20" />
                <p>Desktop Guest Management Dashboard</p>
                <p className="text-sm">Comprehensive list, analytics, and table assignments will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}