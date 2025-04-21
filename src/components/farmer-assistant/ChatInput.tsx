
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import VoiceInput from "../VoiceInput"

interface ChatInputProps {
  onSend: (text: string) => void
  isLoading: boolean
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div className="flex items-center space-x-2 mt-auto pt-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        disabled={isLoading}
        className="border-accent/30 focus:border-accent"
      />
      <VoiceInput onTranscription={(text) => {
        setInput(text)
        if (text.trim()) {
          onSend(text)
        }
      }} />
      <Button 
        onClick={handleSend}
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
  )
}

export default ChatInput
