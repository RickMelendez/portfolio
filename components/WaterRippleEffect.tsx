"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface WaterRippleEffectProps {
  children: React.ReactNode
}

const WaterRippleEffect: React.FC<WaterRippleEffectProps> = ({ children }) => {
  const [isRippling, setIsRippling] = useState(false)
  const rippleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ripple = rippleRef.current
    if (!ripple) return

    const handleAnimationEnd = () => setIsRippling(false)
    ripple.addEventListener("animationend", handleAnimationEnd)

    return () => {
      ripple.removeEventListener("animationend", handleAnimationEnd)
    }
  }, [])

  const handleInteraction = () => {
    if (!isRippling) {
      setIsRippling(true)
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-full cursor-pointer"
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {children}
      <div
        ref={rippleRef}
        className={`absolute inset-0 bg-blue-500 opacity-30 ${isRippling ? "animate-ripple" : ""}`}
      />
    </div>
  )
}

export default WaterRippleEffect

