
"use client"

import { cn } from "@repo/design-system/lib/utils"
import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"

interface FlickeringHexMeshProps extends React.HTMLAttributes<HTMLDivElement> {
  hexSize?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
}

export const FlickeringHexMesh: React.FC<FlickeringHexMeshProps> = ({
  hexSize = 10,
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

  interface Hex {
    x: number
    y: number
    opacity: number
  }

  const hexes = useRef<Hex[]>([])

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

      hexes.current = []
      const hexWidth = hexSize * 1.5
      const hexHeight = hexSize * Math.sqrt(3)
      for (let x = 0; x < width * dpr; x += hexWidth) {
        for (let y = 0; y < height * dpr; y += hexHeight) {
          hexes.current.push({
            x: x + (y % (hexHeight * 2) === 0 ? 0 : hexWidth / 2),
            y,
            opacity: Math.random() * maxOpacity,
          })
        }
      }
      return { dpr }
    },
    [hexSize, maxOpacity]
  )

  const updateHexes = useCallback(
    (deltaTime: number) => {
      hexes.current.forEach(hex => {
        if (Math.random() < flickerChance * deltaTime) {
          hex.opacity = Math.random() * maxOpacity
        }
      })
    },
    [flickerChance, maxOpacity]
  )

  const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: string) => {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      const px = x + size * Math.cos(angle)
      const py = y + size * Math.sin(angle)
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.strokeStyle = opacity
    ctx.lineWidth = 1
    ctx.stroke()
  }

  const drawHexMesh = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height)
      const rgba = getRGBA(color)
      hexes.current.forEach(hex => {
        drawHex(ctx, hex.x, hex.y, hexSize, `${rgba}${hex.opacity})`)
      })
    },
    [color, hexSize, getRGBA]
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
      updateHexes(deltaTime)
      drawHexMesh(ctx, canvas.width, canvas.height)
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
  }, [setupCanvas, updateHexes, drawHexMesh, width, height, isInView])

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
