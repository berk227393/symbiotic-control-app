import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, systemPrompt } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      // Mock response for development
      const mockReplies = [
        "Hello! I'm your AI assistant. How can I help you today?",
        "That's an interesting question. Let me think about that...",
        "I understand what you're asking. Here's my response:",
        "Thanks for sharing that with me. I appreciate your input.",
        "I'm here to help! Is there anything specific you'd like to know?",
      ]

      const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      return NextResponse.json({ reply: `${randomReply} (Mock response - add GROQ_API_KEY for real AI)` })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // Updated to use LLaMA-3 70B model for better responses
        messages: [
          {
            role: "system",
            content: systemPrompt || "You are a helpful AI assistant. Keep responses concise and friendly.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 1000, // Increased token limit for more detailed responses
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Groq API error:", response.status, errorData)
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices[0]?.message?.content || "I couldn't generate a response."

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("LLM API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
