import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { industry, notes } = await req.json()
    const apiKey = Deno.env.get('OPENAI_API_KEY')

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not found in secrets')
    }

    const prompt = `
      You are Orchestrix AI (GPT-5.1 Nano logic). 
      An agency owner wants to deploy a new production server for the following:
      Industry: ${industry}
      Notes: ${notes}

      Based on this, suggest the best "blueprint" configuration. 
      Return ONLY a JSON object with this exact structure:
      {
        "modules": {
          "crm": boolean,
          "finance": boolean,
          "communication": boolean,
          "whatsapp": boolean,
          "events": boolean
        },
        "rules": {
          "autoArchive": boolean,
          "requireContract": boolean,
          "enableRealtime": boolean,
          "strictBudgeting": boolean
        },
        "reasoning": "A short 1-sentence explanation of why these were chosen."
      }
    `

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Using 3.5 for speed/reliability, but prompt references 5.1 Nano for brand
        messages: [
          { role: 'system', content: 'You are a helpful assistant that outputs only valid JSON for infrastructure configuration.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    })

    const data = await response.json()
    const blueprint = JSON.parse(data.choices[0].message.content)

    return new Response(JSON.stringify(blueprint), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})