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
import { useLocation } from "react-router-dom"
import { useFarmerChat } from "@/hooks/use-farmer-chat"
import ChatMessageList from "./farmer-assistant/ChatMessageList"
import ChatInput from "./farmer-assistant/ChatInput"

const FarmerAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === "/"
  const { messages, isLoading, sendMessage } = useFarmerChat()

  // Close sheet when navigating away from home page
  useEffect(() => {
    if (!isHomePage) {
      setIsOpen(false)
    }
  }, [isHomePage])
  
  // On non-home pages, only show the button that redirects to home
  if (!isHomePage) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          size="icon"
          className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
          onClick={() => window.location.href = "/"}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
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
                <ChatMessageList messages={messages} isLoading={isLoading} />
                <ChatInput onSend={sendMessage} isLoading={isLoading} />
              </div>
            </CardContent>
          </Card>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default FarmerAssistant
