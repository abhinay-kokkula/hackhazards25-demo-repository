
import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export type Message = {
  content: string
  role: 'user' | 'assistant'
}

export const useFarmerChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    setIsLoading(true)
    const newUserMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, newUserMessage]
    setMessages(newMessages)

    try {
      console.log("Sending request to Groq API with:", text.substring(0, 30) + "...")
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: { prompt: text, language: 'en' }
      })

      if (error) {
        console.error("Supabase function error:", error)
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect to the assistant. Please try again later.",
        })
        
        const errorMessage: Message = { 
          role: 'assistant', 
          content: "I'm having trouble connecting right now. Please try again later." 
        }
        setMessages([...newMessages, errorMessage])
        return
      }

      console.log("Received response from Groq API:", data)

      let responseContent = "I couldn't process that. Please try again."
      
      if (data?.error) {
        console.error("API reported error:", data.error)
        if (data.error.includes('API key')) {
          responseContent = "The assistant is currently unavailable due to an API key issue. Please contact the administrator."
          toast({
            variant: "destructive",
            title: "API Key Error",
            description: "There's an issue with the Groq API key configuration.",
          })
        } else {
          responseContent = data.choices && data.choices[0]?.message?.content 
            ? data.choices[0].message.content 
            : "There was an issue with my connection. Please try again later."
        }
      } else if (data?.choices && data.choices.length > 0 && data.choices[0].message) {
        responseContent = data.choices[0].message.content || responseContent
      } else {
        console.error("Unexpected response format:", data)
        toast({
          variant: "destructive",
          title: "Response Error",
          description: "Received an unexpected response format from the assistant.",
        })
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: responseContent
      }
      setMessages([...newMessages, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again.",
      })
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again later." 
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    isLoading,
    sendMessage
  }
}
