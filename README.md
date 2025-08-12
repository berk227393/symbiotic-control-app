# Agent Control PWA

AI Agent Control Panel - Web & Mobile Progressive Web App

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# AI Services
GROQ_API_KEY=your_groq_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
ELEVENLABS_MODEL=eleven_turbo_v2_5

# Database (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
\`\`\`

**Note:** If environment variables are not provided, the app will use mock responses for development.

## Features

- 🎮 **Control Dashboard**: 3×4 grid of control buttons
- 💬 **Chat**: Text-to-text AI conversations
- 🔊 **TTS**: Text-to-speech with ElevenLabs
- 🎤 **STT**: Speech-to-text with Groq Whisper
- 🗣️ **STS**: Speech-to-speech (voice conversations)
- 🧠 **Brain**: System prompt and persona management
- 🛍️ **Store**: Virtual items and clothing
- 👤 **Profile**: User profile management
- ⚙️ **Settings**: Voice and app preferences
- 📱 **Pair**: QR code device pairing
- 📊 **Status**: System status and metrics

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## PWA Installation

The app can be installed as a PWA on mobile devices and desktop browsers.

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- Zustand (State Management)
- SWR (Data Fetching)
- Lucide React (Icons)
- PWA Support
