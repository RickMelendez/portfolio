"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { PremiumToggle } from "@/components/ui/bouncy-toggle"
import { BouncingDots } from "@/components/ui/bouncing-dots"
import StarField from "@/components/StarField"

interface BootScreenProps {
    onBootComplete: () => void
}

const BOOT_MESSAGES = [
    "Initializing system...",
    "Loading neural interface...",
    "Connecting to portfolio database...",
    "Authenticating credentials...",
    "Rendering environment...",
    "Access granted. Welcome.",
]

export default function BootScreen({ onBootComplete }: BootScreenProps) {
    const [isToggled, setIsToggled] = useState(false)
    const [bootPhase, setBootPhase] = useState<"idle" | "booting" | "done">("idle")
    const [messageIndex, setMessageIndex] = useState(0)
    const [showDots, setShowDots] = useState(false)

    const handleToggle = (checked: boolean) => {
        if (!checked) return
        setIsToggled(true)
        setBootPhase("booting")
        setShowDots(true)
    }

    useEffect(() => {
        if (bootPhase !== "booting") return

        let i = 0
        const interval = setInterval(() => {
            i++
            setMessageIndex(i)
            if (i >= BOOT_MESSAGES.length - 1) {
                clearInterval(interval)
                setTimeout(() => {
                    setBootPhase("done")
                    setTimeout(onBootComplete, 800)
                }, 600)
            }
        }, 420)

        return () => clearInterval(interval)
    }, [bootPhase, onBootComplete])

    return (
        <AnimatePresence>
            {bootPhase !== "done" && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <StarField />

                    {/* Scan line overlay */}
                    {bootPhase === "booting" && (
                        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                            <div
                                className="absolute left-0 right-0 h-[2px] opacity-30"
                                style={{
                                    background: "linear-gradient(90deg, transparent, #FF6B2B, transparent)",
                                    animation: "scan-line 2s linear infinite",
                                }}
                            />
                        </div>
                    )}

                    {/* Grid overlay */}
                    <div
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(255,107,43,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,107,43,0.3) 1px, transparent 1px)
              `,
                            backgroundSize: "60px 60px",
                        }}
                    />

                    <div className="relative z-20 flex flex-col items-center gap-12 px-4 text-center">
                        {/* Status text */}
                        <AnimatePresence mode="wait">
                            {bootPhase === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div
                                        className="text-xs font-mono tracking-[0.4em] uppercase"
                                        style={{ color: "rgba(255, 49, 49, 0.7)" }}
                                    >
                                        ● SYSTEM OFFLINE
                                    </div>
                                    <div
                                        className="text-xs font-mono tracking-widest uppercase"
                                        style={{ color: "rgba(255, 255, 255, 0.25)" }}
                                    >
                                        Activate interface
                                    </div>
                                </motion.div>
                            )}

                            {bootPhase === "booting" && (
                                <motion.div
                                    key="booting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div
                                        className="text-xs font-mono tracking-[0.4em] uppercase"
                                        style={{ color: "rgba(255, 165, 0, 0.9)" }}
                                    >
                                        ◉ SYSTEM ONLINE
                                    </div>
                                    <motion.div
                                        key={messageIndex}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-xs font-mono"
                                        style={{ color: "rgba(255, 255, 255, 0.6)" }}
                                    >
                                        <span style={{ color: "#FF6B2B" }}>&gt;</span>{" "}
                                        {BOOT_MESSAGES[Math.min(messageIndex, BOOT_MESSAGES.length - 1)]}
                                        <span className="animate-text-blink">_</span>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Central power element */}
                        <div className="flex flex-col items-center gap-8">
                            {/* Outer glow ring */}
                            <div className="relative flex items-center justify-center">
                                <div
                                    className="absolute rounded-full"
                                    style={{
                                        width: "180px",
                                        height: "180px",
                                        background: isToggled
                                            ? "radial-gradient(circle, rgba(255,107,43,0.15) 0%, transparent 70%)"
                                            : "radial-gradient(circle, rgba(255,49,49,0.08) 0%, transparent 70%)",
                                        animation: isToggled ? "glow-pulse 2s ease-in-out infinite" : "glow-pulse-red 2.5s ease-in-out infinite",
                                        transition: "all 0.5s ease",
                                    }}
                                />

                                {/* Middle ring */}
                                <div
                                    className="absolute rounded-full border"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        borderColor: isToggled
                                            ? "rgba(255, 107, 43, 0.3)"
                                            : "rgba(255, 49, 49, 0.15)",
                                        transition: "all 0.5s ease",
                                    }}
                                />

                                {/* Toggle container */}
                                <div
                                    className="relative flex flex-col items-center gap-3 z-10 p-8 rounded-2xl"
                                    style={{
                                        background: "rgba(5, 8, 16, 0.8)",
                                        border: `1px solid ${isToggled ? "rgba(255, 107, 43, 0.3)" : "rgba(255, 49, 49, 0.15)"}`,
                                        boxShadow: isToggled
                                            ? "0 0 30px rgba(255, 107, 43, 0.2), inset 0 0 20px rgba(255, 107, 43, 0.05)"
                                            : "0 0 20px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.3)",
                                        transition: "all 0.5s ease",
                                        backdropFilter: "blur(16px)",
                                    }}
                                >
                                    <div
                                        className="text-[9px] font-mono tracking-[0.3em] uppercase mb-1"
                                        style={{ color: "rgba(255,255,255,0.25)" }}
                                    >
                                        power control
                                    </div>

                                    <div className="transform scale-125">
                                        <PremiumToggle
                                            defaultChecked={false}
                                            onChange={handleToggle}
                                        />
                                    </div>

                                    <div
                                        className="text-[9px] font-mono tracking-[0.25em] uppercase mt-1"
                                        style={{
                                            color: isToggled ? "rgba(255, 165, 0, 0.8)" : "rgba(255, 49, 49, 0.5)",
                                            transition: "color 0.5s ease",
                                        }}
                                    >
                                        {isToggled ? "● online" : "○ offline"}
                                    </div>
                                </div>
                            </div>

                            {/* Loading dots */}
                            <AnimatePresence>
                                {showDots && bootPhase === "booting" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <BouncingDots
                                            dots={3}
                                            className="bg-neon-orange w-2 h-2"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Name hint */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: bootPhase === "idle" ? 1 : 0 }}
                            transition={{ delay: 1.5 }}
                            className="text-center"
                        >
                            <h1
                                className="text-4xl font-orbitron font-bold tracking-wider"
                                style={{
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,107,43,0.2))",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                RSM
                            </h1>
                            <p
                                className="text-[10px] font-mono tracking-[0.5em] uppercase mt-2"
                                style={{ color: "rgba(255,255,255,0.1)" }}
                            >
                                Portfolio v2.0
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
