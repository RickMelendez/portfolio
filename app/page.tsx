"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail, Download, ExternalLink, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import BootScreen from "@/components/BootScreen"
import StarField from "@/components/StarField"
import BlackHolePortal from "@/components/BlackHolePortal"
import { GooeyText } from "@/components/ui/gooey-text-morphing"
import { SocialIcons } from "@/components/ui/social-icons"

// ---  Scroll reveal wrapper ---
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// --- Section heading ---
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="text-center mb-14">
      <h2
        className="text-3xl md:text-4xl font-orbitron font-bold inline-block"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #FF6B2B 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {children}
      </h2>
      <div className="mt-3 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-neon-orange to-transparent" />
    </Reveal>
  )
}

// --- Tech card ---
function TechCard({ category, items }: { category: string; items: string[] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel glass-panel-hover rounded-xl p-5"
    >
      <h3
        className="text-xs font-mono tracking-[0.25em] uppercase mb-4"
        style={{ color: "rgba(255, 107, 43, 0.8)" }}
      >
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="text-xs px-2.5 py-1 rounded-md font-mono"
            style={{
              background: "rgba(255, 107, 43, 0.08)",
              border: "1px solid rgba(255, 107, 43, 0.15)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// --- Project card ---
function ProjectCard({
  title,
  description,
  stack,
  points,
  link,
  badge,
}: {
  title: string
  description: string
  stack: string[]
  points: string[]
  link?: string
  badge?: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -6 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="relative glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col gap-4 h-full"
    >
      {badge && (
        <span
          className="absolute top-4 right-4 text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded"
          style={{
            background: "rgba(255,107,43,0.15)",
            border: "1px solid rgba(255,107,43,0.3)",
            color: "#FF6B2B",
          }}
        >
          {badge}
        </span>
      )}
      <div>
        <h3
          className="text-lg font-orbitron font-bold mb-2"
          style={{ color: "#ffffff" }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          {description}
        </p>
      </div>
      <ul className="space-y-1.5 flex-1">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span style={{ color: "#FF6B2B", flexShrink: 0 }}>▸</span>
            {p}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5 pt-2 border-t" style={{ borderColor: "rgba(255,107,43,0.1)" }}>
        {stack.map((s) => (
          <span
            key={s}
            className="text-[10px] px-2 py-0.5 rounded font-mono"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
      {link && (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-mono mt-1 hover:text-neon-orange transition-colors"
          style={{ color: "rgba(255,107,43,0.6)" }}
        >
          <ExternalLink className="h-3 w-3" />
          View Project
        </Link>
      )}
    </motion.div>
  )
}

// --- Experience timeline item ---
function ExperienceItem({
  role,
  company,
  location,
  period,
  points,
  isLast = false,
}: {
  role: string
  company: string
  location: string
  period: string
  points: string[]
  isLast?: boolean
}) {
  return (
    <Reveal>
      <div className="flex gap-6">
        {/* Timeline column */}
        <div className="flex flex-col items-center">
          <div
            className="w-3.5 h-3.5 rounded-full mt-1.5 flex-shrink-0"
            style={{
              background: "#FF6B2B",
              boxShadow: "0 0 12px rgba(255,107,43,0.8), 0 0 30px rgba(255,107,43,0.3)",
            }}
          />
          {!isLast && (
            <div
              className="w-px flex-1 mt-2"
              style={{
                background: "linear-gradient(180deg, rgba(255,107,43,0.4) 0%, transparent 100%)",
                minHeight: "40px",
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="glass-panel glass-panel-hover rounded-xl p-5 mb-6 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-lg font-orbitron font-bold text-white">{role}</h3>
              <p className="text-sm font-medium mt-0.5" style={{ color: "#FF6B2B" }}>
                {company}
                <span style={{ color: "rgba(255,255,255,0.35)" }}> — {location}</span>
              </p>
            </div>
            <span
              className="text-xs font-mono px-3 py-1 rounded-full flex-shrink-0"
              style={{
                background: "rgba(255,107,43,0.1)",
                border: "1px solid rgba(255,107,43,0.2)",
                color: "rgba(255,165,0,0.9)",
              }}
            >
              {period}
            </span>
          </div>
          <ul className="space-y-2">
            {points.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span style={{ color: "#FF6B2B", flexShrink: 0, fontSize: "10px", marginTop: "5px" }}>◆</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  )
}

// ============== MAIN PAGE ==============
export default function Home() {
  const [portfolioVisible, setPortfolioVisible] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

      if (sending) return

      if (!name || !email || !subject || !message) {
        setStatusMessage("Please fill all fields.")
        return
      }

      setSending(true)
      setStatusMessage(null)
      
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setStatusMessage("Message sent! I will get back to you soon.")
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err) {
      setStatusMessage("There was an error sending your message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen relative" style={{ background: "#050810" }}>
      {/* Boot screen */}
      <BootScreen onBootComplete={() => setPortfolioVisible(true)} />

      {/* Portfolio (reveals after boot) */}
      <AnimatePresence>
        {portfolioVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative"
          >
            <StarField />
            <BlackHolePortal />

            {/* Grid overlay */}
            <div
              className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,107,43,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,107,43,0.5) 1px, transparent 1px)
                `,
                backgroundSize: "80px 80px",
              }}
            />

            <div className="relative z-10">
              {/* ====== HERO ====== */}
              <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-col items-center gap-6 max-w-4xl mx-auto"
                >
                  {/* Avatar */}
                  <div className="relative w-32 h-32 mb-2">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(255,107,43,0.3) 0%, transparent 70%)",
                        animation: "glow-pulse 3s ease-in-out infinite",
                      }}
                    />
                    <div
                      className="w-full h-full rounded-full overflow-hidden"
                      style={{
                        border: "2px solid rgba(255,107,43,0.4)",
                        boxShadow: "0 0 25px rgba(255,107,43,0.3)",
                      }}
                    >
                      <Image
                        src="/profile.jpg"
                        alt="Ricardo Sánchez Meléndez"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        priority
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h1
                      className="text-5xl md:text-7xl font-orbitron font-black tracking-tight leading-none"
                      style={{
                        background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 50%, #FF6B2B 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Ricardo
                      <br />
                      <span style={{ fontSize: "0.65em" }}>Sánchez Meléndez</span>
                    </h1>
                  </motion.div>

                  {/* Morphing title */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="h-16 flex items-center"
                  >
                    <GooeyText
                      texts={[
                        "Full Stack Developer",
                        "Cloud & Serverless Engineer",
                        "AWS Lambda Specialist",
                        "AI-Powered Builder",
                        "Backend Systems Expert",
                      ]}
                      morphTime={1.2}
                      cooldownTime={2}
                      className="h-14 w-full"
                      textClassName="text-2xl md:text-3xl font-orbitron font-semibold"
                      style={{ color: "#FF6B2B" } as React.CSSProperties}
                    />
                  </motion.div>

                  {/* Tagline */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-base md:text-lg max-w-xl font-mono"
                    style={{ color: "rgba(255,255,255,0.45)", lineHeight: "1.7" }}
                  >
                    Software developer focused on building scalable backend systems,
                    serverless architectures, and AI-powered applications.
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex flex-wrap justify-center gap-3 mt-2"
                  >
                    <Button
                      asChild
                      className="font-orbitron font-bold text-xs tracking-widest px-6 h-11"
                      style={{
                        background: "linear-gradient(135deg, #FF6B2B, #FF3131)",
                        border: "none",
                        boxShadow: "0 0 20px rgba(255,107,43,0.4)",
                        color: "#fff",
                      }}
                    >
                      <a href="#projects">VIEW PROJECTS</a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="font-orbitron font-bold text-xs tracking-widest px-6 h-11"
                      style={{
                        borderColor: "rgba(255,107,43,0.4)",
                        color: "rgba(255,255,255,0.8)",
                        background: "rgba(255,107,43,0.05)",
                      }}
                    >
                      <a href="#contact">CONTACT ME</a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="h-11 w-11"
                      style={{
                        borderColor: "rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.03)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      <Link href="https://github.com/RickMelendez" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="h-11 w-11"
                      style={{
                        borderColor: "rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.03)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      <Link href="https://www.linkedin.com/in/ricardosanchez01" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="font-mono text-xs h-11 px-5"
                      style={{
                        borderColor: "rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.03)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      <Link href="https://docs.google.com/document/d/1k_jyD-9q1YfIbnD_xZRrx2BQk9tZ1jmS/edit?usp=sharing&ouid=111897677680154544833&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Resume
                      </Link>
                    </Button>
                  </motion.div>

                  {/* Location */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="flex items-center gap-1.5 text-xs font-mono"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    <MapPin className="h-3 w-3" style={{ color: "rgba(255,107,43,0.5)" }} />
                    Río Grande, Puerto Rico
                  </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute bottom-8 flex flex-col items-center gap-1"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  <span className="text-[10px] font-mono tracking-widest uppercase">scroll</span>
                  <ChevronDown className="h-4 w-4 animate-bounce" />
                </motion.div>
              </section>

              {/* ====== ABOUT ME ====== */}
              <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                  <SectionHeading>About Me</SectionHeading>
                  <div className="grid md:grid-cols-5 gap-8 items-start">
                    <Reveal delay={0.1} className="md:col-span-2 flex justify-center">
                      <div className="relative w-56 h-56">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "conic-gradient(from 0deg, #FF6B2B, #FF3131, #FF6B2B)",
                            padding: "2px",
                            borderRadius: "50%",
                          }}
                        >
                          <div
                            className="w-full h-full rounded-full overflow-hidden"
                            style={{ background: "#050810" }}
                          >
                            <Image
                              src="/profile.jpg"
                              alt="Ricardo Sánchez Meléndez"
                              width={224}
                              height={224}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div
                          className="absolute -inset-4 rounded-full opacity-20 pointer-events-none"
                          style={{
                            background: "radial-gradient(circle, rgba(255,107,43,0.4) 0%, transparent 70%)",
                            animation: "glow-pulse 4s ease-in-out infinite",
                          }}
                        />
                      </div>
                    </Reveal>

                    <Reveal delay={0.2} className="md:col-span-3 space-y-6">
                      <p
                        className="text-base leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        Ricardo Sánchez is a <span style={{ color: "#FF6B2B" }}>Full Stack Developer</span> specializing
                        in cloud-native architectures, backend systems, and AI-driven applications.
                        Trained at <span style={{ color: "rgba(255,255,255,0.85)" }}>Holberton School</span> with a foundation
                        in data structures, C programming, APIs, and DevOps.
                      </p>
                      <p
                        className="text-base leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        Currently at <span style={{ color: "#FF6B2B" }}>Evertec, Inc.</span> building serverless
                        financial integrations using AWS Lambda and TypeScript — implementing PCI-DSS compliant
                        systems, CI/CD pipelines, and AI-assisted development workflows.
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {[
                          "Serverless architecture",
                          "REST API development",
                          "Financial systems integration",
                          "AI-assisted dev workflows",
                          "Cloud infrastructure & CI/CD",
                          "Clean architecture patterns",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                            <span style={{ color: "#FF6B2B", fontSize: "8px" }}>◆</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  </div>
                </div>
              </section>

              {/* ====== TECH STACK ====== */}
              <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                  <SectionHeading>Tech Stack</SectionHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                      {
                        category: "Programming Languages",
                        items: ["TypeScript", "Python", "C", "SQL", "HTML", "CSS"],
                      },
                      {
                        category: "Backend & Frameworks",
                        items: ["Node.js", "Flask", "Express", "REST APIs", "Axios"],
                      },
                      {
                        category: "Cloud & Serverless",
                        items: ["AWS Lambda", "API Gateway", "DynamoDB", "CloudWatch", "CodePipeline", "CodeCommit"],
                      },
                      {
                        category: "DevOps & Deployment",
                        items: ["Docker", "GitHub Actions", "Cloudflare", "Railway", "Vercel", "Nginx"],
                      },
                      {
                        category: "Databases",
                        items: ["PostgreSQL", "MySQL", "Redis", "SQLite"],
                      },
                      {
                        category: "Testing & Tools",
                        items: ["Jest", "Vitest", "Postman", "ts-mockito", "Jira", "Git", "Linux"],
                      },
                      {
                        category: "AI Development",
                        items: ["Claude AI", "Claude Code", "GitHub Copilot", "Prompt Engineering"],
                      },
                      {
                        category: "Frontend",
                        items: ["React", "TailwindCSS", "ShadCN", "Recharts", "Framer Motion"],
                      },
                    ].map((cat, i) => (
                      <Reveal key={cat.category} delay={i * 0.07}>
                        <TechCard category={cat.category} items={cat.items} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>

              {/* ====== EXPERIENCE ====== */}
              <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                  <SectionHeading>Experience</SectionHeading>
                  <ExperienceItem
                    role="Software Developer"
                    company="Evertec, Inc."
                    location="San Juan, PR"
                    period="April 2025 – Present"
                    points={[
                      "Developed and maintained AWS Lambda functions in TypeScript/Node.js serving as middleware between banking systems and consumer applications",
                      "Built mock services using Python and DynamoDB to simulate endpoints, enabling parallel development and testing",
                      "Implemented regex-based input validation across multiple financial services to ensure PCI-DSS compliance",
                      "Wrote unit tests validating service logic, data mapping, and error handling across integration endpoints",
                      "Managed Git workflows including branch creation, merging, and code reviews using AWS CodeCommit and CI/CD pipelines",
                      "Monitored and debugged production services using CloudWatch logs and tested APIs with Postman",
                      "Utilized Claude Code and GitHub Copilot for AI-assisted code generation, debugging, and architectural design",
                    ]}
                    isLast
                  />

                  <Reveal delay={0.2}>
                    <div className="glass-panel rounded-xl p-5 mt-2">
                      <h4
                        className="text-xs font-mono tracking-[0.25em] uppercase mb-3 flex items-center gap-2"
                        style={{ color: "rgba(255,107,43,0.8)" }}
                      >
                        <span style={{ fontSize: "10px" }}>◆</span> Education
                      </h4>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-orbitron font-bold text-white">Holberton Coding School</p>
                          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                            Certificate — Foundations of Computer Science & Software Engineering
                          </p>
                          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                            San Juan, Puerto Rico
                          </p>
                        </div>
                        <span
                          className="text-xs font-mono px-3 py-1 rounded-full"
                          style={{
                            background: "rgba(255,107,43,0.1)",
                            border: "1px solid rgba(255,107,43,0.2)",
                            color: "rgba(255,165,0,0.9)",
                          }}
                        >
                          March 2025
                        </span>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </section>

              {/* ====== PROJECTS ====== */}
              <section id="projects" className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                  <SectionHeading>Projects</SectionHeading>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Reveal delay={0.1}>
                      <ProjectCard
                        title="FinPulse"
                        description="AI-Powered Personal Finance Platform with transaction tracking, smart budgets, and AI-generated financial insights."
                        badge="Latest"
                        stack={["Node.js", "TypeScript", "PostgreSQL", "React", "Supabase", "Claude AI", "Docker", "GitHub Actions"]}
                        points={[
                          "Full-stack budgeting platform with transaction tracking and analytics dashboard",
                          "REST API with clean architecture, input validation, and secure JWT authentication",
                          "Integrated Claude AI for spending summaries and financial trend analysis with caching",
                          "Responsive React dashboard with real-time charts using Recharts",
                          "CI/CD pipeline with GitHub Actions and Docker containerization",
                        ]}
                        link="https://fin-pulse-jet.vercel.app/"
                      />
                    </Reveal>
                    <Reveal delay={0.2}>
                      <ProjectCard
                        title="Website Monitor"
                        description="Real-time website monitoring platform that tracks uptime, performance metrics, and sends instant downtime alerts."
                        stack={["React", "TailwindCSS", "Flask", "SQLite", "Docker", "Cloudflare", "Recharts"]}
                        points={[
                          "Monitoring platform tracking website uptime and performance metrics",
                          "Backend APIs for monitoring jobs and real-time UI updates",
                          "Alerting system with logs and visualization dashboards using Recharts",
                          "Containerized with Docker and deployed via Cloudflare",
                        ]}
                        link="https://watchly-8x9.pages.dev"
                      />
                    </Reveal>
                    <Reveal delay={0.3}>
                      <ProjectCard
                        title="BarberMate"
                        description="Full-stack barber appointment booking platform that allows customers to create accounts and access a secure authentication system for booking and managing barber appointments."
                        stack={["Next.js", "React", "TypeScript", "TailwindCSS", "Vercel"]}
                        points={[
                          "Secure authentication system",
                          "Customer account creation and login",
                          "Appointment booking platform (future features)",
                          "Clean and responsive UI for booking services",
                        ]}
                        link="https://barbermate-app.vercel.app/auth"
                      />
                    </Reveal>
                  </div>
                </div>
              </section>

              {/* ====== CONTACT ====== */}
              <section id="contact" className="py-24 px-4">
                <div className="max-w-2xl mx-auto text-center">
                  <SectionHeading>Contact Me</SectionHeading>
                  <Reveal delay={0.1}>
                    <p
                      className="mb-10 text-sm font-mono"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      Let&apos;s build something great together.
                    </p>
                  </Reveal>

                  <Reveal delay={0.15} className="glass-panel rounded-2xl p-8 space-y-6 text-left">
                    {/* Contact info */}
                    <div className="space-y-3">
                      {[
                        {
                          icon: <Mail className="h-4 w-4" />,
                          label: "rickmelendez001@gmail.com",
                          href: "https://mail.google.com/mail/?view=cm&fs=1&to=rickmelendez001@gmail.com"
                        },
                        {
                          icon: <Github className="h-4 w-4" />,
                          label: "github.com/RickMelendez",
                          href: "https://github.com/RickMelendez"
                        },
                        {
                          icon: <Linkedin className="h-4 w-4" />,
                          label: "linkedin.com/in/ricardosanchez01",
                          href: "https://www.linkedin.com/in/ricardosanchez01"
                        },
                        ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          target={item.href.startsWith("mailto") ? undefined : "_blank"}
                          rel={item.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                          className="flex items-center gap-3 p-3 rounded-lg text-sm font-mono transition-all"
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            background: "rgba(255,107,43,0.03)",
                            border: "1px solid rgba(255,107,43,0.08)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.85)"
                            e.currentTarget.style.borderColor = "rgba(255,107,43,0.25)"
                            e.currentTarget.style.background = "rgba(255,107,43,0.07)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.5)"
                            e.currentTarget.style.borderColor = "rgba(255,107,43,0.08)"
                            e.currentTarget.style.background = "rgba(255,107,43,0.03)"
                          }}
                        >
                          <span style={{ color: "#FF6B2B" }}>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px" style={{ background: "rgba(255,107,43,0.1)" }} />
                      <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
                        or send a message
                      </span>
                      <div className="flex-1 h-px" style={{ background: "rgba(255,107,43,0.1)" }} />
                    </div>

                    {/* Contact form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          className="w-full px-4 py-2.5 rounded-lg text-sm font-mono outline-none transition-all"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,107,43,0.15)",
                            color: "rgba(255,255,255,0.8)",
                          }}
                          onFocus={(e) => { e.target.style.borderColor = "rgba(255,107,43,0.4)" }}
                          onBlur={(e) => { e.target.style.borderColor = "rgba(255,107,43,0.15)" }}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full px-4 py-2.5 rounded-lg text-sm font-mono outline-none transition-all"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,107,43,0.15)",
                            color: "rgba(255,255,255,0.8)",
                          }}
                          onFocus={(e) => { e.target.style.borderColor = "rgba(255,107,43,0.4)" }}
                          onBlur={(e) => { e.target.style.borderColor = "rgba(255,107,43,0.15)" }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Subject"
                        className="w-full px-4 py-2.5 rounded-lg text-sm font-mono outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,107,43,0.15)",
                          color: "rgba(255,255,255,0.8)",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "rgba(255,107,43,0.4)" }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(255,107,43,0.15)" }}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                      <textarea
                        placeholder="Message"
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-lg text-sm font-mono outline-none transition-all resize-none"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,107,43,0.15)",
                          color: "rgba(255,255,255,0.8)",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "rgba(255,107,43,0.4)" }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(255,107,43,0.15)" }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full py-3 rounded-lg font-orbitron font-bold text-xs tracking-widest uppercase text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #FF6B2B, #FF3131)",
                          boxShadow: "0 0 20px rgba(255,107,43,0.3)",
                        }}
                        onMouseEnter={(e) => {
                          if (!sending) {
                            e.currentTarget.style.boxShadow = "0 0 35px rgba(255,107,43,0.5)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!sending) {
                            e.currentTarget.style.boxShadow = "0 0 20px rgba(255,107,43,0.3)"
                          }
                        }}
                        >
                        {sending ? "Sending..." : "Send Message"}
                      </button>
                      {statusMessage && (
                        <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>{statusMessage}</p>
                      )}
                    </form>
                  </Reveal>
                </div>
              </section>

              {/* ====== FOOTER ====== */}
              <footer className="py-10 px-4">
                <div className="max-w-6xl mx-auto">
                  {/* Glowing divider */}
                  <div
                    className="h-px mb-8"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,107,43,0.5), rgba(255,49,49,0.3), rgba(255,107,43,0.5), transparent)",
                      boxShadow: "0 0 8px rgba(255,107,43,0.3)",
                    }}
                  />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p
                      className="text-xs font-mono tracking-widest"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      © {new Date().getFullYear()} Ricardo Sánchez Meléndez. All rights reserved.
                    </p>
                    <SocialIcons />
                    <p
                      className="text-xs font-mono"
                      style={{ color: "rgba(255,255,255,0.15)" }}
                    >
                      Built with Next.js + TailwindCSS
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
