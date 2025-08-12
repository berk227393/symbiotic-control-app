"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Mic, MicOff, Square, Loader2 } from "lucide-react"
import Link from "next/link"
import { AudioRecorder } from "../../../lib/audio"
import { createFormData, apiRequest } from "../../../lib/api"
import { useUIStore } from "../../../store/ui"

interface Transcript {
  id: string
  text: string
  timestamp: Date
  duration?: number
}

export default function STTPage() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioRecorder] = useState(() => new AudioRecorder())
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null)
  const { micState, setMicState } = useUIStore()

  const startRecording = useCallback(async () => {
    try {
      await audioRecorder.startRecording()
      setIsRecording(true)
      setRecordingStartTime(new Date())
      setMicState("listening")
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

      const formData = createFormData({
        audio: audioBlob,
      })

      const response = await apiRequest<{ text: string }>("/api/stt", {
        method: "POST",
        body: formData,
      })

      const transcript: Transcript = {
        id: Date.now().toString(),
        text: response.text,
        timestamp: new Date(),
        duration,
      }

      setTranscripts((prev) => [transcript, ...prev])
    } catch (error) {
      console.error("STT error:", error)
      const errorTranscript: Transcript = {
        id: Date.now().toString(),
        text: "Error: Could not process audio. Please try again.",
        timestamp: new Date(),
      }
      setTranscripts((prev) => [errorTranscript, ...prev])
    } finally {
      setIsProcessing(false)
      setMicState("off")
      setRecordingStartTime(null)
    }
  }, [isRecording, audioRecorder, recordingStartTime, setMicState])

  const toggleMic = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault()
        if (!isRecording && !isProcessing) {
          startRecording()
        }
      } else if (e.code === "KeyM" && !e.repeat) {
        e.preventDefault()
        toggleMic()
      } else if (e.code === "Escape") {
        e.preventDefault()
        if (isRecording) {
          stopRecording()
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
  }, [isRecording, isProcessing, startRecording, stopRecording, toggleMic])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <Mic size={24} />
        <div>
          <h1 className="font-semibold">Speech to Text</h1>
          <p className="text-sm text-gray-400">Voice → Text</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Controls */}
          <div className="bg-gray-900 rounded-xl p-6 text-center space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Voice Recording</h3>
              <p className="text-sm text-gray-400">
                {isRecording
                  ? "Recording... Release Space or tap Stop"
                  : isProcessing
                    ? "Processing audio..."
                    : "Hold Space or tap Record to start"}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onMouseDown={!isRecording && !isProcessing ? startRecording : undefined}
                onMouseUp={isRecording ? stopRecording : undefined}
                onTouchStart={!isRecording && !isProcessing ? startRecording : undefined}
                onTouchEnd={isRecording ? stopRecording : undefined}
                disabled={isProcessing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 scale-110"
                    : isProcessing
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }`}
              >
                {isProcessing ? (
                  <Loader2 size={32} className="animate-spin" />
                ) : isRecording ? (
                  <Square size={32} />
                ) : (
                  <Mic size={32} />
                )}
              </button>

              <button
                onClick={toggleMic}
                disabled={isProcessing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                  micState === "listening" ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {micState === "listening" ? <Mic size={32} /> : <MicOff size={32} />}
              </button>
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <p>Space = Push-to-Talk • M = Toggle Mic • Esc = Cancel</p>
              <p>
                Status: <span className="font-mono">{micState}</span>
              </p>
            </div>
          </div>

          {/* Transcripts */}
          <div className="space-y-3">
            <h3 className="font-semibold">Transcripts</h3>

            {transcripts.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <Mic size={48} className="mx-auto mb-4 opacity-50" />
                <p>No transcripts yet. Start recording to see results.</p>
              </div>
            )}

            {transcripts.map((transcript) => (
              <div key={transcript.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-400">{transcript.timestamp.toLocaleString()}</span>
                  {transcript.duration && (
                    <span className="text-xs text-gray-400">{transcript.duration.toFixed(1)}s</span>
                  )}
                </div>
                <p className="text-gray-100">{transcript.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
