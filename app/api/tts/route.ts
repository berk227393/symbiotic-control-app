import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, speed = 1.0, stability = 0.5, similarity = 0.75 } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const elevenlabsApiKey = process.env.ELEVENLABS_API_KEY
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "g5CIjZEefAph4nQFvHAz" // Added default voice ID from user's config

    if (!elevenlabsApiKey) {
      // Mock response - return silent audio
      const sampleRate = 44100
      const duration = Math.max(1, Math.min(10, text.length / 10)) // 1-10 seconds based on text length
      const samples = Math.floor(sampleRate * duration)
      const buffer = new ArrayBuffer(44 + samples * 2)
      const view = new DataView(buffer)

      // WAV header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i))
        }
      }

      writeString(0, "RIFF")
      view.setUint32(4, 36 + samples * 2, true)
      writeString(8, "WAVE")
      writeString(12, "fmt ")
      view.setUint32(16, 16, true)
      view.setUint16(20, 1, true)
      view.setUint16(22, 1, true)
      view.setUint32(24, sampleRate, true)
      view.setUint32(28, sampleRate * 2, true)
      view.setUint16(32, 2, true)
      view.setUint16(34, 16, true)
      writeString(36, "data")
      view.setUint32(40, samples * 2, true)

      // Silent samples
      for (let i = 0; i < samples; i++) {
        view.setInt16(44 + i * 2, 0, true)
      }

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "audio/wav",
        },
      })
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": elevenlabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5", // Using latest turbo model for faster generation
        voice_settings: {
          stability: Math.max(0, Math.min(1, stability)), // Ensure values are within valid range
          similarity_boost: Math.max(0, Math.min(1, similarity)),
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("ElevenLabs API error:", response.status, errorData)
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600", // Added caching for better performance
      },
    })
  } catch (error) {
    console.error("TTS API error:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
