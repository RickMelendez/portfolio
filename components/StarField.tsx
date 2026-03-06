"use client"

import React, { useEffect, useRef } from "react"

export default function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId: number

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener("resize", resize)

        // Star particles
        const stars = Array.from({ length: 200 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.2,
            opacity: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 0.3 + 0.05,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinkleOffset: Math.random() * Math.PI * 2,
        }))

        let frame = 0

        const draw = () => {
            // Dark cosmic gradient background
            const gradient = ctx.createRadialGradient(
                canvas.width * 0.4, canvas.height * 0.3, 0,
                canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
            )
            gradient.addColorStop(0, "rgba(12, 18, 45, 1)")
            gradient.addColorStop(0.4, "rgba(5, 8, 16, 1)")
            gradient.addColorStop(1, "rgba(2, 3, 8, 1)")

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Nebula glow — orange/red accent top right
            const nebula = ctx.createRadialGradient(
                canvas.width * 0.75, canvas.height * 0.2, 0,
                canvas.width * 0.75, canvas.height * 0.2, canvas.width * 0.35
            )
            nebula.addColorStop(0, "rgba(255, 80, 20, 0.06)")
            nebula.addColorStop(0.5, "rgba(180, 30, 10, 0.03)")
            nebula.addColorStop(1, "rgba(0, 0, 0, 0)")
            ctx.fillStyle = nebula
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Nebula glow — bottom left
            const nebula2 = ctx.createRadialGradient(
                canvas.width * 0.1, canvas.height * 0.8, 0,
                canvas.width * 0.1, canvas.height * 0.8, canvas.width * 0.3
            )
            nebula2.addColorStop(0, "rgba(20, 50, 120, 0.06)")
            nebula2.addColorStop(1, "rgba(0, 0, 0, 0)")
            ctx.fillStyle = nebula2
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw stars
            stars.forEach((star) => {
                const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset)
                const currentOpacity = star.opacity * (0.7 + 0.3 * twinkle)

                ctx.beginPath()
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
                ctx.fill()

                // Slow drift
                star.y += star.speed
                if (star.y > canvas.height) {
                    star.y = 0
                    star.x = Math.random() * canvas.width
                }
            })

            frame++
            animationId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    )
}
