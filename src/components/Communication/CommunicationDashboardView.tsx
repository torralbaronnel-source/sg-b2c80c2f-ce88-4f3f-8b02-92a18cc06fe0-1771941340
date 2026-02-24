import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Slack, Smartphone } from "lucide-react";
import { WhatsAppManagerView } from "@/components/WhatsApp/WhatsAppManagerView";
import { WhatsAppTabletView } from "@/components/WhatsApp/WhatsAppTabletView";

export function CommunicationDashboardView() {
  const [viewMode, setViewMode] = useState<"manager" | "tablet">("manager");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Communication Hub</h1>
          <p className="text-slate-500 text-sm">Unify WhatsApp, Slack, and Email into one command center.</p>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode("manager")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === "manager" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Manager View
          </button>
          <button 
            onClick={() => setViewMode("tablet")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === "tablet" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Tablet View
          </button>
        </div>
      </div>

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1">
          <TabsTrigger value="whatsapp" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="slack" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
            <Slack className="h-4 w-4 mr-2" />
            Slack
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="mt-6">
          {viewMode === "manager" ? (
            <WhatsAppManagerView />
          ) : (
            <WhatsAppTabletView />
          )}
        </TabsContent>

        <TabsContent value="slack" className="mt-6">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-12 text-center">
              <Slack className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">Slack Integration</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">
                Connect your internal production team Slack to coordinate tasks and emergency updates in real-time.
              </p>
              <button className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">
                Connect Slack
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-12 text-center">
              <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">Email Hub</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">
                Sync your Gmail or Outlook to manage client inquiries and vendor contracts directly from Orchestrix.
              </p>
              <button className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">
                Connect Email Provider
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}