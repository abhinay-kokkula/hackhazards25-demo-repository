
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import VoiceInput from "./VoiceInput"
import { supabase } from "@/integrations/supabase/client"
import { Send, Bot, Loader2, MessageCircle } from "lucide-react"

type Message = {
  content: string
  role: 'user' | 'assistant'
}

const FarmerAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    setIsLoading(true)
    const newUserMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, newUserMessage]
    setMessages(newMessages)
    setInput('')

    try {
      console.log("Sending request to Groq API with:", text.substring(0, 30) + "...")
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: { prompt: text, language: 'en' }
      })

      if (error) {
        console.error("Supabase function error:", error)
        throw new Error(`API Error: ${error.message}`)
      }

      console.log("Received response from Groq API:", data)

      let responseContent = "I couldn't process that. Please try again."
      
      if (data?.choices && data.choices.length > 0 && data.choices[0].message) {
        responseContent = data.choices[0].message.content || responseContent
      } else {
        console.error("Unexpected response format:", data)
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
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon"
            className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90vw] sm:w-[400px] p-0">
          <Card className="h-full border-0">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bot className="h-5 w-5 text-accent" />
                Farmer Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 h-full flex flex-col">
                <ScrollArea className="flex-1 h-[calc(100vh-220px)] pr-4 mb-4" ref={scrollAreaRef}>
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                      <Bot className="h-8 w-8 mb-2 opacity-40" />
                      <p>Ask me about crop prices, market trends, or any farming questions you have.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`rounded-lg px-3 py-2 max-w-[80%] ${
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
                  )}
                </ScrollArea>
                
                <div className="flex items-center space-x-2 mt-auto pt-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                    disabled={isLoading}
                    className="border-accent/30 focus:border-accent"
                  />
                  <VoiceInput onTranscription={handleVoiceInput} />
                  <Button 
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isLoading}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default FarmerAssistant
