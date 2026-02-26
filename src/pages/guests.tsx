import { AppLayout } from "@/components/Layout/AppLayout";
import { MobileCheckInView } from "@/components/Events/MobileCheckInView";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Users } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function GuestsPage() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("mobile");

  return (
    <AppLayout>
      <SEO title="Guest Management | Orchestrix" />
      <div className="flex flex-col h-full bg-background">
        {/* Page Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Guest Management</h1>
          </div>
          
          <div className="flex bg-muted p-1 rounded-md">
            <Button 
              variant={viewMode === "mobile" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("mobile")}
              className="h-8 gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </Button>
            <Button 
              variant={viewMode === "desktop" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("desktop")}
              className="h-8 gap-2"
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </Button>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === "mobile" ? (
            <div className="h-full max-w-md mx-auto border-x bg-card shadow-sm">
              <MobileCheckInView />
            </div>
          ) : (
            <div className="p-8 h-full flex items-center justify-center text-center">
              <div className="max-w-md space-y-4">
                <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                  <Monitor className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold">Desktop Dashboard In Development</h2>
                <p className="text-muted-foreground">
                  The full administrative view for guest manifest management, table exports, and analytics is coming soon.
                </p>
                <Button variant="outline" onClick={() => setViewMode("mobile")}>
                  Return to Mobile Check-In
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}