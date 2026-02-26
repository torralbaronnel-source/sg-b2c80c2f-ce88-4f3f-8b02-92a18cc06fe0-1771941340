import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList, Clock, MapPin, Tag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ItinerariesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Itineraries | Orchestrix" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#6264a7]">Neural Itineraries</h1>
              <p className="text-muted-foreground mt-1">Synchronized event schedules and logistics nodes.</p>
            </div>
            <Button className="bg-[#6264a7] hover:bg-[#6264a7]/90">
              <Plus className="h-4 w-4 mr-2" />
              New Itinerary Node
            </Button>
          </div>

          <div className="grid gap-6">
            <Card className="border-[#6264a7]/10 bg-gradient-to-br from-white to-[#6264a7]/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#6264a7]/10 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-[#6264a7]" />
                    </div>
                    <div>
                      <CardTitle>Master Itinerary View</CardTitle>
                      <CardDescription>Visualizing event flow across all production nodes.</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold">No active itinerary nodes</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-2">
                    Create your first itinerary node to start synchronizing your event timing with the Data Fortress.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}