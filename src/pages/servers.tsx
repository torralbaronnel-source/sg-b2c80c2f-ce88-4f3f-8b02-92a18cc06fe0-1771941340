import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, Globe, Shield, Zap, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { serverService } from "@/services/serverService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ServersPage() {
  const { currentServer, setCurrentServer } = useAuth();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingServer, setLoadingServer] = useState<string | null>(null);
  const { toast } = useToast();

  // Create Server State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newServerName, setNewServerName] = useState("");
  const [newServerRegion, setNewServerRegion] = useState("Global");

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const response = await serverService.getMyServers();
      setServers(response.servers || []);
    } catch (error) {
      console.error("Failed to load servers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectServer = async (server: any) => {
    if (currentServer?.id === server.id) return;
    
    setLoadingServer(server.id);
    
    // Optimistic Update
    setCurrentServer({ id: server.id, name: server.name });
    
    try {
      // Re-using setServerSelection logic from context/service
      await serverService.setSelectedServer(server.id);
      toast({
        title: "Node Switched",
        description: `Connected to ${server.name} production node.`,
      });
    } catch (error) {
      toast({
        title: "Switch Failed",
        description: "Could not establish connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingServer(null);
    }
  };

  const handleCreateServer = async () => {
    if (!newServerName.trim()) return;
    try {
      // Use the complex deployer for a complete node setup
      const server = await serverService.deployComplexServer({
        name: newServerName,
        industry: "Event Production",
        blueprint: {
          modules: {
            crm: true,
            events: true,
            finance: true,
            communication: true,
            whatsapp: false
          },
          rules: {
            autoArchive: false,
            requireContract: true,
            enableRealtime: true,
            strictBudgeting: false
          }
        }
      });
      
      setServers(prev => [...prev, server]);
      setIsCreateOpen(false);
      setNewServerName("");
      toast({ title: "Node Provisioned", description: `${newServerName} is now online.` });
    } catch (error) {
      toast({ title: "Provisioning Failed", variant: "destructive" });
    }
  };

  return (
    <ProtectedRoute>
      <SEO title="Mission Control | Orchestrix" />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mission Control</h1>
            <p className="text-muted-foreground mt-1">Manage your active production nodes and global infrastructure.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white gap-2">
                <Plus className="h-4 w-4" />
                Provision New Node
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deploy New Production Node</DialogTitle>
                <DialogDescription>
                  Provision a new dedicated node for your events and coordination.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Node Name</Label>
                  <Input 
                    placeholder="e.g. Manila Production Hub" 
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input 
                    placeholder="e.g. South East Asia" 
                    value={newServerRegion}
                    onChange={(e) => setNewServerRegion(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateServer}>Deploy Node</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse bg-gray-50 h-[200px]" />
            ))
          ) : (
            servers.map((server) => {
              const isActive = currentServer?.id === server.id;
              return (
                <Card 
                  key={server.id} 
                  className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2 ${
                    isActive ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                        <Server className="h-5 w-5" />
                      </div>
                      <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-primary" : ""}>
                        {isActive ? "Active Node" : "Available"}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl">{server.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      {server.region || "Global"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5" />
                        SECURE
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5" />
                        99.9%
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      onClick={() => handleSelectServer(server)}
                      disabled={isActive || loadingServer === server.id}
                      variant={isActive ? "outline" : "default"}
                      className="w-full transition-all group-hover:gap-3"
                    >
                      {loadingServer === server.id ? "Connecting..." : isActive ? "Connected" : "Switch to Node"}
                      {!isActive && <ChevronRight className="h-4 w-4 transition-all group-hover:translate-x-1" />}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}