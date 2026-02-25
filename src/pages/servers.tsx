import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Users, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Hash, 
  Filter,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings2,
  Box,
  Terminal,
  Cpu,
  BrainCircuit,
  Lock,
  CheckCircle2,
  MoreVertical,
  Wrench
} from "lucide-react";
import { serverService, ServerBlueprint } from "@/services/serverService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  
  // Deployment Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [newServerName, setNewServerName] = useState("");
  const [industry, setIndustry] = useState("");
  const [aiNotes, setAiNotes] = useState("");
  const [blueprint, setBlueprint] = useState<ServerBlueprint>({
    modules: { crm: true, finance: true, communication: true, whatsapp: false, events: true },
    rules: { autoArchive: false, requireContract: true, enableRealtime: true, strictBudgeting: false }
  });
  
  // Blueprint Management State
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [isBlueprintDialogOpen, setIsBlueprintDialogOpen] = useState(false);
  const [editBlueprint, setEditBlueprint] = useState<ServerBlueprint | null>(null);

  const [inviteCode, setInviteCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  
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

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!newServerName.trim()) {
          toast({ variant: "destructive", title: "Validation Error", description: "Node Designation is required." });
          return false;
        }
        if (!industry.trim()) {
          toast({ variant: "destructive", title: "Validation Error", description: "Industry Vertical is required." });
          return false;
        }
        if (!aiNotes.trim()) {
          toast({ variant: "destructive", title: "Validation Error", description: "Strategic Intent notes are required for AI optimization." });
          return false;
        }
        return true;
      case 2:
        const hasModule = Object.values(blueprint.modules).some(v => v === true);
        if (!hasModule) {
          toast({ variant: "destructive", title: "Validation Error", description: "At least one operational module must be enabled." });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
    }
  };

  const handleAiAnalyze = async () => {
    if (!aiNotes.trim() || !industry.trim()) {
      toast({ variant: "destructive", title: "Missing Context", description: "Please provide both an industry and strategic intent notes." });
      return;
    }
    setIsAiAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-server-blueprint', {
        body: { industry, notes: aiNotes }
      });

      if (error) throw error;

      if (data) {
        setBlueprint({
          modules: data.modules,
          rules: data.rules
        });
        
        setStep(2);
        toast({ 
          title: "AI Strategy Generated", 
          description: data.reasoning || "GPT-5.1 Nano has optimized your infrastructure blueprint." 
        });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "AI Analysis Failed", 
        description: "Could not connect to AI strategist. Using manual config." 
      });
      setStep(2);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleDeploy = async () => {
    if (!newServerName.trim()) return;
    setActionLoading(true);
    try {
      await serverService.deployComplexServer({
        name: newServerName,
        industry,
        blueprint: { ...blueprint, aiNotes }
      });
      toast({ title: "Infrastructure Deployed", description: "Your custom production environment is live." });
      setIsWizardOpen(false);
      loadServers(1);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Deployment Failed", description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

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

  const handleSelectServer = (serverId: string) => {
    selectServer(serverId);
    toast({
      title: "Environment Switched",
      description: "Re-routing to production node...",
    });
    // Optional: redirect to dashboard to see changes
    router.push("/dashboard");
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
                                  <DropdownMenuItem onClick={() => handleSelectServer(server.id)}>
                                    <Terminal className="mr-2 h-4 w-4" />
                                    <span>Switch to Node</span>
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
                  <p className="text-neutral-500 text-sm mt-2 italic">Scale your agency infrastructure with AI-assisted blueprinting.</p>
                </div>
                <Button 
                  onClick={() => {
                    setStep(1);
                    setIsWizardOpen(true);
                  }}
                  className="w-full h-14 bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-2xl text-lg font-light tracking-wide shadow-lg shadow-[#D4AF37]/20"
                >
                  Start Deployment
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

      {/* Deployment Wizard */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-4xl rounded-[40px] p-0 overflow-hidden border-none shadow-3xl">
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[600px]">
            <div className="bg-neutral-900 p-10 text-white space-y-12">
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-8 h-8 text-[#D4AF37]" />
                <span className="text-xl font-light tracking-widest uppercase">Orchestrix AI</span>
              </div>
              <div className="space-y-8">
                {[
                  { s: 1, l: "Intelligence", d: "Context & Industry" },
                  { s: 2, l: "Blueprinting", d: "Modules & Logic" },
                  { s: 3, l: "Governance", d: "Rules & Security" },
                  { s: 4, l: "Deployment", d: "Final Compilation" }
                ].map(i => (
                  <div key={i.s} className={cn("flex gap-4 transition-opacity", step !== i.s && "opacity-40")}>
                    <div className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center text-xs",
                      step === i.s ? "border-[#D4AF37] text-[#D4AF37]" : "border-neutral-700 text-neutral-500"
                    )}>
                      {step > i.s ? <CheckCircle2 className="w-4 h-4" /> : i.s}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{i.l}</div>
                      <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{i.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 p-12 bg-white flex flex-col">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1">
                    <div>
                      <h2 className="text-3xl font-light text-neutral-900">Core Identity</h2>
                      <p className="text-neutral-500 mt-2">Define the industry context for AI optimization.</p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest text-neutral-400">Node Designation</Label>
                        <Input placeholder="e.g. Royal Production Hub" value={newServerName} onChange={(e) => setNewServerName(e.target.value)} className="h-14 bg-neutral-50 border-neutral-200 rounded-2xl text-lg font-light" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest text-neutral-400">Industry Vertical</Label>
                        <Input placeholder="e.g. Luxury Weddings" value={industry} onChange={(e) => setIndustry(e.target.value)} className="h-14 bg-neutral-50 border-neutral-200 rounded-2xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest text-neutral-400">Strategic Intent</Label>
                        <Textarea placeholder="Describe workflow..." className="min-h-[120px] bg-neutral-50 border-neutral-200 rounded-2xl" value={aiNotes} onChange={(e) => setAiNotes(e.target.value)} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1">
                    <div>
                      <h2 className="text-3xl font-light text-neutral-900">Module Blueprinting</h2>
                      <p className="text-neutral-500 mt-2">Toggle integrated micro-services.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(blueprint.modules).map(([key, value]) => (
                        <div key={key} className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50 flex items-center justify-between">
                          <span className="text-sm font-medium uppercase tracking-wider">{key}</span>
                          <Switch checked={value} onCheckedChange={(c) => setBlueprint(prev => ({ ...prev, modules: { ...prev.modules, [key]: c } }))} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1">
                    <div>
                      <h2 className="text-3xl font-light text-neutral-900">Governance</h2>
                      <p className="text-neutral-500 mt-2">Operational protocols.</p>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(blueprint.rules).map(([key, value]) => (
                        <div key={key} className="p-5 rounded-3xl border border-neutral-100 bg-white shadow-sm flex items-center justify-between">
                          <span className="text-sm font-medium uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <Switch checked={value} onCheckedChange={(c) => setBlueprint(prev => ({ ...prev, rules: { ...prev.rules, [key]: c } }))} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
                      <Lock className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-light text-neutral-900">Ready for Compilation</h2>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-12 flex justify-between items-center border-t border-neutral-100 mt-auto">
                {step > 1 ? <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button> : <div />}
                {step === 1 ? (
                  <Button onClick={handleAiAnalyze} disabled={isAiAnalyzing} className="bg-black text-white rounded-xl px-8 h-12 gap-2">
                    {isAiAnalyzing ? "Analyzing..." : "AI Blueprint"} <Sparkles className="w-4 h-4" />
                  </Button>
                ) : step < 4 ? (
                  <Button onClick={handleNextStep} className="bg-black text-white rounded-xl px-8 h-12">Continue</Button>
                ) : (
                  <Button onClick={handleDeploy} disabled={actionLoading} className="bg-[#D4AF37] text-white rounded-xl px-12 h-12">
                    {actionLoading ? "Deploying..." : "Finalize & Deploy"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Blueprint Management Dialog */}
      <Dialog open={isBlueprintDialogOpen} onOpenChange={setIsBlueprintDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[40px] p-10 bg-white border-none shadow-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-light">Infrastructure Blueprint</DialogTitle>
                <DialogDescription className="italic">Modify operational modules and rules for {editingServer?.name}.</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {editBlueprint && (
            <div className="space-y-8 mt-6">
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-400">Operational Modules</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(editBlueprint.modules).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                      <span className="text-sm font-medium uppercase tracking-wider">{key}</span>
                      <Switch 
                        checked={value} 
                        onCheckedChange={(c) => setEditBlueprint(prev => prev ? ({
                          ...prev, modules: { ...prev.modules, [key]: c }
                        }) : null)} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-400">Governance Rules</h3>
                <div className="space-y-3">
                  {Object.entries(editBlueprint.rules).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-2xl border border-neutral-100 bg-white shadow-sm flex items-center justify-between">
                      <span className="text-sm font-medium uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <Switch 
                        checked={value} 
                        onCheckedChange={(c) => setEditBlueprint(prev => prev ? ({
                          ...prev, rules: { ...prev.rules, [key]: c }
                        }) : null)} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {editBlueprint.aiNotes && (
                <div className="p-6 rounded-3xl bg-purple-50/30 border border-purple-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-purple-500">Original AI Intent</span>
                  </div>
                  <p className="text-sm italic text-purple-800/70 leading-relaxed font-light">{editBlueprint.aiNotes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-10">
            <Button variant="ghost" onClick={() => setIsBlueprintDialogOpen(false)} className="rounded-xl px-8">Cancel</Button>
            <Button 
              onClick={handleUpdateBlueprint} 
              disabled={actionLoading}
              className="bg-black text-white hover:bg-neutral-800 rounded-xl px-12 h-12 shadow-lg"
            >
              {actionLoading ? "Synchronizing..." : "Apply Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}