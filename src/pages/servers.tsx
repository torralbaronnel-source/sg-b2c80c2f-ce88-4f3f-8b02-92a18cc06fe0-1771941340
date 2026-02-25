import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Terminal,
  Cpu,
  BrainCircuit,
  MoreVertical,
  Wrench,
  Filter,
  LayoutGrid,
  List
} from "lucide-react";
import { serverService, ServerBlueprint } from "@/services/serverService";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

const PAGE_SIZE = 6;

interface Server {
  id: string;
  name: string;
  userRole: string;
  created_at: string;
  server_handle: string;
  industry?: string;
  blueprint?: ServerBlueprint;
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ServersPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "portal_admin" | "member">("all");
  const [sortBy, setSortBy] = useState<"name" | "newest">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [isBlueprintDialogOpen, setIsBlueprintDialogOpen] = useState(false);
  const [editBlueprint, setEditBlueprint] = useState<ServerBlueprint | null>(null);

  const [inviteCode, setInviteCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const loadServers = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const result = await serverService.getMyServers(page, PAGE_SIZE);
      setServers(result.servers);
      setTotalCount(result.totalCount);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Connection Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadServers(currentPage);
  }, [currentPage, loadServers]);

  const handleUpdateBlueprint = async () => {
    if (!editingServer || !editBlueprint) return;
    setActionLoading(true);
    try {
      await serverService.updateServerBlueprint(editingServer.id, editBlueprint);
      toast({ title: "Blueprint Updated", description: "Infrastructure modifications synchronized." });
      setIsBlueprintDialogOpen(false);
      loadServers(currentPage);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const openBlueprintDialog = (server: Server) => {
    setEditingServer(server);
    setEditBlueprint(server.blueprint || {
      modules: { crm: false, finance: false, communication: false, whatsapp: false, events: false },
      rules: { autoArchive: false, requireContract: false, enableRealtime: false, strictBudgeting: false }
    });
    setIsBlueprintDialogOpen(true);
  };

  const handleJoinServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.length !== 18) {
      toast({ variant: "destructive", title: "Invalid Code", description: "Server IDs must be exactly 18 characters." });
      return;
    }
    setActionLoading(true);
    try {
      await serverService.joinServer(inviteCode);
      toast({ title: "Access Granted", description: "Connected to remote server." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Access Denied", description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const selectServer = async (serverId: string) => {
    try {
      await serverService.selectServer(serverId);
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Session Error", description: error.message });
    }
  };

  const filteredServers = servers
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || s.userRole === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 md:p-12 font-sans">
      <SEO title="Mission Control | Orchestrix" />
      
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-8">
          <div className="space-y-4">
            <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-[#D4AF37] flex items-center gap-1 transition-colors group">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-5xl font-light tracking-tight text-neutral-900 mb-2">Fleet Management</h1>
              <p className="text-neutral-500 text-lg font-light italic">Secure production environments for Orchestrix nodes.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder="Search fleet..." 
                className="pl-10 w-full md:w-[250px] bg-white border-neutral-200 focus:ring-[#D4AF37]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-neutral-200 rounded-full">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Governance</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Clusters</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("portal_admin")}>Root Access Only</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("member")}>Guest Nodes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-full w-8 h-8", viewMode === "grid" && "bg-white shadow-sm")}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-full w-8 h-8", viewMode === "list" && "bg-white shadow-sm")}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-neutral-800">Operational Nodes</h2>
              <Badge variant="outline" className="rounded-full border-neutral-200 text-neutral-400 font-normal">
                {totalCount} Active
              </Badge>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-56 rounded-3xl bg-neutral-50 border border-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : filteredServers.length > 0 ? (
              <>
                <div className={cn(
                  "gap-6",
                  viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
                )}>
                  {filteredServers.map((server) => (
                    <Card 
                      key={server.id} 
                      className="group border-neutral-200/60 hover:border-[#D4AF37] transition-all bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl"
                    >
                      <CardHeader className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 group-hover:bg-[#D4AF37]/5 transition-colors">
                            <Cpu className="w-6 h-6 text-[#D4AF37]" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              "rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.1em] font-medium",
                              server.userRole === "portal_admin" 
                                ? "bg-black text-white" 
                                : "bg-neutral-100 text-neutral-500"
                            )}>
                              {server.userRole === "portal_admin" ? "Root Access" : "Guest Node"}
                            </Badge>
                            
                            {server.userRole === "portal_admin" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openBlueprintDialog(server)} className="gap-2">
                                    <Wrench className="w-4 h-4" /> Manage Blueprint
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-2xl font-light group-hover:text-[#D4AF37] transition-colors mb-2">
                          {server.name}
                        </CardTitle>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest">{server.id.substring(0, 8)}...</span>
                          {server.industry && (
                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none text-[10px] px-2">
                              {server.industry}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="px-8 pb-8 flex items-center justify-between border-t border-neutral-50 pt-6">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-neutral-200" />
                          ))}
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-[8px] text-neutral-400">+12</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => selectServer(server.id)}
                          className="flex items-center gap-2 text-[#D4AF37] font-medium text-sm hover:text-[#B8962E] hover:bg-transparent p-0"
                        >
                          Initialize <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-12">
                    <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-sm font-medium text-neutral-400 mx-4">Page {currentPage} of {totalPages}</span>
                    <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-neutral-200">
                <BrainCircuit className="w-16 h-16 text-neutral-100 mx-auto mb-6" />
                <h3 className="text-xl font-light text-neutral-900">No active nodes detected</h3>
                <p className="text-neutral-400 max-w-xs mx-auto mt-2 italic font-light">
                  Search parameters returned null results. Initialize new infrastructure.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <Card className="rounded-[40px] border-none shadow-2xl shadow-[#D4AF37]/10 bg-white overflow-hidden p-8">
              <div className="space-y-6">
                <div className="p-4 bg-[#D4AF37]/5 rounded-3xl inline-flex">
                  <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-2xl font-light text-neutral-900">Deploy New Node</h3>
                  <p className="text-neutral-500 text-sm mt-2 italic">Scale your agency infrastructure with developer-grade blueprinting.</p>
                </div>
                <Button 
                  asChild
                  className="w-full h-14 bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-2xl text-lg font-light tracking-wide shadow-lg shadow-[#D4AF37]/20"
                >
                  <Link href="/admin">Go to System & Dev</Link>
                </Button>
              </div>
            </Card>

            <Card className="rounded-[40px] border-none bg-neutral-900 text-white p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-light">Remote Link</h3>
                </div>
                <p className="text-neutral-500 text-sm">Establish a secure connection to an existing node cluster.</p>
                <form onSubmit={handleJoinServer} className="space-y-4">
                  <Input 
                    placeholder="18-character hash" 
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                    maxLength={18}
                    className="h-12 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600 focus:ring-[#D4AF37] font-mono tracking-widest text-center rounded-xl"
                  />
                  <Button 
                    type="submit" 
                    variant="secondary"
                    className="w-full h-12 bg-white text-neutral-900 hover:bg-neutral-100 rounded-xl font-medium"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Establishing..." : "Connect Node"}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Blueprint Management Dialog */}
      <Dialog open={isBlueprintDialogOpen} onOpenChange={setIsBlueprintDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#FDFCFB] border-neutral-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-neutral-900">Blueprint Configuration</DialogTitle>
            <DialogDescription className="text-neutral-500 font-light italic">
              Adjusting operational modules for node <span className="font-mono text-[#D4AF37]">{editingServer?.id.substring(0, 8)}</span>
            </DialogDescription>
          </DialogHeader>

          {editBlueprint && (
            <div className="space-y-8 py-6">
              <div className="space-y-4">
                <Label className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Module Stack</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(editBlueprint.modules).map((module) => (
                    <div key={module} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100">
                      <Label htmlFor={`module-${module}`} className="capitalize text-neutral-700">{module}</Label>
                      <Switch 
                        id={`module-${module}`}
                        checked={(editBlueprint.modules as any)[module]}
                        onCheckedChange={(checked) => {
                          setEditBlueprint({
                            ...editBlueprint,
                            modules: { ...editBlueprint.modules, [module]: checked }
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Operational Rules</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(editBlueprint.rules).map((rule) => (
                    <div key={rule} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100">
                      <Label htmlFor={`rule-${rule}`} className="capitalize text-neutral-700">{rule.replace(/([A-Z])/g, ' $1')}</Label>
                      <Switch 
                        id={`rule-${rule}`}
                        checked={(editBlueprint.rules as any)[rule]}
                        onCheckedChange={(checked) => {
                          setEditBlueprint({
                            ...editBlueprint,
                            rules: { ...editBlueprint.rules, [rule]: checked }
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-neutral-100 pt-6">
            <Button variant="ghost" onClick={() => setIsBlueprintDialogOpen(false)} className="rounded-xl text-neutral-400 font-light hover:bg-neutral-50">
              Discard Changes
            </Button>
            <Button 
              onClick={handleUpdateBlueprint}
              className="bg-neutral-900 text-white rounded-xl px-8 hover:bg-black"
              disabled={actionLoading}
            >
              {actionLoading ? "Synchronizing..." : "Apply Blueprint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}