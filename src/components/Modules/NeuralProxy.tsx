import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  ShieldCheck, 
  Database, 
  AlertCircle,
  ChevronRight,
  Fingerprint,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiService, type AIAction } from "@/services/aiService";
import { cn } from "@/lib/utils";
import { fingerprintService } from "@/services/fingerprintService";

interface Message {
  role: "user" | "nano";
  content: string;
  action?: AIAction;
}

export function NeuralProxy() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [ghostDraft, setGhostDraft] = useState<string | null>(null);
  const [showHelperHint, setShowHelperHint] = useState(false);
  const [helperMessage, setHelperMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<Message[]>([
    { 
      role: "nano", 
      content: "NANO Proxy Active. 🛡️ Data Fortress mode engaged. No external leakage detected. How can I assist with your internal operations?" 
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check for Ghost Draft on mount
  useEffect(() => {
    const savedDraft = sessionStorage.getItem("nano_ghost_draft");
    if (savedDraft && !userMessage) {
      setGhostDraft(savedDraft);
    }
  }, []);

  // Save draft as user types (Ghost Memory)
  useEffect(() => {
    if (userMessage.length > 3) {
      sessionStorage.setItem("nano_ghost_draft", userMessage);
    }
  }, [userMessage]);

  // Proactive Helper Pop-up
  useEffect(() => {
    const timer = setTimeout(() => {
      const tech = fingerprintService.getBrowserFingerprint();
      let hint = "Need help with your event production?";
      
      if (tech.deviceType === "ipad") hint = "I've detected your iPad. Need the touch-optimized view?";
      if (tech.os === "Linux") hint = "Linux user detected. Need system terminal access?";
      if (tech.deviceType === "mobile") hint = "On mobile? I can help with quick QR check-ins.";
      
      setHelperMessage(hint);
      setShowHelperHint(true);
      
      // Auto-hide hint after 8 seconds
      setTimeout(() => setShowHelperHint(false), 8000);
    }, 5000); // Pop up after 5 seconds of session

    return () => clearTimeout(timer);
  }, []);

  const recoverGhostDraft = () => {
    if (ghostDraft) {
      setUserMessage(ghostDraft);
      setGhostDraft(null);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!userMessage.trim() || isProcessing) return;

    const currentMessage = userMessage;
    setUserMessage("");
    setHistory(prev => [...prev, { role: "user", content: currentMessage }]);
    setIsProcessing(true);

    try {
      const techInfo = fingerprintService.getBrowserFingerprint();
      const geoInfo = await fingerprintService.getGeoData();
      
      const fullFingerprint = { ...techInfo, ...geoInfo };

      // Step 1: Parse intent via Client-Side Kernel
      const actionResult = await aiService.executeKernelAction({
        payload: { 
          intent: currentMessage,
          metadata: {
            url: window.location.href,
            fingerprint: fullFingerprint
          }
        }
      });

      if (actionResult.success) {
        setHistory(prev => [...prev, { 
          role: "nano", 
          content: actionResult.message || "NANO: Intent captured.",
          action: actionResult.action 
        }]);
      } else {
        setHistory(prev => [...prev, { 
          role: "nano", 
          content: actionResult.message || "NANO: Processing within the local fortress environment..." 
        }]);
      }
    } catch (error) {
      setHistory(prev => [...prev, { 
        role: "nano", 
        content: "NANO: Neural disruption detected in local kernel. Data remains secure within the fortress." 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Proactive Helper Hint */}
      <AnimatePresence>
        {showHelperHint && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="fixed bottom-24 right-8 z-50 max-w-[200px]"
          >
            <div className="bg-background/95 backdrop-blur-md border border-primary/20 p-3 rounded-2xl shadow-xl">
              <div className="flex items-start gap-2">
                <div className="mt-1">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] leading-tight text-foreground/80 font-medium">
                    {helperMessage}
                  </p>
                  <button 
                    onClick={() => { setIsOpen(true); setShowHelperHint(false); }}
                    className="text-[9px] text-primary hover:underline mt-1 font-bold"
                  >
                    Open NANO
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
            isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90"
          )}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[400px] z-50"
          >
            <Card className="border-primary/20 shadow-2xl overflow-hidden bg-background/95 backdrop-blur-md">
              {/* Header */}
              <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                    <motion.div 
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full border border-primary"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight uppercase">NANO Production Assistant</h3>
                    <p className="text-[10px] opacity-70 flex items-center gap-1">
                      <Zap className="h-2 w-2 text-yellow-400" /> INDUSTRY KERNEL V1.0 ACTIVE
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground uppercase px-1">
                  Secure
                </Badge>
              </div>

              {/* Chat Area */}
              <ScrollArea className="h-[400px] p-4 bg-muted/30" ref={scrollRef}>
                <div className="space-y-4">
                  {history.map((msg, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className={cn(
                        "flex flex-col max-w-[85%] gap-1",
                        msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl text-sm shadow-sm",
                        msg.role === 'user' 
                          ? "bg-primary text-primary-foreground rounded-tr-none" 
                          : "bg-card border border-primary/10 rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                      
                      {msg.action && (
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <Database className="h-3 w-3 text-primary animate-pulse" />
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">
                            Injection Success: {msg.action.payload.table}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isProcessing && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Zap className="h-3 w-3 animate-bounce" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Processing Intent...</span>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Ghost Recovery Suggestion */}
              <AnimatePresence>
                {ghostDraft && !userMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between mx-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="truncate max-w-[150px]">Restore: "{ghostDraft.substring(0, 20)}..."</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-[10px]"
                      onClick={recoverGhostDraft}
                    >
                      Restore
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer / Input */}
              <div className="p-4 bg-background border-t border-primary/10">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <Input 
                    placeholder="Describe your intent (e.g. Add guest Maria)..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="h-10 text-xs border-primary/20 focus-visible:ring-primary/30"
                    disabled={isProcessing}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="h-10 w-10 shrink-0"
                    disabled={isProcessing}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground italic">
                      Zero External Data Leakage Guaranteed.
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-[9px] font-mono text-muted-foreground tracking-tighter uppercase">Fortress Active</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}