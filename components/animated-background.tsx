"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Wave parameters
    const waves = [
      { amplitude: 50, frequency: 0.02, speed: 0.01, color: "rgba(156, 163, 175, 0.1)" },
      { amplitude: 30, frequency: 0.03, speed: 0.015, color: "rgba(107, 114, 128, 0.08)" },
      { amplitude: 20, frequency: 0.04, speed: 0.02, color: "rgba(75, 85, 99, 0.06)" },
    ]

    let animationFrameId: number
    let time = 0

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        for (let x = 0; x < canvas.width; x += 10) {
          const y = canvas.height - 200 + wave.amplitude * Math.sin(x * wave.frequency + time * wave.speed)
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fillStyle = wave.color
        ctx.fill()
      })

      time += 1
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}
