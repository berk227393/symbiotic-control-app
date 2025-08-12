import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  // Mic state
  micState: "off" | "listening" | "processing"
  setMicState: (state: "off" | "listening" | "processing") => void

  // Voice settings
  voiceSettings: {
    speed: number
    stability: number
    similarity: number
  }
  setVoiceSettings: (settings: Partial<UIState["voiceSettings"]>) => void

  // App state
  language: string
  setLanguage: (lang: string) => void

  // Pairing
  pairingSid: string | null
  setPairingSid: (sid: string | null) => void
  isPaired: boolean
  setIsPaired: (paired: boolean) => void

  // Status
  latency: number
  setLatency: (ms: number) => void
  credits: number
  setCredits: (amount: number) => void
  agentOnline: boolean
  setAgentOnline: (online: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      micState: "off",
      setMicState: (state) => set({ micState: state }),

      voiceSettings: {
        speed: 1.0,
        stability: 0.5,
        similarity: 0.75,
      },
      setVoiceSettings: (settings) =>
        set((state) => ({
          voiceSettings: { ...state.voiceSettings, ...settings },
        })),

      language: "en",
      setLanguage: (lang) => set({ language: lang }),

      pairingSid: null,
      setPairingSid: (sid) => set({ pairingSid: sid }),
      isPaired: false,
      setIsPaired: (paired) => set({ isPaired: paired }),

      latency: 0,
      setLatency: (ms) => set({ latency: ms }),
      credits: 1000,
      setCredits: (amount) => set({ credits: amount }),
      agentOnline: true,
      setAgentOnline: (online) => set({ agentOnline: online }),
    }),
    {
      name: "agent-control-ui",
      partialize: (state) => ({
        voiceSettings: state.voiceSettings,
        language: state.language,
        pairingSid: state.pairingSid,
        isPaired: state.isPaired,
      }),
    },
  ),
)
