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
  ChevronRight
} from "lucide-react";
import { serverService } from "@/services/serverService";
import { useToast } from "@/hooks/use-toast";
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

const PAGE_SIZE = 6;

interface Server {
  id: string;
  name: string;
  userRole: string;
  created_at: string;
  server_handle: string;
}

// Utility for class names
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
  
  const [newServerName, setNewServerName] = useState("");
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

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim()) return;
    
    setActionLoading(true);
    try {
      const server = await serverService.createServer(newServerName);
      toast({ title: "Infrastructure Deployed", description: `Server ${server.id} is now live.` });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Deployment Failed", description: error.message });
    } finally {
      setActionLoading(false);
    }
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
      toast({ title: "Access Granted", description: "Connection established with remote server." });
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

  // Filter and Sort logic (Client-side for current page)
  const filteredServers = servers
    .filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === "all" || s.userRole === roleFilter;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12">
      <SEO title="Mission Control | Orchestrix" />
      
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-2">Mission Control</h1>
            <p className="text-neutral-500 text-lg">Select or deploy production infrastructure.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder="Search name or ID..." 
                className="pl-10 w-full md:w-[250px] bg-white border-neutral-200 focus:ring-[#D4AF37]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-neutral-200">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Role</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Servers</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("portal_admin")}>Administered</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("member")}>Joined</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>Alphabetical</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-none", viewMode === "grid" && "bg-neutral-100")}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-none", viewMode === "list" && "bg-neutral-100")}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main List Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                Your Fleet
                <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 border-none font-medium">
                  {totalCount} Total
                </Badge>
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-40 rounded-xl bg-neutral-100 animate-pulse border border-neutral-200" />
                ))}
              </div>
            ) : filteredServers.length > 0 ? (
              <>
                <div className={cn(
                  "gap-4",
                  viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
                )}>
                  {filteredServers.map((server) => (
                    <Card 
                      key={server.id} 
                      className="group hover:border-[#D4AF37] transition-all cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md"
                      onClick={() => selectServer(server.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-1">
                          <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100 group-hover:bg-[#D4AF37]/5 transition-colors">
                            <LayoutGrid className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <Badge className={cn(
                            "border-none px-2.5 py-0.5 text-[10px] uppercase tracking-wider",
                            server.userRole === "portal_admin" 
                              ? "bg-[#D4AF37]/10 text-[#D4AF37]" 
                              : "bg-neutral-100 text-neutral-500"
                          )}>
                            {server.userRole === "portal_admin" ? "Portal Admin" : "Member"}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                          {server.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs font-mono text-neutral-400">
                          <Hash className="w-3 h-3" /> {server.id}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                        <span className="text-xs text-neutral-400">
                          Joined {new Date(server.created_at).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" className="group-hover:bg-[#D4AF37] group-hover:text-white rounded-full w-8 h-8 p-0">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-8">
                    <p className="text-sm text-neutral-500">
                      Showing <span className="font-medium text-neutral-900">{(currentPage - 1) * PAGE_SIZE + 1}</span> to <span className="font-medium text-neutral-900">{Math.min(currentPage * PAGE_SIZE, totalCount)}</span> of <span className="font-medium text-neutral-900">{totalCount}</span> servers
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "w-8 h-8 p-0",
                              currentPage === page ? "bg-[#D4AF37] hover:bg-[#B8962E] text-white" : ""
                            )}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-neutral-200">
                <Search className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900">No servers found</h3>
                <p className="text-neutral-500 max-w-xs mx-auto mt-2">
                  Try adjusting your search or filter to find specific infrastructure.
                </p>
                {searchQuery && (
                  <Button variant="link" onClick={() => setSearchQuery("")} className="text-[#D4AF37] mt-4">
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-[#D4AF37]/10 overflow-hidden shadow-lg shadow-[#D4AF37]/5">
              <div className="h-1 bg-[#D4AF37]" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#D4AF37]" />
                  Deploy Server
                </CardTitle>
                <CardDescription>Establish a new event production agency.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateServer} className="space-y-4">
                  <Input 
                    placeholder="Agency Name (e.g. Royal Events)" 
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    required
                    className="bg-neutral-50 border-neutral-200 focus:ring-[#D4AF37]"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Initializing..." : "Deploy Infrastructure"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 text-white border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  Join Infrastructure
                </CardTitle>
                <CardDescription className="text-neutral-400">Enter a secure 18-digit invite code.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinServer} className="space-y-4">
                  <Input 
                    placeholder="18-digit Server ID" 
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                    maxLength={18}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-[#D4AF37] font-mono"
                  />
                  <Button 
                    type="submit" 
                    variant="secondary"
                    className="w-full bg-white text-neutral-900 hover:bg-neutral-100"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Connecting..." : "Establish Connection"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs text-blue-800 leading-relaxed">
                <strong>Portal Admin Privileges:</strong> Deploying a server automatically grants you root access to all event production modules within that environment.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}