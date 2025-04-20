
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import VoiceInput from "./VoiceInput"
import { supabase } from "@/integrations/supabase/client"
import { Send } from "lucide-react"

type Message = {
  content: string
  role: 'user' | 'assistant'
}

const FarmerAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    setIsLoading(true)
    const newUserMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, newUserMessage]
    setMessages(newMessages)
    setInput('')

    try {
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: { prompt: text, language: 'en' }
      })

      if (error) throw error

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.choices[0]?.message?.content || "I couldn't process that. Please try again."
      }
      setMessages([...newMessages, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = (transcription: string) => {
    setInput(transcription)
    if (transcription.trim()) {
      handleSend(transcription)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Farmer Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            disabled={isLoading}
          />
          <VoiceInput onTranscription={handleVoiceInput} />
          <Button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default FarmerAssistant
