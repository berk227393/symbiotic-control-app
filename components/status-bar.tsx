"use client"

import { Mic } from "lucide-react"
import { useUIStore } from "../store/ui"

export function StatusBar() {
  const { micState, latency, credits, agentOnline } = useUIStore()

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur border-t border-gray-800">
      <div className="flex items-center justify-between max-w-md mx-auto text-sm">
        <div className="flex items-center gap-2">
          <Mic size={16} className={micState === "off" ? "text-gray-600" : "text-green-500"} />
          <span className="text-gray-400">
            {micState === "off" ? "Off" : micState === "listening" ? "Listening" : "Processing"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-400">{latency > 0 ? `${latency}ms` : "--ms"}</span>

          <span className="text-gray-400">{credits.toLocaleString()} credits</span>

          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${agentOnline ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-gray-400">{agentOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
