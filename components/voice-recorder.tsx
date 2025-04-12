"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Square, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceRecorderProps {
  onComplete: (transcript: string) => void
}

export default function VoiceRecorder({ onComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [audioLevel, setAudioLevel] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio context for visualization
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      // Start visualization
      visualize()

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)

      // Use SpeechRecognition API for transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          setTranscript(finalTranscript || interimTranscript)
        }

        recognition.start()

        mediaRecorderRef.current.onstop = () => {
          recognition.stop()
          stream.getTracks().forEach((track) => track.stop())
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check your permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const WIDTH = canvas.width
    const HEIGHT = canvas.height
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!analyserRef.current) return

      animationFrameRef.current = requestAnimationFrame(draw)
      analyserRef.current.getByteFrequencyData(dataArray)

      // Calculate average level
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const average = sum / bufferLength
      setAudioLevel(average / 256) // Normalize to 0-1

      // Clear canvas
      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      // Draw dynamic circle that changes shape based on audio
      const centerX = WIDTH / 2
      const centerY = HEIGHT / 2
      const baseRadius = 80

      ctx.beginPath()

      // Create a dynamic shape with spikes based on audio levels
      for (let i = 0; i < 360; i += 10) {
        const angle = (i * Math.PI) / 180
        const spikeHeight = isRecording ? 20 * audioLevel * (0.5 + Math.random() * 0.5) : 0
        const radius = baseRadius + spikeHeight

        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.fillStyle = "black"
      ctx.fill()

      // Draw microphone icon in the center
      ctx.fillStyle = "white"
      ctx.font = "24px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("🎤", centerX, centerY)
    }

    draw()
  }

  const handleSubmit = () => {
    onComplete(transcript)
  }

  return (
    <div className="flex flex-col items-center p-4">
      <canvas ref={canvasRef} width={300} height={300} className="mb-4" />

      <div className="w-full max-w-md bg-gray-50 rounded-xl p-3 mb-4 min-h-[100px] text-center">
        {transcript ? (
          transcript
        ) : (
          <span className="text-gray-400">
            {isRecording ? "Listening..." : "Press the microphone button to start recording"}
          </span>
        )}
      </div>

      <div className="flex gap-4">
        {isRecording ? (
          <Button variant="destructive" className="rounded-full" onClick={stopRecording}>
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        ) : (
          <Button variant="default" className="rounded-full bg-black hover:bg-gray-800" onClick={startRecording}>
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}

        {transcript && !isRecording && (
          <Button variant="default" className="rounded-full bg-black hover:bg-gray-800" onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        )}
      </div>
    </div>
  )
}
