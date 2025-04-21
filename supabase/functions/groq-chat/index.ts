
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, language = 'en' } = await req.json()

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Invalid prompt: Expected a non-empty string')
    }

    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) {
      console.error('GROQ_API_KEY is not set in environment variables')
      return new Response(JSON.stringify({
        error: 'API key not configured',
        choices: [{ message: { content: "I'm having trouble connecting to my knowledge base. Please contact the administrator about the API key." } }]
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Processing request with prompt: "${prompt.substring(0, 30)}..." in language: ${language}`)

    // Call Groq API with more detailed logging
    console.log('Sending request to Groq API...')
    const startTime = Date.now()
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant for farmers. Communicate in ${language}. Keep responses concise and practical. Focus on agricultural information, crop prices, market trends, farming techniques, and relevant advice. Provide factual information and avoid making up details.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 1024,
        }),
      })

      console.log(`Groq API response status: ${response.status} (${Date.now() - startTime}ms)`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Groq API error (${response.status}):`, errorText)
        
        return new Response(JSON.stringify({
          error: `Groq API returned ${response.status}`,
          choices: [{ message: { content: "I'm having trouble connecting right now. Please try again later." } }]
        }), {
          status: 200, // Return 200 to client but include error info
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const data = await response.json()
      console.log('Successfully received response from Groq API:', JSON.stringify(data).substring(0, 200) + '...')
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (fetchError) {
      console.error('Fetch error when calling Groq API:', fetchError)
      return new Response(JSON.stringify({
        error: `Failed to connect to Groq API: ${fetchError.message}`,
        choices: [{ message: { content: "I can't reach my knowledge base right now. Please check your internet connection and try again." } }]
      }), {
        status: 200, // Return 200 to client but include error info
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('General error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      choices: [{ message: { content: "I'm having trouble processing your request. Please try again with a different question." } }] 
    }), {
      status: 200, // Return 200 to client but include error info
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
