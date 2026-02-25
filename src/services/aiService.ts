import OpenAI from "openai";
import { supabase } from "@/integrations/supabase/client";

// Primary API key from env, fallback logic for Supabase secrets
const getApiKey = async () => {
  const envKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (envKey) return envKey;

  // Attempt to fetch from Supabase if env is missing (Root fallback)
  const { data, error } = await supabase.functions.invoke("get-openai-key");
  if (!error && data?.key) return data.key;
  
  return null;
};

export const aiService = {
  /**
   * Generates a response using OpenAI with Root Access context
   */
  generateResponse: async (prompt: string, systemPrompt: string) => {
    const apiKey = await getApiKey();
    
    if (!apiKey) {
      throw new Error("OpenAI API Key is not configured in Environment or Supabase Secrets.");
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // High-power model for NANO operations
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.2, // Lower temperature for technical precision
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("NANO CORE ERROR:", error);
      throw error;
    }
  },

  suggestEventTimeline: async (eventType: string, guestCount: number) => {
    const prompt = `Create a high-level wedding/event timeline for a ${eventType} with ${guestCount} guests.`;
    return aiService.generateResponse(prompt, "You are an expert event planner.");
  }
};