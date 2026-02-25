import OpenAI from "openai";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Required for client-side usage in this context
}) : null;

export const aiService = {
  /**
   * Generates a response using OpenAI
   * @param prompt The user message or prompt
   * @param systemPrompt Optional system context
   */
  generateResponse: async (prompt: string, systemPrompt: string = "You are a helpful assistant for Orchestrix, a premium wedding and event production platform.") => {
    if (!openai) {
      throw new Error("OpenAI API Key is not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment variables.");
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Cost-efficient and powerful default
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  },

  /**
   * Specialized method for event planning suggestions
   */
  suggestEventTimeline: async (eventType: string, guestCount: number) => {
    const prompt = `Create a high-level wedding/event timeline for a ${eventType} with ${guestCount} guests. Include key milestones like ceremony, reception, and major program segments.`;
    return aiService.generateResponse(prompt);
  }
};