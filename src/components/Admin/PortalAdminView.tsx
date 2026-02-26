import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { aiService } from "@/services/aiService";
import { Loader2, Zap } from "lucide-react";

export function PortalAdminView() {
  const [testPrompt, setTestPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const handleTestAI = async () => {
    if (!testPrompt.trim()) return;
    
    setIsTesting(true);
    try {
      const response = await aiService.getNanoResponse(
        testPrompt, 
        [] // Pass empty array for history to match expected type any[]
      );
      setAiResponse(response || "No response received.");
    } catch (error: any) {
      setAiResponse(`Error: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Portal Administration</h1>
        <p className="text-slate-400">Manage global settings and system integrations.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-indigo-400" />
            AI Integration Test
          </CardTitle>
          <CardDescription className="text-slate-400">
            Test your OpenAI connectivity. Ensure NEXT_PUBLIC_OPENAI_API_KEY is set in your environment or Supabase secrets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Prompt</label>
            <Textarea
              placeholder="Type a message to test the AI..."
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={handleTestAI} 
            disabled={isTesting || !testPrompt}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Send Test Prompt"
            )}
          </Button>

          {aiResponse && (
            <div className="mt-4 p-4 rounded-md bg-slate-950 border border-slate-800">
              <p className="text-sm font-medium text-indigo-400 mb-2">AI Response:</p>
              <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                {aiResponse}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}