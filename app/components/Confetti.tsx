'use client'

import { useEffect, useRef } from 'react'

interface ConfettiProps {
  numberOfPieces?: number
  colors?: string[]
}

export default function Confetti({ 
  numberOfPieces = 200,
  colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create confetti pieces
    const pieces = Array.from({ length: numberOfPieces }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 6 + 4,
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 4 - 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2
    }))

    let animationFrame: number

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let activePieces = 0

      pieces.forEach(piece => {
        if (piece.y < canvas.height) {
          activePieces++

          ctx.save()
          ctx.translate(piece.x, piece.y)
          ctx.rotate((piece.rotation * Math.PI) / 180)
          
          ctx.fillStyle = piece.color
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
          
          ctx.restore()

          piece.y += piece.speedY
          piece.x += piece.speedX
          piece.rotation += piece.rotationSpeed
          piece.speedY += 0.1 // gravity
        }
      })

      if (activePieces > 0) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [colors, numberOfPieces])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  )
} 