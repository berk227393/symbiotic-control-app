export class AudioPlayer {
  private audioContext: AudioContext | null = null
  private currentSource: AudioBufferSourceNode | null = null

  async playAudio(audioData: ArrayBuffer): Promise<void> {
    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext()
      }

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume()
      }

      const audioBuffer = await this.audioContext.decodeAudioData(audioData)

      this.stop() // Stop any currently playing audio

      this.currentSource = this.audioContext.createBufferSource()
      this.currentSource.buffer = audioBuffer
      this.currentSource.connect(this.audioContext.destination)
      this.currentSource.start()
    } catch (error) {
      console.error("Failed to play audio:", error)
      throw error
    }
  }

  stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop()
      } catch (e) {
        // Source might already be stopped
      }
      this.currentSource = null
    }
  }

  async createSilentAudio(durationMs = 1000): Promise<ArrayBuffer> {
    // Mock audio for fallback
    const sampleRate = 44100
    const samples = Math.floor((sampleRate * durationMs) / 1000)
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

    return buffer
  }
}
