import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Briefcase, Map } from "lucide-react";

export function EventsDashboardView() {
  const stats = [
    { title: "Active Events", value: "12", icon: Calendar, color: "text-blue-600" },
    { title: "Total Guests", value: "1,240", icon: Users, color: "text-green-600" },
    { title: "Confirmed Vendors", value: "48", icon: Briefcase, color: "text-purple-600" },
    { title: "Floor Plans", value: "8", icon: Map, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Event Management</h1>
        <p className="text-slate-500 text-sm">Coordinate production, timelines, and logistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">No immediate deadlines for the active event.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Production Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">View recent changes to timelines and vendor statuses.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}