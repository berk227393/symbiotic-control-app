"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, User, Settings, Store, Volume2, Gamepad2, Target, Shield, Zap, Eye, Heart, Cpu } from "lucide-react"

const agentControls = [
  { id: "brain", icon: Brain, color: "#ff6b6b" },
  { id: "profile", icon: User, color: "#4ecdc4" },
  { id: "settings", icon: Settings, color: "#45b7d1" },
  { id: "store", icon: Store, color: "#96ceb4" },
  { id: "tts", icon: Volume2, color: "#feca57" },
  { id: "combat", icon: Gamepad2, color: "#ff9ff3" },
  { id: "target", icon: Target, color: "#ff6348" },
  { id: "defense", icon: Shield, color: "#74b9ff" },
  { id: "energy", icon: Zap, color: "#fdcb6e" },
  { id: "vision", icon: Eye, color: "#6c5ce7" },
  { id: "health", icon: Heart, color: "#fd79a8" },
  { id: "system", icon: Cpu, color: "#00b894" },
]

export default function AgentControlPanel() {
  const [activeControl, setActiveControl] = useState<string | null>(null)

  const handleControlPress = (controlId: string) => {
    setActiveControl(controlId)
    // Burada ilgili sayfaya yönlendirme yapılacak
    console.log(`Activating ${controlId} control`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-md mx-auto pt-12">
        <h1 className="text-white text-2xl font-bold mb-2 text-center">Agent Control</h1>
        <p className="text-gray-400 text-sm mb-8 text-center">Tap to control your agent</p>

        <div className="grid grid-cols-3 gap-4">
          {agentControls.map((control) => {
            const IconComponent = control.icon
            const isActive = activeControl === control.id

            return (
              <motion.button
                key={control.id}
                onClick={() => handleControlPress(control.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  backgroundColor: isActive ? control.color + "20" : "rgba(255, 255, 255, 0.05)",
                  borderColor: isActive ? control.color : "rgba(255, 255, 255, 0.1)",
                }}
                className="aspect-square rounded-2xl border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-200"
              >
                <IconComponent size={32} color={isActive ? control.color : "#9ca3af"} strokeWidth={1.5} />
              </motion.button>
            )
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Status:</span>
            <span className="text-green-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Agent Online
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
