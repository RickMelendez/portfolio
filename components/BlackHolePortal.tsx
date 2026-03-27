"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"


/* ─── CRMBL canvas simulation ──────────────────────────────────────── */
function useCRMBLCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  active: boolean
) {
  useEffect(() => {
    if (!active || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!
    const COLS = 18, ROWS = 14
    const EMPTY = 0, ACTIVE_CELL = 1, CORRUPT = 2, PART = 3
    type Cell = 0 | 1 | 2 | 3

    let grid: Cell[][]
    let char = { row: ROWS - 3, col: Math.floor(COLS / 2) }
    let frameCount = 0
    let rafId = 0

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const initGrid = () => {
      grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(EMPTY)) as Cell[][]
      const seeds = [[0,0],[0,1],[1,0],[0,COLS-1],[1,COLS-1],[ROWS-1,0],[ROWS-2,0]]
      seeds.forEach(([r,c]) => (grid[r][c] = CORRUPT))
      for (let i = 0; i < 8; i++) {
        let r: number, c: number
        do { r = Math.floor(Math.random()*ROWS); c = Math.floor(Math.random()*COLS) }
        while (grid[r][c] !== EMPTY || (r === char.row && c === char.col))
        grid[r][c] = PART
      }
      for (let i = 0; i < 10; i++) {
        let r: number, c: number
        do { r = Math.floor(Math.random()*ROWS); c = Math.floor(Math.random()*COLS) }
        while (grid[r][c] !== EMPTY || (r === char.row && c === char.col))
        grid[r][c] = ACTIVE_CELL
      }
    }

    const spreadCorruption = () => {
      const dirs = [[-1,0],[1,0],[0,-1],[0,1]]
      const cands: [number,number][] = []
      for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
        if (grid[r][c] === CORRUPT) {
          dirs.forEach(([dr,dc]) => {
            const nr=r+dr, nc=c+dc
            if (nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&grid[nr][nc]===EMPTY) cands.push([nr,nc])
          })
        }
      }
      if (cands.length && Math.random() < 0.4) {
        const [r,c] = cands[Math.floor(Math.random()*cands.length)]
        grid[r][c] = CORRUPT
      }
    }

    const moveChar = () => {
      const dirs = [[-1,0],[1,0],[0,-1],[0,1]]
      const passable = dirs.filter(([dr,dc]) => {
        const nr=char.row+dr, nc=char.col+dc
        return nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&grid[nr][nc]!==ACTIVE_CELL&&grid[nr][nc]!==CORRUPT
      })
      if (!passable.length) return
      let best: [number,number]|null = null, bestDist = Infinity
      for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
        if (grid[r][c]===PART) {
          const d = Math.abs(r-char.row)+Math.abs(c-char.col)
          if (d < bestDist) { bestDist=d; best=[r,c] }
        }
      }
      if (best) {
        passable.sort(([a0,a1],[b0,b1]) =>
          (Math.abs((char.row+a0)-best![0])+Math.abs((char.col+a1)-best![1])) -
          (Math.abs((char.row+b0)-best![0])+Math.abs((char.col+b1)-best![1])) +
          (Math.random()-0.5)*2
        )
      }
      const [dr,dc] = passable[0]
      char.row += dr; char.col += dc
      if (grid[char.row][char.col]===PART) {
        grid[char.row][char.col] = EMPTY
      }
    }

    const draw = () => {
      const cw = (canvas.width  - 20) / COLS
      const ch = (canvas.height - 20) / ROWS
      const ox = 10, oy = 10
      const t  = frameCount * 0.04

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#04060c"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "rgba(20,26,40,0.8)"
      ctx.lineWidth = 0.5
      for (let r=0;r<=ROWS;r++) {
        ctx.beginPath(); ctx.moveTo(ox, oy+r*ch); ctx.lineTo(ox+COLS*cw, oy+r*ch); ctx.stroke()
      }
      for (let c=0;c<=COLS;c++) {
        ctx.beginPath(); ctx.moveTo(ox+c*cw, oy); ctx.lineTo(ox+c*cw, oy+ROWS*ch); ctx.stroke()
      }

      for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
        const x=ox+c*cw+1, y=oy+r*ch+1, w=cw-2, h=ch-2
        if (grid[r][c]===ACTIVE_CELL) {
          ctx.fillStyle = `rgba(55,75,100,${0.4+0.2*Math.sin(t+r+c)})`
          ctx.fillRect(x,y,w,h)
        } else if (grid[r][c]===CORRUPT) {
          const p = 0.7+0.3*Math.sin(t*2+r*0.5+c*0.3)
          ctx.fillStyle = `rgba(140,18,26,${p})`
          ctx.shadowColor = "#a01920"; ctx.shadowBlur = 4
          ctx.fillRect(x,y,w,h)
          ctx.shadowBlur = 0
        } else if (grid[r][c]===PART) {
          const s = 0.7+0.3*Math.sin(t*3+r+c)
          ctx.fillStyle = `rgba(220,195,50,${s})`
          ctx.shadowColor = "#dcc950"; ctx.shadowBlur = 6
          ctx.fillRect(x+w*.25, y+h*.25, w*.5, h*.5)
          ctx.shadowBlur = 0
        }
      }

      const cx2 = ox+char.col*cw+cw/2
      const cy2 = oy+char.row*ch+ch/2
      const cr  = Math.min(cw,ch)*(0.30+(0.04*Math.sin(t*4)))
      ctx.beginPath(); ctx.arc(cx2,cy2,cr,0,Math.PI*2)
      ctx.fillStyle = "#50dca0"
      ctx.shadowColor = "#50dca0"; ctx.shadowBlur = 12
      ctx.fill(); ctx.shadowBlur = 0
    }

    const tick = () => {
      frameCount++
      if (frameCount % 28  === 0) moveChar()
      if (frameCount % 90  === 0) spreadCorruption()
      draw()
      rafId = requestAnimationFrame(tick)
    }

    resize()
    initGrid()
    rafId = requestAnimationFrame(tick)
    window.addEventListener("resize", resize)
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize) }
  }, [active, canvasRef])
}

/* ─── main component ───────────────────────────────────────────────── */
export default function BlackHolePortal() {
  const [mode, setMode] = useState<"idle" | "sucking" | "gamedev">("idle")
  const bhRef    = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useCRMBLCanvas(canvasRef, mode === "gamedev")

  const enter = useCallback(() => {
    if (mode !== "idle") return
    setMode("sucking")
    setTimeout(() => setMode("gamedev"), 1100)
  }, [mode])

  const returnToMain = useCallback(() => {
    setMode("idle")
  }, [])

  return (
    <>
      {/* ── keyframe styles ── */}
      <style>{`
        @keyframes bh-disk-spin  { to { transform: rotate(360deg); } }
        @keyframes bh-ring1      { to { transform: rotate(360deg); } }
        @keyframes bh-ring2      { to { transform: rotate(-360deg); } }
        @keyframes bh-halo-pulse {
          0%,100% { transform:scale(.95); opacity:.6; }
          50%     { transform:scale(1.1); opacity:1; }
        }
        @keyframes bh-swallow {
          0%   { transform:scale(1); }
          30%  { transform:scale(2.5); }
          60%  { transform:scale(10); }
          100% { transform:scale(45); opacity:.9; }
        }
        @keyframes vt-glitch {
          0%,90%,100% { text-shadow:0 0 24px rgba(80,220,160,.38); transform:none; }
          91% { text-shadow:-3px 0 #a01920, 3px 0 #dcc950; transform:skewX(-4deg); }
          92% { text-shadow: 3px 0 #50dca0; transform:skewX(2deg); }
          93% { text-shadow:0 0 24px rgba(80,220,160,.38); transform:none; }
        }
        @keyframes badge-blink {
          0%,100% { border-color:rgba(80,220,160,.3); }
          50%     { border-color:rgba(80,220,160,.06); }
        }
        @keyframes scanlines-move {
          from { background-position: 0 0; }
          to   { background-position: 0 120px; }
        }
        .bh-wrap:hover .bh-disk  { animation-duration:.6s !important; }
        .bh-wrap:hover .bh-ring1 { animation-duration:1.2s !important; }
        .bh-wrap:hover .bh-ring2 { animation-duration:.9s !important; }
        .bh-wrap:hover .bh-label { opacity:1 !important; }
      `}</style>

      {/* ── Black hole (fixed, top-right) ── */}
      <AnimatePresence>
        {mode !== "gamedev" && (
          <motion.div
            ref={bhRef}
            className="bh-wrap"
            onClick={enter}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={
              mode === "sucking"
                ? { scale: 45, opacity: 0.9, transition: { duration: 1.1, ease: [0.6, 0.04, 0.98, 0.335] } }
                : { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.3 } }
            }
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: "7%",
              right: "7%",
              width: 116,
              height: 116,
              zIndex: 50,
              cursor: mode === "sucking" ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: mode === "sucking" ? "none" : "auto",
            }}
          >
            {/* Halo glow */}
            <div style={{
              position:"absolute", width:180, height:180, borderRadius:"50%",
              background:"radial-gradient(circle,transparent 30%,rgba(212,70,10,.07) 52%,rgba(212,70,10,.03) 68%,transparent 80%)",
              animation:"bh-halo-pulse 4s ease-in-out infinite",
              pointerEvents:"none",
            }} />
            {/* Accretion disk */}
            <div className="bh-disk" style={{
              position:"absolute", width:108, height:108, borderRadius:"50%",
              background:"conic-gradient(from 0deg,transparent 0deg,rgba(212,70,10,.18) 50deg,rgba(220,150,40,.3) 110deg,rgba(212,70,10,.12) 170deg,transparent 230deg,rgba(180,50,10,.22) 290deg,transparent 360deg)",
              animation:"bh-disk-spin 2.8s linear infinite",
              filter:"blur(1.5px)",
            }} />
            {/* Ring 1 */}
            <div className="bh-ring1" style={{
              position:"absolute", width:116, height:116, borderRadius:"50%",
              border:"1.5px solid rgba(212,70,10,.65)",
              animation:"bh-ring1 7s linear infinite",
              boxShadow:"0 0 10px rgba(212,70,10,.35)",
            }} />
            {/* Ring 2 */}
            <div className="bh-ring2" style={{
              position:"absolute", width:94, height:94, borderRadius:"50%",
              border:"1px solid rgba(220,140,40,.4)",
              animation:"bh-ring2 5s linear infinite",
            }} />
            {/* Event horizon */}
            <div style={{
              position:"absolute", width:54, height:54, borderRadius:"50%",
              background:"radial-gradient(circle at 38% 36%,#1c1e30 0%,#06070c 50%,#000 100%)",
              boxShadow:"0 0 18px 5px rgba(212,70,10,.28),0 0 42px 12px rgba(212,70,10,.08),inset 0 0 24px #000",
              zIndex:2,
            }} />
            {/* Label */}
            <span className="bh-label" style={{
              position:"absolute", bottom:-26, left:"50%", transform:"translateX(-50%)",
              fontFamily:"'Share Tech Mono',monospace", fontSize:"0.52rem",
              letterSpacing:"0.14em", color:"rgba(212,70,10,.55)",
              whiteSpace:"nowrap", opacity:0,
              transition:"opacity 0.25s", pointerEvents:"none",
            }}>◈ GAME DEV MODE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Game Dev Portal overlay ── */}
      <AnimatePresence>
        {mode === "gamedev" && (
          <motion.div
            key="gamedev"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "#020407",
              overflowY: "auto",
              fontFamily: "'Space Mono', monospace",
              color: "#e8eaf0",
            }}
          >
            {/* Scanlines */}
            <div style={{
              position:"fixed", inset:0, zIndex:1, pointerEvents:"none",
              background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.12) 3px,rgba(0,0,0,.12) 4px)",
              animation:"scanlines-move 8s linear infinite",
            }} />
            {/* Vignette */}
            <div style={{
              position:"fixed", inset:0, zIndex:1, pointerEvents:"none",
              background:"radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.55) 100%)",
            }} />

            {/* Content */}
            <div style={{ position:"relative", zIndex:2, maxWidth:1120, margin:"0 auto", padding:"3.5rem 2rem 6rem" }}>

              {/* Top bar */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"1.5rem", marginBottom:"3.5rem" }}>
                <div>
                  <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:".65rem", letterSpacing:".2em", color:"rgba(80,220,160,.45)", marginBottom:".4rem" }}>
                    // ALTERNATE DIMENSION LOADED
                  </p>
                  <h2 style={{
                    fontFamily:"'VT323',monospace", fontSize:"clamp(2.8rem,6vw,5rem)",
                    color:"#50dca0", lineHeight:.95, margin:0,
                    textShadow:"0 0 24px rgba(80,220,160,.38)",
                    animation:"vt-glitch 7s infinite",
                  }}>GAME DEV<br />PORTFOLIO</h2>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:".75rem", alignItems:"flex-end" }}>
                  <span style={{
                    fontFamily:"'Share Tech Mono',monospace", fontSize:".6rem",
                    letterSpacing:".25em", color:"#50dca0",
                    border:"1px solid rgba(80,220,160,.3)", padding:".3rem .8rem",
                    animation:"badge-blink 1.8s step-end infinite",
                  }}>◉ GAME DEV MODE ACTIVE</span>
                  <button
                    onClick={returnToMain}
                    style={{
                      fontFamily:"'Share Tech Mono',monospace", fontSize:".65rem",
                      letterSpacing:".15em", color:"rgba(80,220,160,.55)",
                      background:"transparent", border:"1px solid rgba(80,220,160,.18)",
                      padding:".65rem 1.25rem", cursor:"pointer",
                      display:"flex", alignItems:"center", gap:".6rem",
                      transition:"all 0.2s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#50dca0"
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(80,220,160,.5)"
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(80,220,160,.55)"
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(80,220,160,.18)"
                    }}
                  >
                    ◂ RETURN TO MAIN SYSTEM
                  </button>
                </div>
              </div>

              {/* ── CRMBL featured card ── */}
              <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:".58rem", letterSpacing:".28em", color:"rgba(220,201,80,.65)", marginBottom:"1rem" }}>
                // FEATURED PROJECT — LIVE PREVIEW
              </p>

              <div style={{
                display:"grid", gridTemplateColumns:"1fr 1.1fr",
                border:"1px solid rgba(80,220,160,.12)",
                background:"#060a10", marginBottom:"3.5rem", overflow:"hidden",
              }}>
                {/* Live game canvas */}
                <div style={{ position:"relative", minHeight:280, background:"#04060c", borderRight:"1px solid rgba(80,220,160,.08)" }}>
                  <canvas
                    ref={canvasRef}
                    style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}
                  />
                  <div style={{ position:"absolute", bottom:10, left:12, fontFamily:"'Share Tech Mono',monospace", fontSize:".52rem", color:"rgba(80,220,160,.3)", letterSpacing:".1em" }}>
                    CRMBL v1.0 — LIVE SIMULATION
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding:"2rem", display:"flex", flexDirection:"column", gap:"1.1rem" }}>
                  <div>
                    <div style={{ fontFamily:"'VT323',monospace", fontSize:"3rem", color:"#50dca0", textShadow:"0 0 18px rgba(80,220,160,.3)", lineHeight:1 }}>CRMBL</div>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:".62rem", color:"#dcc950", letterSpacing:".18em", opacity:.75 }}>// SYSTEM REBUILD</div>
                  </div>
                  <p style={{ fontSize:".71rem", color:"rgba(232,234,240,.55)", lineHeight:1.75, margin:0 }}>
                    A grid-based survival game where you play as a fragmented AI attempting to restore itself.
                    Collect scattered <span style={{color:"#dcc950"}}>system fragments</span> while navigating
                    a grid consumed by <span style={{color:"#d85060"}}>corruption</span>. Each adjacent
                    corrupted cell drains your integrity. Survive the collapse.
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:".45rem" }}>
                    {[
                      ["PYTHON",       "rgba(220,201,80,.28)",  "#dcc950"],
                      ["PYGAME",       "rgba(80,220,160,.28)",  "#50dca0"],
                      ["GRID ROGUELITE","rgba(160,25,32,.4)",   "#d85060"],
                      ["PROCEDURAL",   "rgba(85,96,112,.3)",    "#556070"],
                    ].map(([label,border,color]) => (
                      <span key={label} style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:".56rem", letterSpacing:".1em", padding:".22rem .6rem", border:`1px solid ${border}`, color }}>{label}</span>
                    ))}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:".5rem", paddingTop:"1rem", borderTop:"1px solid rgba(80,220,160,.07)" }}>
                    {[["20×20","GRID SIZE"],["60","TARGET FPS"],["∞","DIFFICULTY"]].map(([val,lbl]) => (
                      <div key={lbl} style={{ textAlign:"center" }}>
                        <div style={{ fontFamily:"'VT323',monospace", fontSize:"1.8rem", color:"#50dca0", textShadow:"0 0 10px rgba(80,220,160,.3)" }}>{val}</div>
                        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:".48rem", color:"#556070", letterSpacing:".1em", marginTop:".2rem" }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Status bar */}
            <div style={{
              position:"fixed", bottom:0, left:0, right:0, zIndex:10,
              padding:".5rem 1.5rem",
              background:"rgba(2,4,7,.92)", borderTop:"1px solid rgba(80,220,160,.07)",
              display:"flex", alignItems:"center", gap:"2rem", flexWrap:"wrap",
              fontFamily:"'Share Tech Mono',monospace", fontSize:".52rem",
              color:"rgba(80,220,160,.35)", letterSpacing:".1em", pointerEvents:"none",
            }}>
              <span>◉ SYSTEM ACTIVE</span>
              <span style={{color:"rgba(160,25,32,.55)"}}>▓ CORRUPTION: SPREADING</span>
              <span style={{color:"rgba(220,201,80,.45)"}}>◈ FRAGMENTS: COLLECT THEM</span>
              <span style={{marginLeft:"auto"}}>CRMBL ENGINE v1.0.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
