"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Volume2, Play, Square, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiBinaryRequest } from "../../../lib/api"
import { AudioPlayer } from "../../../lib/player"
import { useUIStore } from "../../../store/ui"

export default function TTSPage() {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlayer] = useState(() => new AudioPlayer())
  const { voiceSettings } = useUIStore()

  const generateSpeech = async () => {
    if (!text.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      const audioData = await apiBinaryRequest("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          speed: voiceSettings.speed,
          stability: voiceSettings.stability,
          similarity: voiceSettings.similarity,
        }),
      })

      setIsPlaying(true)
      await audioPlayer.playAudio(audioData)
      setIsPlaying(false)
    } catch (error) {
      console.error("TTS error:", error)
      // Fallback to silent audio for demo
      try {
        const silentAudio = await audioPlayer.createSilentAudio(2000)
        setIsPlaying(true)
        await audioPlayer.playAudio(silentAudio)
        setIsPlaying(false)
      } catch (fallbackError) {
        console.error("Fallback audio error:", fallbackError)
        setIsPlaying(false)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const stopAudio = () => {
    audioPlayer.stop()
    setIsPlaying(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      generateSpeech()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <Volume2 size={24} />
        <div>
          <h1 className="font-semibold">Text to Speech</h1>
          <p className="text-sm text-gray-400">Text → Voice</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Voice Settings Display */}
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Voice Settings</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Speed</span>
                <div className="font-mono">{voiceSettings.speed.toFixed(1)}</div>
              </div>
              <div>
                <span className="text-gray-400">Stability</span>
                <div className="font-mono">{voiceSettings.stability.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-gray-400">Similarity</span>
                <div className="font-mono">{voiceSettings.similarity.toFixed(2)}</div>
              </div>
            </div>
            <Link href="/settings" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
              Adjust in Settings →
            </Link>
          </div>

          {/* Text Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Text to Convert</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter the text you want to convert to speech..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 min-h-[120px]"
              rows={5}
              disabled={isGenerating || isPlaying}
            />
            <p className="text-xs text-gray-400">{text.length} characters • Press Ctrl+Enter to generate</p>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={generateSpeech}
              disabled={!text.trim() || isGenerating || isPlaying}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-xl px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Generate & Play
                </>
              )}
            </button>

            {isPlaying && (
              <button
                onClick={stopAudio}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Square size={20} />
                Stop
              </button>
            )}
          </div>

          {/* Status */}
          {(isGenerating || isPlaying) && (
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-blue-400">
                {isGenerating && <Loader2 size={16} className="animate-spin" />}
                {isPlaying && <Volume2 size={16} />}
                <span>{isGenerating ? "Generating speech..." : "Playing audio..."}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
