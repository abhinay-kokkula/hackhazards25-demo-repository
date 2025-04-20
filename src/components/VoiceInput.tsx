
import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface VoiceInputProps {
  onTranscription: (text: string) => void
  isListening?: boolean
  language?: string
}

const VoiceInput = ({ onTranscription, isListening = false, language = 'en-IN' }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      chunks.current = []

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data)
        }
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/webm' })
        const reader = new FileReader()
        
        reader.onload = async () => {
          if (reader.result && typeof reader.result === 'string') {
            const base64Audio = reader.result.split(',')[1]
            
            try {
              const { data, error } = await supabase.functions.invoke('voice-to-text', {
                body: { audio: base64Audio }
              })

              if (error) throw error
              if (data?.text) {
                onTranscription(data.text)
              }
            } catch (error) {
              console.error('Error transcribing audio:', error)
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to transcribe audio. Please try again.",
              })
            }
          }
        }

        reader.readAsDataURL(audioBlob)
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <Button 
      variant="outline"
      size="icon"
      className={`relative ${isRecording ? 'bg-red-100 hover:bg-red-200' : ''}`}
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? (
        <Square className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  )
}

export default VoiceInput
