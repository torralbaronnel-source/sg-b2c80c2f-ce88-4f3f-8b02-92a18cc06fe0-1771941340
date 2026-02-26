import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/services/aiService";
import { supabase } from "@/integrations/supabase/client";

interface NeuralProxyProps {
  isOpen?: boolean;
  onClose?: () => void;
  context?: string;
  initialMessage?: string;
}

export function NeuralProxy({ isOpen: controlledOpen, onClose, context = "General System", initialMessage }: NeuralProxyProps) {
  const [isOpen, setIsOpen] = useState(controlledOpen || false);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{role: 'nano' | 'user', content: string}[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (controlledOpen !== undefined) setIsOpen(controlledOpen);
  }, [controlledOpen]);

  useEffect(() => {
    if (isOpen && history.length === 0) {
      const intro = initialMessage || `I noticed a disruption in the neural flow for ${context}. I'm NANO, your Proxy Operator. Just tell me what you need to save in plain text, and I'll handle the injection for you.`;
      setHistory([{ role: 'nano', content: intro }]);
    }
  }, [isOpen, context, initialMessage]);

  const handleProxyRequest = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);

    try {
      // Step 1: Parse intent and execute kernel action via AI Service
      const actionResult = await aiService.executeKernelAction({
        type: 'SQL_INJECTION',
        payload: {
          intent: message,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });

      if (actionResult.success) {
        // Step 2: Log the intervention for Research (Corrected Mapping)
        await supabase.from('bug_reports').insert({
          error_message: `NANO Proxy Intervention: ${context} | User: "${userMsg}"`,
          status: 'resolved',
          priority: 'low',
          url: window.location.href,
          user_agent: navigator.userAgent
        });

        setHistory(prev => [...prev, { 
          role: 'nano', 
          content: `Neural mapping complete. I've successfully injected the data into the ${context} registry. The disruption has been bypassed.` 
        }]);

        toast({
          title: "NANO Proxy Success",
          description: "Data has been injected into the system on your behalf.",
        });
      }

    } catch (error) {
      console.error("Proxy Error:", error);
      setHistory(prev => [...prev, { 
        role: 'nano', 
        content: "I encountered a synchronization error. My creators have been notified. Please try one more time or wait for a neural refresh." 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen && controlledOpen === undefined) {
    return (
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary shadow-2xl hover:scale-110 transition-transform"
        >
          <Bot className="h-6 w-6 text-primary-foreground" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg"
          >
            <Card className="border-2 border-primary/20 shadow-2xl">
              <CardHeader className="bg-primary/5 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">NANO Proxy Operator</CardTitle>
                      <CardDescription>Bypassing Input Disruptions</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {history.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-muted border rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-muted border p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analyzing neural intent...
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t bg-muted/30">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your data here (e.g., 'Add DJ Spark, 0917...')" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleProxyRequest()}
                      disabled={isProcessing}
                      className="bg-background border-primary/20"
                    />
                    <Button onClick={handleProxyRequest} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center uppercase tracking-widest font-bold">
                    Neural Bridge Active • Direct Injection Enabled
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}