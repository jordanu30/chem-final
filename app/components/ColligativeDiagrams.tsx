'use client'

import { motion } from 'framer-motion'

// ── Diagram 1 precomputed data ──────────────────────────────────────────────

const D1_LIQUID: { x: number; y: number; a: number }[] = [
  { x: 26,  y: 72,  a: 28  },
  { x: 74,  y: 56,  a: 152 },
  { x: 51,  y: 108, a: 54  },
  { x: 19,  y: 143, a: 212 },
  { x: 99,  y: 90,  a: 308 },
  { x: 35,  y: 176, a: 127 },
  { x: 90,  y: 156, a: 248 },
  { x: 62,  y: 206, a: 46  },
  { x: 113, y: 66,  a: 198 },
  { x: 16,  y: 210, a: 308 },
  { x: 97,  y: 220, a: 81  },
  { x: 116, y: 186, a: 168 },
]

const D1_ICE: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = []
  const rows = [72, 94, 116, 138, 160, 182, 204, 226]
  rows.forEach((y, ri) => {
    const sx = ri % 2 === 0 ? 178 : 190
    for (let ci = 0; ci < 4; ci++) {
      const x = sx + ci * 24
      if (x < 296) out.push({ x, y })
    }
  })
  return out
})()

const D1_BONDS: [number, number, number, number][] = (() => {
  const b: [number, number, number, number][] = []
  for (let i = 0; i < D1_ICE.length; i++) {
    for (let j = i + 1; j < D1_ICE.length; j++) {
      const dx = D1_ICE[j].x - D1_ICE[i].x
      const dy = D1_ICE[j].y - D1_ICE[i].y
      if (Math.sqrt(dx * dx + dy * dy) < 27) b.push([D1_ICE[i].x, D1_ICE[i].y, D1_ICE[j].x, D1_ICE[j].y])
    }
  }
  return b
})()

function Diagram1SVG() {
  return (
    <svg viewBox="0 0 300 248" className="w-full h-auto">
      <defs>
        <marker id="d1-mot" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0,1 L7,4 L0,7 Z" fill="#93c5fd" />
        </marker>
        <marker id="d1-cool" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0,1 L7,4 L0,7 Z" fill="#64748b" />
        </marker>
      </defs>

      {/* Panel labels */}
      <text x="72" y="18" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="0.6">LIQUID WATER</text>
      <text x="234" y="18" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="0.6">ICE CRYSTAL</text>

      {/* Dashed divider */}
      <line x1="150" y1="24" x2="150" y2="112" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="150" y1="136" x2="150" y2="242" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

      {/* Cooling arrow */}
      <line x1="134" y1="124" x2="166" y2="124" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#d1-cool)" />
      <text x="150" y="116" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="system-ui,sans-serif">Cooling</text>
      <text x="150" y="138" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="system-ui,sans-serif">to 0°C</text>

      {/* Liquid motion arrows (drawn before circles so circles sit on top) */}
      {D1_LIQUID.map((m, i) => {
        const r = (m.a * Math.PI) / 180
        return (
          <line key={i}
            x1={m.x} y1={m.y}
            x2={m.x + Math.cos(r) * 16} y2={m.y + Math.sin(r) * 16}
            stroke="#93c5fd" strokeWidth="1.2" markerEnd="url(#d1-mot)"
          />
        )
      })}

      {/* Liquid water circles */}
      {D1_LIQUID.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r="10" fill="#1d4ed8" />
          <text x={m.x} y={m.y + 3.5} textAnchor="middle" fill="#bfdbfe" fontSize="6.5" fontWeight="bold" fontFamily="system-ui,sans-serif">H₂O</text>
        </g>
      ))}

      {/* Ice bonds */}
      {D1_BONDS.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      ))}

      {/* Ice circles */}
      {D1_ICE.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r="10" fill="#60a5fa" />
          <text x={c.x} y={c.y + 3.5} textAnchor="middle" fill="#1e3a8a" fontSize="6.5" fontWeight="bold" fontFamily="system-ui,sans-serif">H₂O</text>
        </g>
      ))}
    </svg>
  )
}

// ── Diagram 2 precomputed data ──────────────────────────────────────────────

const D2_WATER = [
  { x: 40,  y: 62  },  // 0
  { x: 82,  y: 46  },  // 1
  { x: 42,  y: 170 },  // 2
  { x: 76,  y: 205 },  // 3
  { x: 162, y: 44  },  // 4
  { x: 208, y: 56  },  // 5
  { x: 252, y: 74  },  // 6
  { x: 272, y: 128 },  // 7
  { x: 258, y: 192 },  // 8
  { x: 200, y: 218 },  // 9
  { x: 148, y: 214 },  // 10
]

// Solid connections (nearby, unblocked)
const D2_SOLID: [number, number][] = [[0,1],[2,3],[5,6],[6,7],[7,8],[8,9]]
// Dotted connections (would-be bonds, blocked by sucrose)
const D2_DOTTED: [number, number][] = [[1,4],[0,2],[3,10],[4,5],[9,10]]

const BLOB1 = "M88,95 C76,80 83,62 100,58 C118,53 136,64 142,80 C150,98 146,120 136,132 C124,146 104,150 90,142 C74,132 76,116 88,95 Z"
const BLOB2 = "M175,143 C172,125 181,108 198,104 C216,100 232,112 236,130 C240,148 234,168 220,175 C206,183 188,176 179,163 C170,150 175,158 175,143 Z"

function Diagram2SVG() {
  return (
    <svg viewBox="0 0 300 248" className="w-full h-auto">
      {/* Solid water bonds */}
      {D2_SOLID.map(([a, b], i) => (
        <line key={i}
          x1={D2_WATER[a].x} y1={D2_WATER[a].y}
          x2={D2_WATER[b].x} y2={D2_WATER[b].y}
          stroke="rgba(147,197,253,0.35)" strokeWidth="1.5"
        />
      ))}

      {/* Dotted (blocked) bonds */}
      {D2_DOTTED.map(([a, b], i) => (
        <line key={i}
          x1={D2_WATER[a].x} y1={D2_WATER[a].y}
          x2={D2_WATER[b].x} y2={D2_WATER[b].y}
          stroke="rgba(147,197,253,0.28)" strokeWidth="1.2" strokeDasharray="4,3"
        />
      ))}

      {/* Sucrose blob 1 */}
      <path d={BLOB1} fill="#f97316" opacity="0.88" />
      <path d={BLOB1} fill="none" stroke="#fb923c" strokeWidth="1.5" />
      <text x="115" y="102" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui,sans-serif">Sucrose</text>
      <text x="115" y="113" textAnchor="middle" fill="#fde68a" fontSize="7" fontFamily="system-ui,sans-serif">C₁₂H₂₂O₁₁</text>

      {/* Sucrose blob 2 */}
      <path d={BLOB2} fill="#f97316" opacity="0.88" />
      <path d={BLOB2} fill="none" stroke="#fb923c" strokeWidth="1.5" />
      <text x="206" y="140" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui,sans-serif">Sucrose</text>
      <text x="206" y="151" textAnchor="middle" fill="#fde68a" fontSize="7" fontFamily="system-ui,sans-serif">C₁₂H₂₂O₁₁</text>

      {/* Water molecules */}
      {D2_WATER.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r="10" fill="#1d4ed8" />
          <text x={m.x} y={m.y + 3.5} textAnchor="middle" fill="#bfdbfe" fontSize="6.5" fontWeight="bold" fontFamily="system-ui,sans-serif">H₂O</text>
        </g>
      ))}
    </svg>
  )
}

// ── Diagram 3 precomputed data ──────────────────────────────────────────────

// Hydration shell: 5 water molecules at radius 36 around each ion
function shellPositions(ix: number, iy: number, startAngle = 0) {
  return Array.from({ length: 5 }, (_, k) => {
    const a = ((startAngle + k * 72) * Math.PI) / 180
    return { x: ix + 36 * Math.cos(a), y: iy + 36 * Math.sin(a) }
  })
}

// Arrow endpoint: from water center toward ion center, stopping at ion surface
function arrowEnd(wx: number, wy: number, ix: number, iy: number, ir = 14) {
  const dx = ix - wx, dy = iy - wy
  const dist = Math.sqrt(dx * dx + dy * dy)
  return { x: ix - (ir + 2) * (dx / dist), y: iy - (ir + 2) * (dy / dist) }
}

const NA_POS = { x: 88, y: 108 }
const CL_POS = { x: 212, y: 152 }
const NA_SHELL = shellPositions(NA_POS.x, NA_POS.y, 0)
const CL_SHELL = shellPositions(CL_POS.x, CL_POS.y, 36)

const BULK_WATER = [
  { x: 28,  y: 56  },
  { x: 152, y: 44  },
  { x: 270, y: 62  },
  { x: 272, y: 198 },
  { x: 44,  y: 200 },
  { x: 152, y: 220 },
]

function Diagram3SVG() {
  return (
    <svg viewBox="0 0 300 248" className="w-full h-auto">
      <defs>
        <marker id="d3-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0,1 L7,4 L0,7 Z" fill="#94a3b8" />
        </marker>
      </defs>

      {/* Hydration shell rings (subtle) */}
      <circle cx={NA_POS.x} cy={NA_POS.y} r="46" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="1.5" strokeDasharray="3,3" />
      <circle cx={CL_POS.x} cy={CL_POS.y} r="46" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="1.5" strokeDasharray="3,3" />

      {/* Na+ hydration arrows */}
      {NA_SHELL.map((w, i) => {
        const e = arrowEnd(w.x, w.y, NA_POS.x, NA_POS.y)
        return (
          <line key={i}
            x1={w.x} y1={w.y} x2={e.x} y2={e.y}
            stroke="#94a3b8" strokeWidth="1.2" markerEnd="url(#d3-arr)"
          />
        )
      })}

      {/* Cl- hydration arrows */}
      {CL_SHELL.map((w, i) => {
        const e = arrowEnd(w.x, w.y, CL_POS.x, CL_POS.y)
        return (
          <line key={i}
            x1={w.x} y1={w.y} x2={e.x} y2={e.y}
            stroke="#94a3b8" strokeWidth="1.2" markerEnd="url(#d3-arr)"
          />
        )
      })}

      {/* Bulk water molecules */}
      {BULK_WATER.map((m, i) => (
        <g key={i} opacity="0.55">
          <circle cx={m.x} cy={m.y} r="10" fill="#1d4ed8" />
          <text x={m.x} y={m.y + 3.5} textAnchor="middle" fill="#bfdbfe" fontSize="6.5" fontWeight="bold" fontFamily="system-ui,sans-serif">H₂O</text>
        </g>
      ))}

      {/* Na+ hydration shell water */}
      {NA_SHELL.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r="10" fill="#1d4ed8" />
          <text x={m.x} y={m.y + 3.5} textAnchor="middle" fill="#bfdbfe" fontSize="6.5" fontWeight="bold" fontFamily="system-ui,sans-serif">H₂O</text>
        </g>
      ))}

      {/* Cl- hydration shell water */}
      {CL_SHELL.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r="10" fill="#1d4ed8" />
          <text x={m.x} y={m.y + 3.5} textAnchor="middle" fill="#bfdbfe" fontSize="6.5" fontWeight="bold" fontFamily="system-ui,sans-serif">H₂O</text>
        </g>
      ))}

      {/* Na+ ion */}
      <circle cx={NA_POS.x} cy={NA_POS.y} r="14" fill="#ef4444" />
      <text x={NA_POS.x} y={NA_POS.y + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="system-ui,sans-serif">Na⁺</text>

      {/* Cl- ion */}
      <circle cx={CL_POS.x} cy={CL_POS.y} r="14" fill="#22c55e" />
      <text x={CL_POS.x} y={CL_POS.y + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="system-ui,sans-serif">Cl⁻</text>
    </svg>
  )
}

// ── Card wrapper ────────────────────────────────────────────────────────────

interface CardProps {
  title: string
  subtitle: string
  caption?: string
  svg: React.ReactNode
  delay?: number
}

function DiagramCard({ title, subtitle, caption, svg, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className="bg-[#0f172a] rounded-3xl p-4 flex flex-col gap-3"
    >
      <div>
        <h4 className="font-black text-white text-sm leading-snug">{title}</h4>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{subtitle}</p>
      </div>
      <div className="rounded-2xl overflow-hidden bg-[#0f172a]">
        {svg}
      </div>
      {caption && (
        <p className="text-slate-400 text-[11px] leading-relaxed">{caption}</p>
      )}
    </motion.div>
  )
}

// ── Export ──────────────────────────────────────────────────────────────────

export default function ColligativeDiagrams() {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <DiagramCard
        title="Pure Water Freezing at 0°C"
        subtitle="Water molecules arrange into an ordered hexagonal lattice when cooled to 0°C."
        svg={<Diagram1SVG />}
        delay={0}
      />
      <DiagramCard
        title="Sucrose Blocking Ice Crystal Formation"
        subtitle="Large sugar molecules physically interrupt the lattice arrangement."
        caption="Sucrose molecules block water from forming ordered ice crystals, requiring a lower temperature to freeze."
        svg={<Diagram2SVG />}
        delay={0.1}
      />
      <DiagramCard
        title="NaCl Ions Disrupting Ice Crystal Formation"
        subtitle="Charged ions pull water molecules away from the crystal lattice."
        caption="Na⁺ and Cl⁻ ions attract water molecules into hydration shells, pulling them away from ice crystal formation."
        svg={<Diagram3SVG />}
        delay={0.2}
      />
    </div>
  )
}
