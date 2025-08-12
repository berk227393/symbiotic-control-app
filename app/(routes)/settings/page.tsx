"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Settings, Volume2, Globe, Palette, Bell, Shield } from "lucide-react"
import Link from "next/link"
import { useUIStore } from "../../../store/ui"

export default function SettingsPage() {
  const { language, setLanguage, voiceSettings, setVoiceSettings } = useUIStore()
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState("dark")
  const [autoSave, setAutoSave] = useState(true)

  // Load additional settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("agent-app-settings")
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        setNotifications(settings.notifications ?? true)
        setTheme(settings.theme ?? "dark")
        setAutoSave(settings.autoSave ?? true)
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      notifications,
      theme,
      autoSave,
    }
    localStorage.setItem("agent-app-settings", JSON.stringify(settings))
  }

  // Auto-save when settings change
  useEffect(() => {
    saveSettings()
  }, [notifications, theme, autoSave])

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "tr", name: "Türkçe" },
    { code: "ja", name: "日本語" },
  ]

  const themes = [
    { id: "dark", name: "Dark" },
    { id: "light", name: "Light" },
    { id: "auto", name: "Auto" },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <Settings size={24} />
        <div>
          <h1 className="font-semibold">Settings</h1>
          <p className="text-sm text-gray-400">App Configuration</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Voice Settings */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 size={20} />
              <h3 className="font-semibold">Voice Settings</h3>
            </div>

            <div className="space-y-6">
              {/* Speed */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Speech Speed</label>
                  <span className="text-sm text-gray-400 font-mono">{voiceSettings.speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSettings.speed}
                  onChange={(e) => setVoiceSettings({ speed: Number.parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Stability */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Voice Stability</label>
                  <span className="text-sm text-gray-400 font-mono">{voiceSettings.stability.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceSettings.stability}
                  onChange={(e) => setVoiceSettings({ stability: Number.parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Variable</span>
                  <span>Stable</span>
                </div>
              </div>

              {/* Similarity */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Voice Similarity</label>
                  <span className="text-sm text-gray-400 font-mono">{voiceSettings.similarity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceSettings.similarity}
                  onChange={(e) => setVoiceSettings({ similarity: Number.parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Creative</span>
                  <span>Similar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={20} />
              <h3 className="font-semibold">Language</h3>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Interface Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400">Changes will take effect after restart</p>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={20} />
              <h3 className="font-semibold">Appearance</h3>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      theme === themeOption.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    <div className="text-sm font-medium">{themeOption.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={20} />
              <h3 className="font-semibold">Notifications</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Push Notifications</div>
                  <div className="text-xs text-gray-400">Receive notifications for important updates</div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} />
              <h3 className="font-semibold">Privacy & Security</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Auto-save Settings</div>
                  <div className="text-xs text-gray-400">Automatically save changes to settings</div>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoSave ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoSave ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-3 font-semibold transition-colors">
                  Clear All Data
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  This will remove all saved settings, profile data, and conversation history
                </p>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="font-semibold mb-4">App Information</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Version</span>
                <span>1.0.0 Beta</span>
              </div>
              <div className="flex justify-between">
                <span>Build</span>
                <span>2024.01.15</span>
              </div>
              <div className="flex justify-between">
                <span>Platform</span>
                <span>Web PWA</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
