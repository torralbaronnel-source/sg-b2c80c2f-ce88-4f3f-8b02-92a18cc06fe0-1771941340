import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList, Calendar, MapPin, Users } from "lucide-react";

export function ItinerariesDashboardView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Itineraries</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Neural Logistics Sequencing</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Active Plans", value: "8", icon: ClipboardList, color: "text-blue-500" },
          { title: "Today's Events", value: "3", icon: Calendar, color: "text-[#6264a7]" },
          { title: "Venues", value: "12", icon: MapPin, color: "text-amber-500" },
          { title: "Personnel", value: "45", icon: Users, color: "text-green-500" },
        ].map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-muted-foreground italic">
          <ClipboardList className="h-12 w-12 mb-4 opacity-20" />
          <p>Compiling Itinerary Streams...</p>
        </CardContent>
      </Card>
    </div>
  );
}