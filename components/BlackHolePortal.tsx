"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"

/* ─── skills marquee data ──────────────────────────────────────────── */
const SKILLS = [
  "Python", "Pygame", "Game Design", "Grid Systems",
  "Procedural Generation", "Cellular Automata", "Game Loop Architecture",
  "Collision Detection", "AI Pathfinding", "Pixel Art",
  "Unity (Learning)", "Game Math", "Level Design",
]

/* ─── canvas hooks ─────────────────────────────────────────────────── */
function useCRMBLCanvas(ref: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext("2d")!
    const COLS = 22, ROWS = 12
    const EMPTY = 0, ACTIVE_C = 1, CORRUPT = 2, PART = 3
    type Cell = 0 | 1 | 2 | 3
    let grid: Cell[][], char = { row: ROWS - 3, col: Math.floor(COLS / 2) }
    let frame = 0, raf = 0

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    const initGrid = () => {
      grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(EMPTY)) as Cell[][]
        ;[[0, 0], [0, 1], [1, 0], [0, COLS - 1], [1, COLS - 1], [ROWS - 1, 0], [ROWS - 2, 0], [ROWS - 1, COLS - 1]].forEach(([r, c]) => grid[r][c] = CORRUPT)
      for (let i = 0; i < 8; i++) { let r: number, c: number; do { r = ~~(Math.random() * ROWS); c = ~~(Math.random() * COLS) } while (grid[r][c] || (r === char.row && c === char.col)); grid[r][c] = PART }
      for (let i = 0; i < 12; i++) { let r: number, c: number; do { r = ~~(Math.random() * ROWS); c = ~~(Math.random() * COLS) } while (grid[r][c] || (r === char.row && c === char.col)); grid[r][c] = ACTIVE_C }
    }
    const spread = () => {
      const d = [[-1, 0], [1, 0], [0, -1], [0, 1]], cands: number[][] = []
      for (let r = 0; r < ROWS; r++)for (let c = 0; c < COLS; c++)if (grid[r][c] === CORRUPT) d.forEach(([dr, dc]) => { const nr = r + dr, nc = c + dc; if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !grid[nr][nc]) cands.push([nr, nc]) })
      if (cands.length && Math.random() < .35) { const [r, c] = cands[~~(Math.random() * cands.length)]; grid[r][c] = CORRUPT }
    }
    const move = () => {
      const d = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      const pass = d.filter(([dr, dc]) => { const nr = char.row + dr, nc = char.col + dc; return nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] !== ACTIVE_C && grid[nr][nc] !== CORRUPT })
      if (!pass.length) return
      let best: number[] | null = null, bd = Infinity
      for (let r = 0; r < ROWS; r++)for (let c = 0; c < COLS; c++)if (grid[r][c] === PART) { const dist = Math.abs(r - char.row) + Math.abs(c - char.col); if (dist < bd) { bd = dist; best = [r, c] } }
      if (best) pass.sort(([a0, a1], [b0, b1]) => Math.abs((char.row + a0) - best![0]) + Math.abs((char.col + a1) - best![1]) - Math.abs((char.row + b0) - best![0]) - Math.abs((char.col + b1) - best![1]) + (Math.random() - .5) * 2)
      char.row += pass[0][0]; char.col += pass[0][1]
      if (grid[char.row][char.col] === PART) grid[char.row][char.col] = EMPTY
    }
    const draw = () => {
      const cw = (canvas.width - 16) / COLS, ch = (canvas.height - 16) / ROWS, ox = 8, oy = 8, t = frame * .04
      ctx.fillStyle = "#030208"; ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "rgba(18,14,36,.9)"; ctx.lineWidth = .5
      for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(ox, oy + r * ch); ctx.lineTo(ox + COLS * cw, oy + r * ch); ctx.stroke() }
      for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(ox + c * cw, oy); ctx.lineTo(ox + c * cw, oy + ROWS * ch); ctx.stroke() }
      for (let r = 0; r < ROWS; r++)for (let c = 0; c < COLS; c++) {
        const x = ox + c * cw + 1, y = oy + r * ch + 1, w = cw - 2, h = ch - 2
        if (grid[r][c] === ACTIVE_C) { ctx.fillStyle = `rgba(50,40,90,${.5 + .2 * Math.sin(t + r + c)})`; ctx.fillRect(x, y, w, h) }
        else if (grid[r][c] === CORRUPT) { ctx.fillStyle = `rgba(200,20,30,${.65 + .25 * Math.sin(t * 2 + r * .5 + c * .3)})`; ctx.shadowColor = "#c01428"; ctx.shadowBlur = 5; ctx.fillRect(x, y, w, h); ctx.shadowBlur = 0 }
        else if (grid[r][c] === PART) { const s = .7 + .3 * Math.sin(t * 3 + r + c); ctx.fillStyle = `rgba(232,255,0,${s})`; ctx.shadowColor = "#e8ff00"; ctx.shadowBlur = 8; ctx.fillRect(x + w * .25, y + h * .25, w * .5, h * .5); ctx.shadowBlur = 0 }
      }
      const cx = ox + char.col * cw + cw / 2, cy = oy + char.row * ch + ch / 2, cr = Math.min(cw, ch) * (.28 + .04 * Math.sin(t * 4))
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2)
      ctx.fillStyle = "#e8ff00"; ctx.shadowColor = "#e8ff00"; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0
      frame++
    }
    const tick = () => { frame++; if (frame % 30 === 0) move(); if (frame % 90 === 0) spread(); draw(); raf = requestAnimationFrame(tick) }
    resize(); initGrid(); raf = requestAnimationFrame(tick)
    window.addEventListener("resize", resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [active, ref])
}

function useParticleCanvas(ref: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext("2d")!
    let particles: { x: number, y: number, vx: number, vy: number, r: number, a: number }[] = []
    let raf = 0
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    const init = () => {
      particles = Array.from({ length: 30 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6, r: Math.random() * 1.5 + .5, a: Math.random() }))
    }
    const tick = () => {
      ctx.fillStyle = "rgba(3,2,8,.3)"; ctx.fillRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.a += .015
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        const a = (.4 + .4 * Math.sin(p.a)) * .35
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(56,189,248,${a})`; ctx.fill()
      })
      for (let i = 0; i < particles.length; i++)for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 50) { ctx.strokeStyle = `rgba(56,189,248,${(.25 * (1 - dist / 50)) * .3})`; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke() }
      }
      raf = requestAnimationFrame(tick)
    }
    resize(); init(); raf = requestAnimationFrame(tick)
    window.addEventListener("resize", () => { resize(); init() })
    return () => { cancelAnimationFrame(raf) }
  }, [active, ref])
}

function useHexCanvas(ref: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext("2d")!
    let t = 0, raf = 0
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    const tick = () => {
      t += .008
      ctx.fillStyle = "#030208"; ctx.fillRect(0, 0, canvas.width, canvas.height)
      const size = 22, cols = Math.ceil(canvas.width / size) + 2, rows = Math.ceil(canvas.height / size) + 2
      for (let r = 0; r < rows; r++)for (let c = 0; c < cols; c++) {
        const x = c * size, y = r * size, wave = Math.sin(t + r * .4 + c * .3), a = (.08 + .06 * wave) * .8
        ctx.strokeStyle = `rgba(167,139,250,${a})`; ctx.lineWidth = .5; ctx.beginPath()
        for (let i = 0; i < 6; i++) { const ang = Math.PI / 3 * i + t * .2; ctx.lineTo(x + size * .45 * Math.cos(ang), y + size * .45 * Math.sin(ang)) }
        ctx.closePath(); ctx.stroke()
      }
      raf = requestAnimationFrame(tick)
    }
    resize(); raf = requestAnimationFrame(tick)
    window.addEventListener("resize", resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [active, ref])
}

/* ─── component ────────────────────────────────────────────────────── */
export default function BlackHolePortal() {
  const [mode, setMode] = useState<"idle" | "sucking" | "gamedev">("idle")
  const bhRef = useRef<HTMLDivElement>(null)
  const crmblRef = useRef<HTMLCanvasElement>(null)
  const particleRef = useRef<HTMLCanvasElement>(null)
  const hexRef = useRef<HTMLCanvasElement>(null)

  useCRMBLCanvas(crmblRef, mode === "gamedev")
  useParticleCanvas(particleRef, mode === "gamedev")
  useHexCanvas(hexRef, mode === "gamedev")

  const enter = useCallback(() => {
    if (mode !== "idle") return
    setMode("sucking")
    setTimeout(() => setMode("gamedev"), 1100)
  }, [mode])

  const returnToMain = useCallback(() => setMode("idle"), [])

  return (
    <>
      <style>{`
        @keyframes bh-disk-spin  { to { transform:rotate(360deg); } }
        @keyframes bh-ring1      { to { transform:rotate(360deg); } }
        @keyframes bh-ring2      { to { transform:rotate(-360deg); } }
        @keyframes bh-halo-pulse { 0%,100%{transform:scale(.95);opacity:.6} 50%{transform:scale(1.1);opacity:1} }
        @keyframes bh-swallow    { 0%{transform:scale(1)} 30%{transform:scale(2.5)} 60%{transform:scale(10)} 100%{transform:scale(45);opacity:.9} }
        @keyframes gd-marquee    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes gd-blink-border { 0%,100%{border-color:rgba(232,255,0,.2)} 50%{border-color:rgba(232,255,0,.05)} }
        @keyframes gd-blink-dot  { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes gd-badge-pulse{ 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes gd-bar-scan   { from{transform:translateX(-100%) scaleX(.5);opacity:0} 50%{opacity:1} to{transform:translateX(200%) scaleX(.5);opacity:0} }
        @keyframes gd-loading    { 0%,100%{opacity:.3} 50%{opacity:.7} }
        @keyframes gd-fade-up    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .bh-wrap:hover .bh-disk  { animation-duration:.6s !important }
        .bh-wrap:hover .bh-r1    { animation-duration:1.2s !important }
        .bh-wrap:hover .bh-r2    { animation-duration:.9s !important }
        .bh-wrap:hover .bh-lbl   { opacity:1 !important }
        .gd-tool-card:hover      { background:#0f0c24 !important }
        .gd-upcoming:hover       { background:#0e0b22 !important }
        .gd-featured:hover       { background:#0f0c24 !important }
      `}</style>

      {/* ── Black hole ── */}
      <AnimatePresence>
        {mode !== "gamedev" && (
          <motion.div
            ref={bhRef}
            className="bh-wrap"
            onClick={enter}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={mode === "sucking"
              ? { scale: 45, opacity: .9, transition: { duration: 1.1, ease: [0.6, 0.04, 0.98, 0.335] } }
              : { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.3 } }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: "7%", right: "7%", width: 116, height: 116, zIndex: 50,
              cursor: mode === "sucking" ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: mode === "sucking" ? "none" : "auto"
            }}
          >
            <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,transparent 30%,rgba(212,70,10,.07) 52%,rgba(212,70,10,.03) 68%,transparent 80%)", animation: "bh-halo-pulse 4s ease-in-out infinite", pointerEvents: "none" }} />
            <div className="bh-disk" style={{ position: "absolute", width: 108, height: 108, borderRadius: "50%", background: "conic-gradient(from 0deg,transparent 0deg,rgba(212,70,10,.18) 50deg,rgba(220,150,40,.3) 110deg,rgba(212,70,10,.12) 170deg,transparent 230deg,rgba(180,50,10,.22) 290deg,transparent 360deg)", animation: "bh-disk-spin 2.8s linear infinite", filter: "blur(1.5px)" }} />
            <div className="bh-r1" style={{ position: "absolute", width: 116, height: 116, borderRadius: "50%", border: "1.5px solid rgba(212,70,10,.65)", animation: "bh-ring1 7s linear infinite", boxShadow: "0 0 10px rgba(212,70,10,.35)" }} />
            <div className="bh-r2" style={{ position: "absolute", width: 94, height: 94, borderRadius: "50%", border: "1px solid rgba(220,140,40,.4)", animation: "bh-ring2 5s linear infinite" }} />
            <div style={{ position: "absolute", width: 54, height: 54, borderRadius: "50%", background: "radial-gradient(circle at 38% 36%,#1c1e30 0%,#06070c 50%,#000 100%)", boxShadow: "0 0 18px 5px rgba(212,70,10,.28),0 0 42px 12px rgba(212,70,10,.08),inset 0 0 24px #000", zIndex: 2 }} />
            <span className="bh-lbl" style={{ position: "absolute", bottom: -26, left: "50%", transform: "translateX(-50%)", fontFamily: "'Fira Code',monospace", fontSize: ".52rem", letterSpacing: ".14em", color: "rgba(212,70,10,.55)", whiteSpace: "nowrap", opacity: 0, transition: "opacity .25s", pointerEvents: "none" }}>◈ GAME DEV MODE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Game Dev Portal v2 ── */}
      <AnimatePresence>
        {mode === "gamedev" && (
          <motion.div
            key="gdv2"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{
              position: "fixed", inset: 0, zIndex: 100, background: "#060410", overflowY: "auto",
              fontFamily: "'Barlow',sans-serif", color: "#f0eeff"
            }}
          >
            {/* Grain */}
            <div style={{
              position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: .025,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
            }} />

            {/* Return button */}
            <button onClick={returnToMain} style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 900, fontFamily: "'Fira Code',monospace", fontSize: ".6rem", letterSpacing: ".18em", color: "rgba(232,255,0,.5)", background: "transparent", border: "1px solid rgba(232,255,0,.18)", padding: ".6rem 1.1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: ".5rem", transition: "all .2s" }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.color = "#e8ff00"; b.style.borderColor = "rgba(232,255,0,.5)" }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.color = "rgba(232,255,0,.5)"; b.style.borderColor = "rgba(232,255,0,.18)" }}>
              ◂ EXIT DIMENSION
            </button>

            <main style={{ paddingBottom: "3rem", position: "relative", zIndex: 2 }}>

              {/* ── HERO ── */}
              <section style={{ padding: "6rem 3rem 4rem", position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(232,255,0,.12)" }}>
                <div style={{ position: "absolute", top: "-40%", left: "-10%", width: "70%", height: "200%", background: "radial-gradient(ellipse,rgba(232,255,0,.04) 0%,transparent 65%)", pointerEvents: "none" }} />
                <p style={{ fontFamily: "'Fira Code',monospace", fontSize: ".65rem", letterSpacing: ".2em", color: "#e8ff00", opacity: .6, marginBottom: "1.5rem", animation: "gd-fade-up .6s ease both" }}>
                  // GAME DEV DIMENSION · COORDINATES: ∞
                </p>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(1rem,2.5vw,1.4rem)", fontWeight: 400, letterSpacing: ".06em", color: "rgba(240,238,255,.45)", marginBottom: ".5rem", animation: "gd-fade-up .6s .1s ease both" }}>
                  Ricardo Sánchez Meléndez
                </p>
                <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(5rem,13vw,13rem)", lineHeight: .85, letterSpacing: "-.01em", textTransform: "uppercase", margin: 0, animation: "gd-fade-up .7s .15s ease both" }}>
                  <span style={{ display: "block", color: "#f0eeff" }}>Game</span>
                  <span style={{ display: "block", color: "transparent", WebkitTextStroke: "1.5px rgba(232,255,0,.7)", marginLeft: ".08em" }}>Developer</span>
                </h2>
                <p style={{ fontFamily: "'Fira Code',monospace", fontSize: ".9rem", color: "rgba(200,196,230,.75)", letterSpacing: ".08em", maxWidth: 480, lineHeight: 1.7, marginTop: "2rem", animation: "gd-fade-up .7s .3s ease both" }}>
                  Building worlds where <span style={{ color: "#e8ff00" }}>systems meet play</span>.<br />
                  Each game a different universe — different rules, different feel, same obsession with craft.
                </p>

                {/* Skills marquee */}
                <div style={{ marginTop: "2.5rem", overflow: "hidden", borderTop: "1px solid rgba(232,255,0,.12)", borderBottom: "1px solid rgba(232,255,0,.12)", padding: ".7rem 0", animation: "gd-fade-up .7s .4s ease both" }}>
                  <div style={{ display: "flex", gap: 0, animation: "gd-marquee 28s linear infinite", width: "max-content" }}>
                    {[...SKILLS, ...SKILLS].map((s, i) => (
                      <div key={i} style={{ fontFamily: "'Fira Code',monospace", fontSize: ".72rem", letterSpacing: ".2em", color: "rgba(180,175,220,.7)", padding: "0 2.5rem", whiteSpace: "nowrap" }}>
                        <span style={{ color: "#e8ff00", opacity: .7, marginRight: "2.5rem" }}>◈</span>{s}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── WORLDS ── */}
              <section style={{ padding: "4rem 3rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
                  <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "2.2rem", letterSpacing: ".08em", textTransform: "uppercase", color: "#f0eeff", margin: 0 }}>Worlds</h3>
                  <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".62rem", letterSpacing: ".15em", color: "#e8ff00", opacity: .6, border: "1px solid rgba(232,255,0,.2)", padding: ".25rem .65rem", animation: "gd-blink-border 2s step-end infinite" }}>◉ 1 RELEASED · ∞ QUEUED</span>
                </div>

                {/* Featured + sidebar layout */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 1, background: "rgba(232,255,0,.12)", border: "1px solid rgba(232,255,0,.12)" }}>

                  {/* ─ CRMBL featured card ─ */}
                  <div className="gd-featured" style={{ background: "#0c0820", display: "grid", gridTemplateRows: "auto 1fr", position: "relative", overflow: "hidden", transition: "background .3s" }}>
                    {/* corner accent */}
                    <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 40px 40px 0", borderColor: "transparent #e8ff00 transparent transparent", opacity: .5 }} />

                    {/* Canvas preview */}
                    <div style={{ position: "relative", height: 280, background: "#030208", overflow: "hidden", borderBottom: "1px solid rgba(232,255,0,.12)" }}>
                      <canvas ref={crmblRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                      <div style={{ position: "absolute", top: 12, left: 14, fontFamily: "'Fira Code',monospace", fontSize: ".52rem", letterSpacing: ".14em", color: "rgba(232,255,0,.35)" }}>WORLD_001 · CRMBL</div>
                      <div style={{ position: "absolute", bottom: 12, right: 14, fontFamily: "'Fira Code',monospace", fontSize: ".5rem", letterSpacing: ".15em", color: "#84cc16", border: "1px solid rgba(132,204,22,.3)", background: "rgba(132,204,22,.06)", padding: ".2rem .55rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#84cc16", boxShadow: "0 0 6px #84cc16", display: "inline-block" }} /> RELEASED
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "1.75rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".55rem", letterSpacing: ".15em", padding: ".2rem .6rem", border: "1px solid rgba(255,60,60,.3)", color: "#ff3c3c", textTransform: "uppercase" }}>GRID ROGUELITE</span>
                        <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".55rem", letterSpacing: ".15em", padding: ".2rem .6rem", border: "1px solid rgba(255,124,60,.3)", color: "#ff7c3c", textTransform: "uppercase" }}>SURVIVAL</span>
                        <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".5rem", letterSpacing: ".12em", padding: ".2rem .55rem", background: "#1e1a35", color: "#4a4465" }}>PC</span>
                        <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".5rem", letterSpacing: ".12em", padding: ".2rem .55rem", background: "#1e1a35", color: "#4a4465" }}>PYTHON</span>
                      </div>

                      <div>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "3.5rem", lineHeight: .9, letterSpacing: "-.01em", textTransform: "uppercase", color: "#f0eeff" }}>CRMBL</div>
                        <div style={{ fontFamily: "'Fira Code',monospace", fontSize: ".6rem", letterSpacing: ".18em", color: "#e8ff00", opacity: .65, textTransform: "uppercase" }}>// System Rebuild</div>
                      </div>

                      <p style={{ fontSize: ".92rem", lineHeight: 1.7, color: "rgba(220,216,255,.8)", maxWidth: 560, margin: 0 }}>
                        You are a fragmented AI. The grid is collapsing. Collect system fragments to rebuild your integrity before corruption spreads and consumes you entirely. A pure survival loop — no UI, no hand-holding. Just the grid and the decay.
                      </p>

                      {/* DNA bars */}
                      <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(232,255,0,.07)" }}>
                        <div style={{ fontFamily: "'Fira Code',monospace", fontSize: ".65rem", letterSpacing: ".18em", color: "rgba(180,175,220,.65)", marginBottom: ".75rem" }}>// GAME DNA</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
                          {[["SURVIVAL", 85], ["STRATEGY", 60], ["TENSION", 90], ["NARRATIVE", 20]].map(([name, pct]) => (
                            <div key={name as string} style={{ display: "grid", gridTemplateColumns: "80px 1fr 30px", alignItems: "center", gap: ".75rem" }}>
                              <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".65rem", letterSpacing: ".1em", color: "rgba(180,175,220,.7)", textAlign: "right" }}>{name}</span>
                              <div style={{ height: 3, background: "#1e1a35", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: "#e8ff00", boxShadow: "0 0 6px rgba(232,255,0,.4)" }} />
                              </div>
                              <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".62rem", color: "#e8ff00", opacity: .8, textAlign: "right" }}>{pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", paddingTop: "1rem", borderTop: "1px solid rgba(232,255,0,.07)" }}>
                        {["Python 3.12", "Pygame 2.6", "Grid Systems", "Cellular Automata", "Procedural Difficulty"].map(t => (
                          <span key={t} style={{ fontFamily: "'Fira Code',monospace", fontSize: ".65rem", letterSpacing: ".08em", padding: ".22rem .55rem", background: "#1e1a35", color: "rgba(210,206,255,.7)", border: "1px solid rgba(255,255,255,.1)" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ─ Upcoming worlds sidebar ─ */}
                  <div style={{ background: "#0c0820", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(232,255,0,.12)", fontFamily: "'Fira Code',monospace", fontSize: ".68rem", letterSpacing: ".18em", color: "rgba(74,68,101,.9)" }}>// UPCOMING WORLDS</div>

                    {/* Upcoming 1 */}
                    <div className="gd-upcoming" style={{ flex: 1, padding: "1.5rem", borderBottom: "1px solid rgba(232,255,0,.12)", display: "flex", flexDirection: "column", gap: ".9rem", position: "relative", overflow: "hidden", transition: "background .2s", background: "#0c0820" }}>
                      <div style={{ height: 100, background: "#030208", position: "relative", overflow: "hidden" }}>
                        <canvas ref={particleRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: ".4rem" }}>
                          <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".65rem", letterSpacing: ".2em", color: "rgba(232,255,0,.55)", animation: "gd-loading 2s ease-in-out infinite" }}>WORLD DATA ENCRYPTED</span>
                          <div style={{ width: "60%", height: 1, background: "linear-gradient(90deg,transparent,rgba(232,255,0,.3),transparent)", animation: "gd-bar-scan 2s linear infinite" }} />
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: ".02em", textTransform: "uppercase", color: "rgba(240,238,255,.35)" }}>[ CLASSIFIED ]</div>
                      <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                        {["3D ACTION", "PC", "PROTOTYPE"].map(t => <span key={t} style={{ fontFamily: "'Fira Code',monospace", fontSize: ".65rem", letterSpacing: ".1em", padding: ".18rem .5rem", border: "1px solid rgba(255,255,255,.06)", color: "rgba(240,238,255,.45)" }}>{t}</span>)}
                      </div>
                      <div style={{ fontFamily: "'Fira Code',monospace", fontSize: ".62rem", letterSpacing: ".14em", color: "rgba(232,255,0,.5)" }}>◌ IN DEVELOPMENT</div>
                    </div>

                    {/* Upcoming 2 */}
                    <div className="gd-upcoming" style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".9rem", position: "relative", overflow: "hidden", transition: "background .2s", background: "#0c0820" }}>
                      <div style={{ height: 100, background: "#030208", position: "relative", overflow: "hidden" }}>
                        <canvas ref={hexRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: ".4rem" }}>
                          <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".65rem", letterSpacing: ".2em", color: "rgba(232,255,0,.55)", animation: "gd-loading 2s ease-in-out infinite" }}>AWAITING CLEARANCE</span>
                          <div style={{ width: "60%", height: 1, background: "linear-gradient(90deg,transparent,rgba(232,255,0,.3),transparent)", animation: "gd-bar-scan 2.5s linear infinite" }} />
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: ".02em", textTransform: "uppercase", color: "rgba(240,238,255,.35)" }}>[ CLASSIFIED ]</div>
                      <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                        {["PUZZLE", "WEB", "CONCEPT"].map(t => <span key={t} style={{ fontFamily: "'Fira Code',monospace", fontSize: ".65rem", letterSpacing: ".1em", padding: ".18rem .5rem", border: "1px solid rgba(255,255,255,.06)", color: "rgba(240,238,255,.45)" }}>{t}</span>)}
                      </div>
                      <div style={{ fontFamily: "'Fira Code',monospace", fontSize: ".62rem", letterSpacing: ".14em", color: "rgba(232,255,0,.5)" }}>◌ EARLY CONCEPT</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── TOOLBOX ── */}
              <section style={{ padding: "4rem 3rem", borderTop: "1px solid rgba(232,255,0,.12)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                  <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "2.2rem", letterSpacing: ".08em", textTransform: "uppercase", color: "#f0eeff", margin: 0 }}>Toolbox</h3>
                  <span style={{ fontFamily: "'Fira Code',monospace", fontSize: ".62rem", letterSpacing: ".15em", color: "#e8ff00", opacity: .4 }}>// CURRENT STACK</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 1, background: "rgba(232,255,0,.12)", border: "1px solid rgba(232,255,0,.12)" }}>
                  {[
                    { icon: "🐍", name: "Python", lvl: 90, lbl: "PROFICIENCY" },
                    { icon: "🎮", name: "Pygame", lvl: 80, lbl: "PROFICIENCY" },
                    { icon: "⚙️", name: "Unity", lvl: 20, lbl: "LEARNING", dim: true },
                    { icon: "🧮", name: "Game Math", lvl: 70, lbl: "VECTORS / PHYSICS" },
                    { icon: "🗺️", name: "Proc Gen", lvl: 75, lbl: "ALGORITHMS" },
                    { icon: "🎨", name: "Pixel Art", lvl: 50, lbl: "PROFICIENCY" },
                  ].map(t => (
                    <div key={t.name} className="gd-tool-card" style={{ background: "#0c0820", padding: "1.25rem", transition: "background .2s", display: "flex", flexDirection: "column", gap: ".7rem" }}>
                      <div style={{ fontSize: "1.4rem", lineHeight: 1 }}>{t.icon}</div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: ".05em", textTransform: "uppercase", color: "#f0eeff" }}>{t.name}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Fira Code',monospace", fontSize: ".62rem", letterSpacing: ".1em", color: "rgba(180,175,220,.65)" }}>
                          <span>{t.lbl}</span><span>{t.dim ? "LEARNING" : `${t.lvl}%`}</span>
                        </div>
                        <div style={{ height: 2, background: "#1e1a35", position: "relative", overflow: "hidden" }}>
                          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${t.lvl}%`, background: "#e8ff00", opacity: t.dim ? .35 : .6 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </main>

            {/* Status bar */}
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10, background: "rgba(6,4,16,.95)", borderTop: "1px solid rgba(232,255,0,.08)", padding: ".45rem 1.5rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap", fontFamily: "'Fira Code',monospace", fontSize: ".5rem", letterSpacing: ".1em", color: "rgba(74,68,101,.9)", pointerEvents: "none" }}>
              <span style={{ color: "#84cc16", display: "flex", alignItems: "center", gap: ".4rem" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#84cc16", boxShadow: "0 0 6px #84cc16", display: "inline-block", animation: "gd-blink-dot 1s step-end infinite" }} />
                ACTIVE WORLDS: 1
              </span>
              <span>GENRES UNLOCKED: 1 / ∞</span>
              <span style={{ color: "rgba(232,255,0,.3)" }}>NEXT WORLD: ██████████</span>
              <span style={{ marginLeft: "auto" }}>RICARDO.DEV // GAME DIMENSION</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
