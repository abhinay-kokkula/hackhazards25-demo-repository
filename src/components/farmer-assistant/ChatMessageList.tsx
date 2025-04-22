
import { Bot, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef } from "react"
import type { Message } from "@/hooks/use-farmer-chat"

interface ChatMessageListProps {
  messages: Message[]
  isLoading: boolean
}

const ChatMessageList = ({ messages, isLoading }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <Bot className="h-8 w-8 mb-2 opacity-40" />
        <p>Ask me about crop prices, market trends, or any farming questions you have.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-220px)] pr-4 mb-4">
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
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}

export default ChatMessageList
