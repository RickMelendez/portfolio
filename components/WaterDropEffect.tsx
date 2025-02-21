"use client"

import React, { useState, useCallback } from "react"

interface WaterDropEffectProps {
  children: React.ReactNode
}

const WaterDropEffect: React.FC<WaterDropEffectProps> = ({ children }) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; size: number }[]>([])

  const addRipple = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect()
    const size = rippleContainer.width > rippleContainer.height ? rippleContainer.width : rippleContainer.height
    const x = event.clientX - rippleContainer.left - size / 2
    const y = event.clientY - rippleContainer.top - size / 2
    const newRipple = { x, y, size }

    setRipples((prevRipples) => [...prevRipples, newRipple])
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (ripples.length > 0) {
        setRipples((prevRipples) => prevRipples.slice(1))
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [ripples])

  return (
    <div
      className="relative overflow-hidden rounded-full cursor-pointer"
      onMouseDown={addRipple}
      style={{ touchAction: "none" }}
    >
      {children}
      {ripples.map((ripple, index) => (
        <span
          key={index}
          style={{
            position: "absolute",
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            transform: "scale(0)",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.3)",
            animation: "ripple 1000ms linear",
          }}
        />
      ))}
    </div>
  )
}

export default WaterDropEffect

