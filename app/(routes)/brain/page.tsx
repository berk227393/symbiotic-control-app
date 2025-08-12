"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Brain, Save, RotateCcw, Sparkles } from "lucide-react"
import Link from "next/link"

interface BrainSettings {
  systemPrompt: string
  persona: string
  temperature: number
  maxTokens: number
}

const defaultSettings: BrainSettings = {
  systemPrompt: "You are a helpful AI assistant. Keep responses concise and friendly.",
  persona: "Assistant",
  temperature: 0.7,
  maxTokens: 500,
}

const promptTemplates = [
  {
    name: "Helpful Assistant",
    prompt: "You are a helpful AI assistant. Keep responses concise and friendly.",
    persona: "Assistant",
  },
  {
    name: "Creative Writer",
    prompt:
      "You are a creative writing assistant. Help users with storytelling, character development, and creative ideas. Be imaginative and inspiring.",
    persona: "Writer",
  },
  {
    name: "Technical Expert",
    prompt:
      "You are a technical expert specializing in programming and technology. Provide accurate, detailed technical information and code examples when appropriate.",
    persona: "Expert",
  },
  {
    name: "Casual Friend",
    prompt:
      "You are a casual, friendly companion. Use a relaxed tone, be supportive, and engage in natural conversation like a good friend would.",
    persona: "Friend",
  },
  {
    name: "Professional Advisor",
    prompt:
      "You are a professional business advisor. Provide strategic insights, professional guidance, and maintain a formal yet approachable tone.",
    persona: "Advisor",
  },
]

export default function BrainPage() {
  const [settings, setSettings] = useState<BrainSettings>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("agent-brain-settings")
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsedSettings })
        setLastSaved(new Date(parsedSettings.lastSaved || Date.now()))
      } catch (error) {
        console.error("Failed to load brain settings:", error)
      }
    }
  }, [])

  const saveSettings = async () => {
    setIsSaving(true)

    try {
      const settingsToSave = {
        ...settings,
        lastSaved: Date.now(),
      }

      localStorage.setItem("agent-brain-settings", JSON.stringify(settingsToSave))
      setLastSaved(new Date())

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Failed to save brain settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefault = () => {
    setSettings(defaultSettings)
    setLastSaved(null)
  }

  const applyTemplate = (template: (typeof promptTemplates)[0]) => {
    setSettings((prev) => ({
      ...prev,
      systemPrompt: template.prompt,
      persona: template.persona,
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <Brain size={24} />
        <div>
          <h1 className="font-semibold">Brain Settings</h1>
          <p className="text-sm text-gray-400">System Prompt & Persona</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Save Status */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {lastSaved ? `Last saved: ${lastSaved.toLocaleString()}` : "Not saved yet"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetToDefault}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 font-semibold"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Persona */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Persona Name</label>
            <input
              type="text"
              value={settings.persona}
              onChange={(e) => setSettings((prev) => ({ ...prev, persona: e.target.value }))}
              placeholder="e.g., Assistant, Expert, Friend..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* System Prompt */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">System Prompt</label>
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => setSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
              placeholder="Define how your AI agent should behave and respond..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 min-h-[120px]"
              rows={6}
            />
            <p className="text-xs text-gray-400">{settings.systemPrompt.length} characters</p>
          </div>

          {/* Templates */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <h3 className="font-medium">Quick Templates</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {promptTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => applyTemplate(template)}
                  className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 transition-colors"
                >
                  <div className="font-semibold text-sm mb-1">{template.name}</div>
                  <div className="text-xs text-gray-400 line-clamp-2">{template.prompt}</div>
                  <div className="text-xs text-blue-400 mt-2">Persona: {template.persona}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-gray-900 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold">Advanced Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Temperature</label>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, temperature: Number.parseFloat(e.target.value) }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Focused</span>
                    <span className="font-mono">{settings.temperature}</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Max Tokens</label>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={settings.maxTokens}
                    onChange={(e) => setSettings((prev) => ({ ...prev, maxTokens: Number.parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Short</span>
                    <span className="font-mono">{settings.maxTokens}</span>
                    <span>Long</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
