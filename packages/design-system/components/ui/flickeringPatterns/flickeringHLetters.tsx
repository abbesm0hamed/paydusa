"use client"

import { cn } from "@repo/design-system/lib/utils"
import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"

interface FlickeringHLettersProps extends React.HTMLAttributes<HTMLDivElement> {
  hSize?: number
  spacing?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
}

export const FlickeringHLetters: React.FC<FlickeringHLettersProps> = ({
  hSize = 12, // Size of each "H"
  spacing = 20, // Space between "H" letters
  flickerChance = 0.2,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  interface HLetter {
    x: number
    y: number
    opacity: number
    rotation: number // Slight rotation for cuteness
  }

  const hLetters = useRef<HLetter[]>([])

  const getRGBA = useCallback((color: string) => {
    if (typeof window === "undefined") return `rgba(0, 0, 0,`
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext("2d")
    if (!ctx) return "rgba(255, 0, 0,"
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
    return `rgba(${r}, ${g}, ${b},`
  }, [])

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      hLetters.current = []
      const stepX = hSize + spacing
      const stepY = hSize + spacing
      for (let x = 0; x < width * dpr; x += stepX) {
        for (let y = 0; y < height * dpr; y += stepY) {
          hLetters.current.push({
            x: x + Math.random() * 5 - 2.5, // Slight random offset for organic feel
            y: y + Math.random() * 5 - 2.5,
            opacity: Math.random() * maxOpacity,
            rotation: (Math.random() - 0.5) * 0.2, // Small rotation for cuteness
          })
        }
      }
      return { dpr }
    },
    [hSize, spacing, maxOpacity]
  )

  const updateHLetters = useCallback(
    (deltaTime: number) => {
      hLetters.current.forEach(h => {
        if (Math.random() < flickerChance * deltaTime) {
          h.opacity = Math.random() * maxOpacity
        }
      })
    },
    [flickerChance, maxOpacity]
  )

  const drawH = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: string, rotation: number) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    
    const halfSize = size / 2
    const barWidth = size / 4
    
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeStyle = opacity

    // Left vertical
    ctx.moveTo(-halfSize, -halfSize)
    ctx.lineTo(-halfSize, halfSize)
    
    // Right vertical
    ctx.moveTo(halfSize, -halfSize)
    ctx.lineTo(halfSize, halfSize)
    
    // Horizontal bar
    ctx.moveTo(-halfSize + barWidth / 2, 0)
    ctx.lineTo(halfSize - barWidth / 2, 0)
    
    ctx.stroke()
    ctx.restore()
  }

  const drawHLetters = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height)
      const rgba = getRGBA(color)
      hLetters.current.forEach(h => {
        drawH(ctx, h.x, h.y, hSize, `${rgba}${h.opacity})`, h.rotation)
      })
    },
    [color, hSize, getRGBA]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let params: ReturnType<typeof setupCanvas>

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth
      const newHeight = height || container.clientHeight
      setCanvasSize({ width: newWidth, height: newHeight })
      params = setupCanvas(canvas, newWidth, newHeight)
    }

    updateCanvasSize()

    let lastTime = 0
    const animate = (time: number) => {
      if (!isInView) return
      const deltaTime = (time - lastTime) / 1000
      lastTime = time
      updateHLetters(deltaTime)
      drawHLetters(ctx, canvas.width, canvas.height)
      animationFrameId = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(updateCanvasSize)
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 }
    )
    intersectionObserver.observe(canvas)

    if (isInView) animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [setupCanvas, updateHLetters, drawHLetters, width, height, isInView])

  return (
    <div ref={containerRef} className={cn(`h-full w-full ${className}`)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  )
}
