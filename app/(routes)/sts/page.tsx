"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Phone, Square, Loader2, Volume2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { AudioRecorder } from "../../../lib/audio"
import { AudioPlayer } from "../../../lib/player"
import { createFormData, apiRequest, apiBinaryRequest } from "../../../lib/api"
import { useUIStore } from "../../../store/ui"

interface Conversation {
  id: string
  userText: string
  assistantText: string
  timestamp: Date
  duration?: number
}

export default function STSPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState<"idle" | "stt" | "llm" | "tts" | "playing">("idle")
  const [audioRecorder] = useState(() => new AudioRecorder())
  const [audioPlayer] = useState(() => new AudioPlayer())
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null)
  const { micState, setMicState, voiceSettings } = useUIStore()

  const startRecording = useCallback(async () => {
    try {
      await audioRecorder.startRecording()
      setIsRecording(true)
      setRecordingStartTime(new Date())
      setMicState("listening")
      setCurrentStep("idle")
    } catch (error) {
      console.error("Failed to start recording:", error)
      alert("Microphone access denied. Please allow microphone access and try again.")
    }
  }, [audioRecorder, setMicState])

  const stopRecording = useCallback(async () => {
    if (!isRecording) return

    try {
      setIsRecording(false)
      setMicState("processing")
      setIsProcessing(true)

      const audioBlob = await audioRecorder.stopRecording()
      const duration = recordingStartTime ? (Date.now() - recordingStartTime.getTime()) / 1000 : 0

      // Step 1: Speech to Text
      setCurrentStep("stt")
      const formData = createFormData({ audio: audioBlob })
      const sttResponse = await apiRequest<{ text: string }>("/api/stt", {
        method: "POST",
        body: formData,
      })

      const userText = sttResponse.text

      // Step 2: LLM Processing
      setCurrentStep("llm")
      const llmResponse = await apiRequest<{ reply: string }>("/api/llm", {
        method: "POST",
        body: JSON.stringify({
          text: userText,
          systemPrompt:
            "You are a helpful AI assistant. Keep responses concise and conversational for voice interaction.",
        }),
      })

      const assistantText = llmResponse.reply

      // Step 3: Text to Speech
      setCurrentStep("tts")
      const audioData = await apiBinaryRequest("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: assistantText,
          speed: voiceSettings.speed,
          stability: voiceSettings.stability,
          similarity: voiceSettings.similarity,
        }),
      })

      // Step 4: Play Audio
      setCurrentStep("playing")
      setIsPlaying(true)
      await audioPlayer.playAudio(audioData)
      setIsPlaying(false)

      // Save conversation
      const conversation: Conversation = {
        id: Date.now().toString(),
        userText,
        assistantText,
        timestamp: new Date(),
        duration,
      }

      setConversations((prev) => [conversation, ...prev])
    } catch (error) {
      console.error("STS error:", error)
      const errorConversation: Conversation = {
        id: Date.now().toString(),
        userText: "Error: Could not process audio",
        assistantText: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setConversations((prev) => [errorConversation, ...prev])
    } finally {
      setIsProcessing(false)
      setIsPlaying(false)
      setMicState("off")
      setCurrentStep("idle")
      setRecordingStartTime(null)
    }
  }, [isRecording, audioRecorder, audioPlayer, recordingStartTime, setMicState, voiceSettings])

  const stopAudio = useCallback(() => {
    audioPlayer.stop()
    setIsPlaying(false)
    setCurrentStep("idle")
  }, [audioPlayer])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault()
        if (!isRecording && !isProcessing) {
          startRecording()
        }
      } else if (e.code === "Escape") {
        e.preventDefault()
        if (isRecording) {
          stopRecording()
        } else if (isPlaying) {
          stopAudio()
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        if (isRecording) {
          stopRecording()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isRecording, isProcessing, isPlaying, startRecording, stopRecording, stopAudio])

  const getStepIcon = (step: string) => {
    switch (step) {
      case "stt":
        return <MessageSquare size={16} />
      case "llm":
        return <Loader2 size={16} className="animate-spin" />
      case "tts":
        return <Volume2 size={16} />
      case "playing":
        return <Volume2 size={16} />
      default:
        return null
    }
  }

  const getStepText = (step: string) => {
    switch (step) {
      case "stt":
        return "Converting speech to text..."
      case "llm":
        return "AI is thinking..."
      case "tts":
        return "Generating speech..."
      case "playing":
        return "Playing response..."
      default:
        return "Ready for voice input"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <Phone size={24} />
        <div>
          <h1 className="font-semibold">Speech to Speech</h1>
          <p className="text-sm text-gray-400">Voice → Voice</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Controls */}
          <div className="bg-gray-900 rounded-xl p-6 text-center space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Voice Conversation</h3>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                {getStepIcon(currentStep)}
                <span>{getStepText(currentStep)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onMouseDown={!isRecording && !isProcessing ? startRecording : undefined}
                onMouseUp={isRecording ? stopRecording : undefined}
                onTouchStart={!isRecording && !isProcessing ? startRecording : undefined}
                onTouchEnd={isRecording ? stopRecording : undefined}
                disabled={isProcessing}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 scale-110"
                    : isProcessing
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }`}
              >
                {isProcessing ? (
                  <Loader2 size={36} className="animate-spin" />
                ) : isRecording ? (
                  <Square size={36} />
                ) : (
                  <Phone size={36} />
                )}
              </button>

              {isPlaying && (
                <button
                  onClick={stopAudio}
                  className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 flex items-center justify-center"
                >
                  <Square size={36} />
                </button>
              )}
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <p>Space = Push-to-Talk • Esc = Cancel/Stop</p>
              <p>Hold to record, release to process and hear response</p>
            </div>

            {/* Processing Steps */}
            {isProcessing && (
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between text-xs">
                  <span className={currentStep === "stt" ? "text-blue-400" : "text-gray-500"}>1. Speech→Text</span>
                  <span className={currentStep === "llm" ? "text-blue-400" : "text-gray-500"}>2. AI Processing</span>
                  <span className={currentStep === "tts" ? "text-blue-400" : "text-gray-500"}>3. Text→Speech</span>
                  <span className={currentStep === "playing" ? "text-blue-400" : "text-gray-500"}>4. Playing</span>
                </div>
              </div>
            )}
          </div>

          {/* Conversations */}
          <div className="space-y-3">
            <h3 className="font-semibold">Conversation History</h3>

            {conversations.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <Phone size={48} className="mx-auto mb-4 opacity-50" />
                <p>No conversations yet. Hold the button to start talking.</p>
              </div>
            )}

            {conversations.map((conversation) => (
              <div key={conversation.id} className="bg-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{conversation.timestamp.toLocaleString()}</span>
                  {conversation.duration && (
                    <span className="text-xs text-gray-400">{conversation.duration.toFixed(1)}s</span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="bg-blue-900/30 rounded-lg p-3">
                    <div className="text-xs text-blue-400 mb-1">You said:</div>
                    <p className="text-gray-100">{conversation.userText}</p>
                  </div>

                  <div className="bg-green-900/30 rounded-lg p-3">
                    <div className="text-xs text-green-400 mb-1">AI replied:</div>
                    <p className="text-gray-100">{conversation.assistantText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
