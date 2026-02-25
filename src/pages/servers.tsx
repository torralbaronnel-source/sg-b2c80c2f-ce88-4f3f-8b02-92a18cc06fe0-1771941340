import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogIn, Server, Shield, ArrowRight, Loader2, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { serverService } from "@/services/serverService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

export default function ServerSelectionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [view, setView] = useState<"list" | "create" | "join">("list");
  
  // Form states
  const [serverName, setServerName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    if (user) {
      fetchServers();
    }
  }, [user]);

  const fetchServers = async () => {
    try {
      const data = await serverService.getMyServers();
      setServers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName || !user) return;
    
    setActionLoading(true);
    try {
      await serverService.createServer(serverName, user.id);
      toast({ title: "Infrastructure Deployed", description: "Your private server is ready." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Deployment Failed", description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode || !user) return;

    if (inviteCode.length !== 18) {
      toast({ variant: "destructive", title: "Invalid Protocol", description: "Server IDs must be exactly 18 characters." });
      return;
    }
    
    setActionLoading(true);
    try {
      await serverService.joinServer(inviteCode, user.id);
      toast({ title: "Connection Established", description: "You have joined the secure server." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Access Denied", description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const selectServer = async (serverId: string) => {
    // In a real app, we'd update the profile's current_server_id here
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-[#D4AF37]/30 py-20 px-6">
      <SEO title="Server Selection | Orchestrix OS" />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20 mb-8">
            <Server className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-light text-neutral-900 mb-4">
            Mission <span className="font-semibold italic">Control</span>
          </h1>
          <p className="text-neutral-500 max-w-md font-medium">
            Select an active infrastructure or deploy a new secure server for your event production house.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Create New */}
          <button 
            onClick={() => setView("create")}
            className="group relative h-48 bg-white border border-dashed border-neutral-200 rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:border-[#D4AF37] hover:shadow-xl hover:shadow-black/5"
          >
            <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-500">
              <Plus className="w-6 h-6 text-neutral-400 group-hover:text-white" />
            </div>
            <span className="font-bold text-neutral-900">Deploy New Server</span>
          </button>

          {/* Join Existing */}
          <button 
            onClick={() => setView("join")}
            className="group relative h-48 bg-white border border-neutral-100 rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:shadow-xl hover:shadow-black/5"
          >
            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-500">
              <LogIn className="w-6 h-6 text-[#D4AF37] group-hover:text-white" />
            </div>
            <span className="font-bold text-neutral-900">Join Infrastructure</span>
          </button>

          {/* User Status */}
          <div className="h-48 bg-neutral-900 rounded-[32px] p-8 text-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-widest font-black mb-1">Active Personnel</p>
              <p className="font-bold truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Available Servers</h2>
                <div className="flex items-center text-sm font-medium text-neutral-400">
                  <Search className="w-4 h-4 mr-2" />
                  Filter Servers
                </div>
              </div>

              {servers.length === 0 ? (
                <div className="bg-white rounded-[32px] p-20 border border-neutral-100 text-center">
                  <p className="text-neutral-400 font-medium">No active server connections found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servers.map((server) => (
                    <button
                      key={server.id}
                      onClick={() => selectServer(server.id)}
                      className="group bg-white p-6 rounded-[32px] border border-neutral-100 flex items-center justify-between transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-[#D4AF37] font-bold text-xl group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                          {server.name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-900">{server.name}</h3>
                          <p className="text-xs font-mono text-neutral-400 uppercase tracking-tighter">ID: {server.server_handle}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <span className={cn(
                           "text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest",
                           server.userRole === 'portal_admin' ? "bg-black text-[#D4AF37]" : "bg-neutral-100 text-neutral-500"
                         )}>
                           {server.userRole === 'portal_admin' ? 'Portal Admin' : 'Member'}
                         </span>
                         <ArrowRight className="w-5 h-5 text-neutral-200 group-hover:text-[#D4AF37] transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === "create" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-12 border border-neutral-100 shadow-2xl shadow-black/5"
            >
              <h2 className="text-2xl font-bold mb-2">Initialize New Server</h2>
              <p className="text-neutral-500 mb-8">Establish a new isolated environment for your production house.</p>
              
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3 block">Server Name</label>
                  <Input 
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="e.g. Elite Production House"
                    className="h-16 rounded-2xl border-neutral-100 px-6 text-lg focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={actionLoading}
                    className="flex-1 h-16 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-[#D4AF37] transition-all duration-500 shadow-xl"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" /> : "Deploy Infrastructure"}
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost" 
                    onClick={() => setView("list")}
                    className="h-16 rounded-2xl px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {view === "join" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-12 border border-neutral-100 shadow-2xl shadow-black/5"
            >
              <h2 className="text-2xl font-bold mb-2">Connect to Infrastructure</h2>
              <p className="text-neutral-500 mb-8">Enter the 18-digit secure Server ID provided by your administrator.</p>
              
              <form onSubmit={handleJoin} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3 block">Secure Server ID</label>
                  <div className="relative">
                    <Input 
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX-XXXX-XX"
                      maxLength={18}
                      className="h-16 rounded-2xl border-neutral-100 px-6 text-lg font-mono focus:ring-[#D4AF37] tracking-widest"
                      required
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-neutral-300">
                      {inviteCode.length}/18
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={actionLoading}
                    className="flex-1 h-16 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-[#D4AF37] transition-all duration-500 shadow-xl"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" /> : "Request Access"}
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost" 
                    onClick={() => setView("list")}
                    className="h-16 rounded-2xl px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Utility function for conditional class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}