import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { WhatsAppManagerView } from "@/components/WhatsApp/WhatsAppManagerView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsAppTabletView } from "@/components/WhatsApp/WhatsAppTabletView";

export default function WhatsAppPage() {
  return (
    <AppLayout title="WhatsApp Hub">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Communication Hub</h1>
            <p className="text-muted-foreground mt-1">Manage all your WhatsApp communications in one place.</p>
          </div>
        </div>

        <Tabs defaultValue="manager" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2 mb-8">
            <TabsTrigger value="manager">Manager View</TabsTrigger>
            <TabsTrigger value="tablet">Tablet View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manager" className="border-none p-0">
            <WhatsAppManagerView />
          </TabsContent>
          
          <TabsContent value="tablet">
            <div className="max-w-md mx-auto">
              <WhatsAppTabletView />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}