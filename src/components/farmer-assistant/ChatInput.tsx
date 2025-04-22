
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import VoiceInput from "../VoiceInput"
import { useToast } from "@/hooks/use-toast"

interface ChatInputProps {
  onSend: (text: string) => void
  isLoading: boolean
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('')
  const { toast } = useToast()

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input)
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceInput = (text: string) => {
    setInput(text)
    if (text.trim()) {
      toast({
        title: "Voice detected",
        description: "Converting your message...",
        duration: 2000,
      })
      onSend(text)
    }
  }

  return (
    <div className="flex items-center space-x-2 mt-auto pt-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={handleKeyPress}
        disabled={isLoading}
        className="border-accent/30 focus:border-accent"
        aria-label="Chat message"
      />
      <VoiceInput 
        onTranscription={handleVoiceInput}
      />
      <Button 
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
        aria-label={isLoading ? "Loading" : "Send message"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

export default ChatInput
