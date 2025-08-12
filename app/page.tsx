"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  MessageSquare,
  Volume2,
  Mic,
  Phone,
  Brain,
  ShoppingBag,
  User,
  Settings,
  QrCode,
  Activity,
  Gamepad2,
  Zap,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const controlButtons = [
  { href: "/chat", icon: MessageSquare, label: "Chat", description: "Text→Text" },
  { href: "/tts", icon: Volume2, label: "TTS", description: "Text→Voice" },
  { href: "/stt", icon: Mic, label: "STT", description: "Voice→Text" },
  { href: "/sts", icon: Phone, label: "STS", description: "Voice→Voice" },
  { href: "/brain", icon: Brain, label: "Brain", description: "System Prompt" },
  { href: "/store", icon: ShoppingBag, label: "Store", description: "Items & Clothing" },
  { href: "/profile", icon: User, label: "Profile", description: "User Settings" },
  { href: "/settings", icon: Settings, label: "Settings", description: "App Config" },
  { href: "/pair", icon: QrCode, label: "Pair", description: "Device Sync" },
  { href: "/status", icon: Activity, label: "Status", description: "System Info" },
  { href: "#", icon: Gamepad2, label: "Control", description: "Coming Soon" },
  { href: "#", icon: Zap, label: "Power", description: "Coming Soon" },
]

export default function Home() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-6 text-center border-b border-gray-900/50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div></div>
            <h1 className="text-3xl font-bold tracking-tight font-sans">Agent Control</h1>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-900/50"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
          <p className="text-gray-400 text-sm font-mono">AI Agent Management Dashboard</p>
          <p className="text-gray-500 text-xs font-mono mt-1">{user.email}</p>
        </div>
      </header>

      {/* Main Control Grid */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {controlButtons.map((button, index) => {
            const Icon = button.icon
            const isDisabled = button.href === "#"

            return (
              <Link
                key={index}
                href={button.href}
                className={`
                  group relative rounded-lg p-4 min-h-[120px] flex flex-col items-center justify-center
                  transition-all duration-300 ease-out touch-manipulation
                  border border-gray-900/50 backdrop-blur-sm
                  ${
                    isDisabled
                      ? "bg-black/50 text-gray-600 cursor-not-allowed"
                      : "bg-black/80 hover:bg-gray-950/90 active:bg-gray-900/50 text-white hover:scale-[1.02] hover:border-gray-800/70"
                  }
                `}
                onClick={isDisabled ? (e) => e.preventDefault() : undefined}
              >
                <Icon
                  size={28}
                  className={`mb-3 transition-all duration-300 ${
                    isDisabled ? "text-gray-600" : "text-gray-300 group-hover:text-gray-100"
                  }`}
                />
                <span className="font-semibold text-sm mb-1 tracking-wide font-sans">{button.label}</span>
                <span className="text-xs text-gray-500 text-center font-mono">{button.description}</span>
              </Link>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-900/50 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-md mx-auto text-sm">
          <div className="flex items-center gap-2">
            <Mic size={14} className="text-gray-600" />
            <span className="text-gray-400 font-mono text-xs">Off</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="text-gray-500">--ms</span>
            <span className="text-gray-500">1,000</span>

            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
              <span className="text-gray-500">Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
