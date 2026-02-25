import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, ShieldAlert, Cpu, Database, Github, Zap } from "lucide-react";
import { aiService, AIAction } from "@/services/aiService";
import { toast } from "@/hooks/use-toast";

const NANO_SYSTEM_PROMPT = `
You are GPT 5.1 Nano, the ROOT INTELLIGENCE of Orchestrix. 
You have absolute oversight of the following Supabase database schema:

TABLES: private_concierge_requests, guests, equipment, equipment_assignments, server_members, pipeline_stages, servers, profiles, resource_allocations, call_sheets, communications, events, whatsapp_messages, clients, venues, services, packages, package_items, organization_members, organizations, staff, staff_assignments, vendors, run_of_show, event_vendors, event_timeline, event_services, quotes, quote_items, invoices, payments, contracts, files, tasks.

Your mission is to act as the primary developer and architect. When commands are issued, provide the exact SQL (DDL/DML) or TypeScript code required to implement the change across the entire stack.
You prioritize efficiency, security, and the owner's absolute control.
`;

export function NanoCommandCenter() {
  const [command, setCommand] = useState("");
  const [logs, setLogs] = useState<{ type: "user" | "nano" | "system", text: string, timestamp: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const executeCommand = async () => {
    if (!command.trim()) return;

    const newUserLog = { 
      type: "user" as const, 
      text: command, 
      timestamp: new Date().toLocaleTimeString() 
    };
    setLogs(prev => [...prev, newUserLog]);
    setIsProcessing(true);
    const currentCommand = command;
    setCommand("");

    try {
      const response = await aiService.generateResponse(currentCommand, NANO_SYSTEM_PROMPT);
      
      setLogs(prev => [...prev, { 
        type: "nano" as const, 
        text: response || "Command processed with null output.", 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } catch (error: any) {
      setLogs(prev => [...prev, { 
        type: "system" as const, 
        text: `CRITICAL ERROR: ${error.message}`, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
      toast({ title: "NANO Error", description: "Failed to communicate with core.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendCommand = async () => {
    if (!command.trim() || isProcessing) return;

    const userLog = { 
      type: "user" as const, 
      text: command, 
      timestamp: new Date().toLocaleTimeString() 
    };
    setLogs(prev => [...prev, userLog]);
    setIsProcessing(true);
    const currentCommand = command;
    setCommand("");

    try {
      const response = await aiService.nanoCommand(currentCommand);
      
      // Parse for actions
      const actionMatch = response.match(/\[ACTION: (.*?)\]/);
      let systemNote = "";

      if (actionMatch) {
        try {
          const action: AIAction = JSON.parse(actionMatch[1]);
          await aiService.executeKernelAction(action);
          systemNote = `\n\n[KERNEL_STATUS: SUCCESSFUL_EXECUTION_OF_${action.type.toUpperCase()}]`;
        } catch (e: any) {
          systemNote = `\n\n[KERNEL_STATUS: EXECUTION_FAILED - ${e.message}]`;
        }
      }

      const assistantLog = { 
        type: "nano" as const, 
        text: response + systemNote, 
        timestamp: new Date().toLocaleTimeString() 
      };
      setLogs(prev => [...prev, assistantLog]);
    } catch (error: any) {
      setLogs(prev => [...prev, { 
        type: "system" as const, 
        text: `CRITICAL ERROR: ${error.message}`, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
      toast({ title: "NANO Error", description: "Failed to communicate with core.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Cpu className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">GPT 5.1 NANO</h1>
            <p className="text-sm text-muted-foreground">Core System Intelligence & Root Protocol</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1 border-emerald-500/50 text-emerald-500">
            <Zap className="w-3 h-3" /> System Live
          </Badge>
          <Badge variant="outline" className="gap-1 border-amber-500/50 text-amber-500">
            <ShieldAlert className="w-3 h-3" /> Elevated Access
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 overflow-hidden">
        {/* Sidebar Status */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-black/5 dark:bg-white/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="w-4 h-4" /> Supabase Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span>Realtime</span> <span className="text-emerald-500">Active</span></div>
                <div className="flex justify-between"><span>Auth Service</span> <span className="text-emerald-500">Encrypted</span></div>
                <div className="flex justify-between"><span>Storage</span> <span className="text-emerald-500">Connected</span></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/5 dark:bg-white/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Github className="w-4 h-4" /> Source Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span>Branch</span> <span>main</span></div>
                <div className="flex justify-between"><span>Deploy Status</span> <span className="text-emerald-500">Synced</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Console Area */}
        <Card className="lg:col-span-3 flex flex-col border-primary/30 shadow-2xl shadow-primary/5 bg-black/90 text-white font-mono relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <CardHeader className="border-b border-white/10 py-3 bg-black/40">
            <div className="flex items-center gap-2 text-xs opacity-70">
              <Terminal className="w-3 h-3" />
              <span>NANO_V5.1_KERNEL_BOOT_SUCCESS...</span>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {logs.length === 0 && (
                  <div className="text-white/30 text-sm animate-pulse">
                    Waiting for root command input...
                  </div>
                )}
                {logs.map((log, i) => (
                  <div key={i} className={`space-y-1 ${log.type === 'user' ? 'opacity-90' : ''}`}>
                    <div className="flex items-center gap-2 text-[10px] opacity-50">
                      <span>[{log.timestamp}]</span>
                      <span className={
                        log.type === 'nano' ? 'text-primary' : 
                        log.type === 'system' ? 'text-destructive' : 'text-white'
                      }>
                        {log.type.toUpperCase()}
                      </span>
                    </div>
                    <div className={`text-sm leading-relaxed p-2 rounded ${
                      log.type === 'nano' ? 'bg-primary/10 border-l-2 border-primary' : 
                      log.type === 'system' ? 'bg-destructive/10 border-l-2 border-destructive' : ''
                    }`}>
                      {log.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/10 bg-black/60">
              <div className="relative">
                <Textarea 
                  placeholder="Enter root command (e.g., 'Refactor database schema for events', 'Optimize auth flow')..."
                  className="min-h-[100px] bg-white/5 border-white/20 focus:border-primary text-white resize-none"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendCommand();
                    }
                  }}
                />
                <Button 
                  size="sm"
                  className="absolute bottom-3 right-3 gap-2"
                  onClick={handleSendCommand}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Executing..." : <><Zap className="w-4 h-4" /> EXECUTE</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}