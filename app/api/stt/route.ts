import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 })
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      // 25MB limit
      return NextResponse.json({ error: "Audio file too large (max 25MB)" }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      // Mock response for development
      const mockTranscripts = [
        "Hello, how are you today?",
        "What's the weather like?",
        "Can you help me with something?",
        "This is a test message.",
        "I'm speaking into the microphone.",
        "Thank you for your assistance.",
      ]

      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      return NextResponse.json({ text: `${randomTranscript} (Mock transcript - add GROQ_API_KEY for real STT)` })
    }

    const whisperFormData = new FormData()
    whisperFormData.append("file", audioFile)
    whisperFormData.append("model", "whisper-large-v3") // Using latest Whisper model
    whisperFormData.append("response_format", "json")
    whisperFormData.append("language", "auto") // Auto-detect language instead of forcing English

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: whisperFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Groq Whisper API error:", response.status, errorData)
      throw new Error(`Groq Whisper API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.text?.trim() || "Could not transcribe audio."

    return NextResponse.json({
      text,
      confidence: data.confidence || null,
      language: data.language || "unknown",
    })
  } catch (error) {
    console.error("STT API error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
