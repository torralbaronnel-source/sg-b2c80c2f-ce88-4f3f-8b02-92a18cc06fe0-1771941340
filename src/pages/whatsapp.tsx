import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsAppManagerView } from "@/components/WhatsApp/WhatsAppManagerView";
import { WhatsAppTabletView } from "@/components/WhatsApp/WhatsAppTabletView";
import { Bot, Tablet } from "lucide-react";

export default function WhatsAppPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Communication Hub | Orchestrix" />
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Communication Hub</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage client, vendor, and team messages in one place.</p>
          </div>

          <Tabs defaultValue="manager" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manager" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Manager View
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center gap-2">
                <Tablet className="w-4 h-4" />
                Tablet View
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manager" className="space-y-4">
              <WhatsAppManagerView />
            </TabsContent>
            <TabsContent value="tablet" className="space-y-4">
              <WhatsAppTabletView />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}