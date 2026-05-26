'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import ParticleBackground from './components/ParticleBackground'
import FreezeGraph from './components/FreezeGraph'
import ImageGallery from './components/ImageGallery'

const SECTIONS = [
  { id: 'title', label: 'Title' },
  { id: 'introduction', label: 'Introduction' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'colligative', label: 'Colligative' },
  { id: 'equation', label: 'Equation' },
  { id: 'materials', label: 'Materials' },
  { id: 'data', label: 'Data' },
  { id: 'graph', label: 'Graph' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'icecream', label: 'Ice Cream' },
  { id: 'conclusions', label: 'Conclusions' },
  { id: 'references', label: 'References' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function scrollToNext(currentId: string) {
  const idx = SECTIONS.findIndex(s => s.id === currentId)
  if (idx < SECTIONS.length - 1) scrollTo(SECTIONS[idx + 1].id)
}

function SectionWrap({
  id,
  number,
  children,
  minHeight = true,
}: {
  id: string
  number: number
  children: React.ReactNode
  minHeight?: boolean
}) {
  return (
    <section
      id={id}
      className={`relative flex items-center justify-center overflow-hidden py-24 px-4 ${minHeight ? 'min-h-screen' : ''}`}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[22rem] font-black leading-none text-white/[0.025]">
          {number}
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl mx-auto"
      >
        {children}
      </motion.div>
      <button
        onClick={() => scrollToNext(id)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-blue-400 transition-colors"
      >
        <span className="text-[10px] uppercase tracking-widest">Next</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown size={20} />
        </motion.div>
      </button>
    </section>
  )
}

function Badge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-white/30 text-xs">—</span>
  const color = pct < 50 ? 'bg-green-500/20 text-green-400 border-green-500/30'
    : pct < 100 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30'
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border ${color}`}>
      {pct.toFixed(0)}%
    </span>
  )
}

function TdAvg({ val, pred }: { val: number; pred: number | null }) {
  if (pred === null) return <td className="px-3 py-2 font-mono text-white/70 text-xs">{val}</td>
  const tooNeg = val < pred
  return (
    <td className={`px-3 py-2 font-mono text-xs transition-colors ${tooNeg ? 'text-red-400' : 'text-green-400'}`}>
      {val}
    </td>
  )
}

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.round(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span>{count}</span>
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const [activeSection, setActiveSection] = useState('title')
  const [mounted, setMounted] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const dataRef = useRef<HTMLDivElement>(null)
  const [dataInView, setDataInView] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { threshold: 0.3 }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!dataRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setDataInView(true) },
      { threshold: 0.2 }
    )
    obs.observe(dataRef.current)
    return () => obs.disconnect()
  }, [])

  const handleNavClick = useCallback((id: string) => {
    scrollTo(id)
    setNavOpen(false)
  }, [])

  const sucroseColor = '#22c55e'
  const naclColor = '#3b82f6'
  const cacl2Color = '#f97316'

  const rawRows = [
    { conc: 'Control', s1: -0.5, s2: -0.3, n1: -0.5, n2: -0.3, c1: -0.5, c2: -0.3 },
    { conc: '0.1 m', s1: -1.2, s2: -1.6, n1: -1.1, n2: -1.6, c1: -1.8, c2: -1.9 },
    { conc: '0.2 m', s1: -1.7, s2: -2.2, n1: -1.0, n2: -1.6, c1: -2.4, c2: -2.5 },
    { conc: '0.4 m', s1: -2.2, s2: -2.5, n1: -6.0, n2: -6.0, c1: -3.8, c2: -3.9 },
    { conc: '0.6 m', s1: -2.7, s2: -2.9, n1: -4.7, n2: -4.5, c1: -5.7, c2: -6.1 },
  ]

  const avgRows = [
    { conc: 'Control', sAvg: -0.4, sPred: null, sPct: null, nAvg: -0.4, nPred: null, nPct: null, cAvg: -0.4, cPred: null, cPct: null },
    { conc: '0.1 m', sAvg: -1.40, sPred: -0.19, sPct: 426, nAvg: -1.35, nPred: -0.37, nPct: 157, cAvg: -1.85, cPred: -0.56, cPct: 159 },
    { conc: '0.2 m', sAvg: -1.95, sPred: -0.37, sPct: 319, nAvg: -1.30, nPred: -0.74, nPct: 22, cAvg: -2.45, cPred: -1.12, cPct: 83 },
    { conc: '0.4 m', sAvg: -2.35, sPred: -0.74, sPct: 164, nAvg: -6.00, nPred: -1.49, nPct: 276, cAvg: -3.85, cPred: -2.23, cPct: 55 },
    { conc: '0.6 m', sAvg: -2.80, sPred: -1.12, sPct: 114, nAvg: -4.60, nPred: -2.23, nPct: 88, cAvg: -5.90, cPred: -3.35, cPct: 64 },
  ]

  return (
    <div className="bg-[#0a0f1e] min-h-screen text-white">
      {/* Progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-blue-500 origin-left z-50 shadow-[0_0_10px_#3b82f6]"
      />

      {/* Floating Navbar */}
      <nav className="fixed top-2 left-0 right-0 z-40 flex justify-center px-4">
        <div className="bg-[#0d1526]/90 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5 flex gap-0.5 hide-scrollbar max-w-full overflow-x-auto">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                activeSection === id
                  ? 'bg-blue-500 text-white shadow-[0_0_12px_#3b82f680]'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Side dot navigation */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 hidden lg:flex">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            title={label}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === id
                ? 'bg-blue-400 scale-[1.6] shadow-[0_0_6px_#60a5fa]'
                : 'bg-white/25 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* ───── SLIDE 1: TITLE ───── */}
      <section id="title" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {mounted && <ParticleBackground />}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-transparent to-[#0a0f1e]/80 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 text-sm tracking-widest uppercase"
          >
            Science Exposition Chemistry
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="glow-text text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-8 tracking-tight"
          >
            Ice Cream and Freezing Point<br />
            <span className="text-blue-400">Depression</span> of Various Solutes
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="space-y-2 text-white/60 text-lg"
          >
            <p className="font-medium text-white/80">Group Members: Jordan &amp; Colin</p>
            <p>May 2026</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-12"
          >
            <button
              onClick={() => scrollToNext('title')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 transition-all text-sm font-medium"
            >
              Begin Presentation
              <ChevronDown size={16} />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── SLIDE 2: INTRODUCTION ───── */}
      <SectionWrap id="introduction" number={2}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 2</span>
          <h2 className="text-4xl font-black mt-1">Introduction &amp; Hypothesis</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Real-World Hook</h3>
              <p className="text-white/80 leading-relaxed">
                Roads stay ice-free after salting because dissolved salt lowers the freezing point of water — the same chemistry behind making ice cream by hand.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Purpose</h3>
              <p className="text-white/80 leading-relaxed">
                Investigate how the <strong className="text-white">type of solute</strong> and its <strong className="text-white">concentration</strong> affect the freezing point of water.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Experimental Design</h3>
              <div className="space-y-1 text-white/80 text-sm">
                <p>Three solutes tested at four concentrations each</p>
                <p>12 solutions + 1 control (distilled water)</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { name: 'Sucrose', formula: 'C₁₂H₂₂O₁₁', color: sucroseColor },
                    { name: 'NaCl', formula: 'NaCl', color: naclColor },
                    { name: 'CaCl₂·2H₂O', formula: 'CaCl₂·2H₂O', color: cacl2Color },
                  ].map(s => (
                    <div key={s.name} className="rounded-lg p-2 text-center border" style={{ borderColor: s.color + '40', backgroundColor: s.color + '10' }}>
                      <p className="font-bold text-xs" style={{ color: s.color }}>{s.name}</p>
                      <p className="text-white/50 text-[10px] font-mono">{s.formula}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2">Concentrations: 0.1 m, 0.2 m, 0.4 m, 0.6 m</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-blue-400 font-bold mb-4 text-sm uppercase tracking-wider">Hypothesis</h3>
            <p className="text-white/80 leading-relaxed mb-5">
              CaCl₂·2H₂O will produce the <strong className="text-white">largest freezing point depression</strong>, NaCl the second largest, and sucrose the least — and depression will scale linearly with concentration.
            </p>
            <h4 className="text-white/50 text-xs uppercase tracking-wider mb-3">Predicted Ranking</h4>
            <div className="space-y-2">
              {[
                { rank: 1, name: 'CaCl₂·2H₂O', reason: 'i = 3 (most particles)', color: cacl2Color },
                { rank: 2, name: 'NaCl', reason: 'i = 2 (moderate particles)', color: naclColor },
                { rank: 3, name: 'Sucrose', reason: 'i = 1 (fewest particles)', color: sucroseColor },
              ].map(r => (
                <div key={r.rank} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-white/30 font-bold text-sm w-4">#{r.rank}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="font-medium text-sm" style={{ color: r.color }}>{r.name}</span>
                  <span className="text-white/40 text-xs ml-auto">{r.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 3: SOLUTIONS ───── */}
      <SectionWrap id="solutions" number={3}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 3</span>
          <h2 className="text-4xl font-black mt-1">Solutions &amp; Dissolving</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">What Is a Solution?</h3>
              <p className="text-white/80 leading-relaxed text-sm">
                A <strong className="text-white">homogeneous mixture</strong> where a solute dissolves in a solvent. In this experiment, water is always the solvent.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Three Steps of Dissolving</h3>
              <div className="space-y-2">
                {[
                  { step: 1, text: 'Break solute bonds', energy: 'Energy IN', color: 'text-red-400' },
                  { step: 2, text: 'Disrupt solvent bonds', energy: 'Energy IN', color: 'text-red-400' },
                  { step: 3, text: 'Form solute–solvent attractions', energy: 'Energy OUT', color: 'text-green-400' },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">{s.step}</span>
                    <span className="text-white/80 flex-1">{s.text}</span>
                    <span className={`text-xs font-medium ${s.color}`}>{s.energy}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider">Like Dissolves Like</h3>
              <p className="text-white/80 text-sm">Water is polar → dissolves polar and ionic substances.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Electrolytes vs Non-Electrolytes</h3>
              <div className="space-y-2 text-sm">
                <div className="rounded-lg p-3 border" style={{ borderColor: naclColor + '40', backgroundColor: naclColor + '08' }}>
                  <p className="font-bold" style={{ color: naclColor }}>Strong Electrolytes — dissociate into ions</p>
                  <p className="text-white/60 text-xs mt-1">NaCl, CaCl₂·2H₂O</p>
                </div>
                <div className="rounded-lg p-3 border" style={{ borderColor: sucroseColor + '40', backgroundColor: sucroseColor + '08' }}>
                  <p className="font-bold" style={{ color: sucroseColor }}>Non-Electrolyte — stays intact as one molecule</p>
                  <p className="text-white/60 text-xs mt-1">Sucrose</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Dissolution Equations</h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="bg-[#0a0f1e] rounded-lg p-3 border border-white/10">
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: sucroseColor }}>Sucrose</p>
                  <p className="text-white/90">C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)</p>
                </div>
                <div className="bg-[#0a0f1e] rounded-lg p-3 border border-white/10">
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: naclColor }}>NaCl</p>
                  <p className="text-white/90">NaCl(s) → Na⁺(aq) + Cl⁻(aq)</p>
                </div>
                <div className="bg-[#0a0f1e] rounded-lg p-3 border border-white/10">
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: cacl2Color }}>CaCl₂·2H₂O</p>
                  <p className="text-white/90">CaCl₂·2H₂O(s) → Ca²⁺(aq) + 2Cl⁻(aq) + 2H₂O(l)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 4: COLLIGATIVE PROPERTIES ───── */}
      <SectionWrap id="colligative" number={4}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 4</span>
          <h2 className="text-4xl font-black mt-1">Colligative Properties</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-3">Key Principle</h3>
              <p className="text-white/80 leading-relaxed">
                Colligative properties depend only on the <span className="text-blue-300 font-bold">NUMBER</span> of dissolved particles — not their chemical identity or size.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">The Four Colligative Properties</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Freezing Point Depression', highlight: true },
                  { name: 'Boiling Point Elevation', highlight: false },
                  { name: 'Vapor Pressure Lowering', highlight: false },
                  { name: 'Osmotic Pressure', highlight: false },
                ].map(p => (
                  <div
                    key={p.name}
                    className={`rounded-lg p-3 text-sm font-medium text-center border ${
                      p.highlight
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Why Does Freezing Point Drop?</h3>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex gap-3">
                  <span className="text-blue-400 mt-0.5">▶</span>
                  <span>Dissolved particles <strong className="text-white">get in the way</strong> of water molecules trying to form ice crystals.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-400 mt-0.5">▶</span>
                  <span><strong className="text-white">More particles = more interference = lower freezing point</strong></span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-400 mt-0.5">▶</span>
                  <span>Dissolving increases entropy (disorder), making it harder for water molecules to align into an ordered ice lattice.</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Particle Count Comparison</h3>
              <div className="space-y-2">
                {[
                  { name: 'Sucrose', i: 1, particles: '●', color: sucroseColor },
                  { name: 'NaCl', i: 2, particles: '● ●', color: naclColor },
                  { name: 'CaCl₂·2H₂O', i: 3, particles: '● ● ●', color: cacl2Color },
                ].map(s => (
                  <div key={s.name} className="flex items-center gap-3 text-sm">
                    <span className="w-24 font-medium" style={{ color: s.color }}>{s.name}</span>
                    <span className="text-white/40 text-xs">i = {s.i}</span>
                    <span className="ml-auto tracking-widest" style={{ color: s.color }}>{s.particles}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 5: THE EQUATION ───── */}
      <SectionWrap id="equation" number={5}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 5</span>
          <h2 className="text-4xl font-black mt-1">The Equation</h2>
        </div>
        <div className="text-center mb-10">
          <div className="inline-block bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-500/30 rounded-2xl px-10 py-6 shadow-[0_0_40px_#3b82f620]">
            <p className="text-5xl md:text-6xl font-black font-mono tracking-tight text-white">
              ΔT<sub className="text-3xl">f</sub> = i × K<sub className="text-3xl">f</sub> × m
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {[
              { sym: 'ΔTf', name: 'Freezing point depression', detail: 'Drop in freezing point (°C)', color: 'text-white' },
              { sym: 'i', name: "Van't Hoff factor", detail: 'Number of particles per formula unit', color: 'text-blue-400' },
              { sym: 'Kf', name: 'Cryoscopic constant', detail: '1.86 °C·kg/mol for water', color: 'text-purple-400' },
              { sym: 'm', name: 'Molality', detail: 'mol solute / kg solvent', color: 'text-cyan-400' },
            ].map(v => (
              <div key={v.sym} className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-xl p-4">
                <span className={`text-2xl font-black font-mono w-10 shrink-0 ${v.color}`}>{v.sym}</span>
                <div>
                  <p className="font-semibold text-white/90 text-sm">{v.name}</p>
                  <p className="text-white/50 text-xs">{v.detail}</p>
                </div>
              </div>
            ))}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-white/50 mb-1">Why molality and not molarity?</p>
              <p className="text-white/80 text-sm">Molality uses <strong className="text-white">mass</strong>, which doesn&apos;t change with temperature — unlike volume.</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-blue-400 font-bold mb-1 text-sm uppercase tracking-wider">Van&apos;t Hoff Factors</h3>
            <p className="text-white/40 text-xs mb-4">i values used in predictions</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { name: 'Sucrose', i: 1, color: sucroseColor },
                { name: 'NaCl', i: 2, color: naclColor },
                { name: 'CaCl₂·2H₂O', i: 3, color: cacl2Color },
              ].map(s => (
                <div key={s.name} className="rounded-xl p-3 text-center border" style={{ borderColor: s.color + '40', backgroundColor: s.color + '10' }}>
                  <p className="text-3xl font-black" style={{ color: s.color }}>{s.i}</p>
                  <p className="text-[10px] text-white/60 mt-1">{s.name}</p>
                </div>
              ))}
            </div>
            <h3 className="text-blue-400 font-bold mb-3 text-xs uppercase tracking-wider">Predicted Freezing Points (°C)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-1.5 px-2 text-left text-white/40">m</th>
                    <th className="py-1.5 px-2 text-center font-bold" style={{ color: sucroseColor }}>Sucrose</th>
                    <th className="py-1.5 px-2 text-center font-bold" style={{ color: naclColor }}>NaCl</th>
                    <th className="py-1.5 px-2 text-center font-bold" style={{ color: cacl2Color }}>CaCl₂</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { m: '0.1', s: '−0.19', n: '−0.37', c: '−0.56' },
                    { m: '0.2', s: '−0.37', n: '−0.74', c: '−1.12' },
                    { m: '0.4', s: '−0.74', n: '−1.49', c: '−2.23' },
                    { m: '0.6', s: '−1.12', n: '−2.23', c: '−3.35' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-1.5 px-2 font-mono text-white/60">{row.m}</td>
                      <td className="py-1.5 px-2 font-mono text-center" style={{ color: sucroseColor + 'cc' }}>{row.s}</td>
                      <td className="py-1.5 px-2 font-mono text-center" style={{ color: naclColor + 'cc' }}>{row.n}</td>
                      <td className="py-1.5 px-2 font-mono text-center" style={{ color: cacl2Color + 'cc' }}>{row.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 6: MATERIALS & PROCEDURE ───── */}
      <SectionWrap id="materials" number={6}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 6</span>
          <h2 className="text-4xl font-black mt-1">Materials &amp; Procedure</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Materials</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'Sucrose', 'NaCl', 'CaCl₂·2H₂O', 'Distilled water',
                  'Ice', 'Electronic balance (0.01 g)', 'Temperature probes', 'Data logger',
                  '13 test tubes', 'Graduated cylinder', 'Styrofoam cup', 'Glass stirring rods',
                  'Weighing boats', 'Safety goggles', 'Gloves', 'Lab coat',
                ].map(m => (
                  <div key={m} className="flex items-center gap-2 text-xs text-white/70">
                    <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                    {m}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4">
              <h3 className="text-amber-400 font-bold mb-2 text-sm uppercase tracking-wider">⚠ Safety</h3>
              <p className="text-white/70 text-xs">CaCl₂·2H₂O is a skin and eye irritant. <strong className="text-white">Wear gloves and goggles at all times</strong> when handling solutions.</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-blue-400 font-bold mb-4 text-sm uppercase tracking-wider">Procedure</h3>
            <ol className="space-y-3">
              {[
                'Labeled 13 test tubes and added 100 g distilled water to each.',
                'Weighed and added the correct mass of each solute using an electronic balance.',
                'Stirred each solution with a glass rod until fully dissolved.',
                'Set up ice bath with ice and 75 g NaCl; confirmed temperature below −5 °C.',
                'Inserted temperature probe into solution and lowered into ice bath.',
                'Recorded the lowest temperature reached for each solution.',
                'Repeated for all 13 solutions over two days (two trials each).',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/80">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-blue-400 font-bold mb-1 text-sm uppercase tracking-wider">Lab Photo Gallery</h3>
          <ImageGallery />
        </div>
      </SectionWrap>

      {/* ───── SLIDE 7: DATA & RESULTS ───── */}
      <SectionWrap id="data" number={7}>
        <div ref={dataRef} className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 7</span>
          <h2 className="text-4xl font-black mt-1">Data &amp; Results</h2>
        </div>

        {/* Animated stat badges */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Solutions Tested', value: 13 },
            { label: 'Trials per Solution', value: 2 },
            { label: 'Total Measurements', value: 26 },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-blue-400">
                <CountUp target={s.value} inView={dataInView} />
              </p>
              <p className="text-white/50 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Raw Data Table */}
        <div className="mb-8">
          <h3 className="text-white/70 font-bold mb-3 text-sm uppercase tracking-wider">Raw Data (°C) — Lowest Temperature Recorded</h3>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="py-2.5 px-3 text-left text-white/50 font-medium">Conc.</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: sucroseColor }}>Sucrose T1</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: sucroseColor }}>Sucrose T2</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: naclColor }}>NaCl T1</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: naclColor }}>NaCl T2</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: cacl2Color }}>CaCl₂ T1</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: cacl2Color }}>CaCl₂ T2</th>
                </tr>
              </thead>
              <tbody>
                {rawRows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                    <td className="py-2 px-3 font-mono text-white/70">{row.conc}</td>
                    {[row.s1, row.s2, row.n1, row.n2, row.c1, row.c2].map((v, j) => (
                      <td key={j} className="py-2 px-3 font-mono text-center text-white/80">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Averages vs Predicted */}
        <div>
          <h3 className="text-white/70 font-bold mb-3 text-sm uppercase tracking-wider">Averages vs. Predicted (°C)</h3>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="py-2.5 px-3 text-left text-white/50 font-medium">Conc.</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: sucroseColor }}>S Avg</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: sucroseColor }}>S Pred</th>
                  <th className="py-2.5 px-3 text-center text-white/40">% Err</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: naclColor }}>N Avg</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: naclColor }}>N Pred</th>
                  <th className="py-2.5 px-3 text-center text-white/40">% Err</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: cacl2Color }}>C Avg</th>
                  <th className="py-2.5 px-3 text-center font-bold" style={{ color: cacl2Color }}>C Pred</th>
                  <th className="py-2.5 px-3 text-center text-white/40">% Err</th>
                </tr>
              </thead>
              <tbody>
                {avgRows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                    <td className="py-2 px-3 font-mono text-white/70">{row.conc}</td>
                    <TdAvg val={row.sAvg} pred={row.sPred} />
                    <td className="py-2 px-3 font-mono text-center text-white/40">{row.sPred ?? '0'}</td>
                    <td className="py-2 px-3 text-center"><Badge pct={row.sPct} /></td>
                    <TdAvg val={row.nAvg} pred={row.nPred} />
                    <td className="py-2 px-3 font-mono text-center text-white/40">{row.nPred ?? '0'}</td>
                    <td className="py-2 px-3 text-center"><Badge pct={row.nPct} /></td>
                    <TdAvg val={row.cAvg} pred={row.cPred} />
                    <td className="py-2 px-3 font-mono text-center text-white/40">{row.cPred ?? '0'}</td>
                    <td className="py-2 px-3 text-center"><Badge pct={row.cPct} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-sm bg-green-500/20 border border-green-500/40" /> &lt;50% error</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-sm bg-yellow-500/20 border border-yellow-500/40" /> 50–100% error</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-sm bg-red-500/20 border border-red-500/40" /> &gt;100% error</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-sm bg-red-400/20 border border-red-400/40" /> More negative than predicted</span>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 8: GRAPH ───── */}
      <SectionWrap id="graph" number={8}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 8</span>
          <h2 className="text-4xl font-black mt-1">Graph</h2>
          <p className="text-white/50 mt-1 text-sm">Freezing Point Depression vs. Molality for Three Solutes</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <FreezeGraph />
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-center">
            {[
              { name: 'Sucrose', slope: '3.6', r2: '0.875', color: sucroseColor },
              { name: 'NaCl', slope: '8.65', r2: '0.736', color: naclColor },
              { name: 'CaCl₂·2H₂O', slope: '8.61', r2: '0.986', color: cacl2Color },
            ].map(s => (
              <div key={s.name} className="rounded-xl p-3 border" style={{ borderColor: s.color + '30', backgroundColor: s.color + '08' }}>
                <p className="font-bold text-sm" style={{ color: s.color }}>{s.name}</p>
                <p className="text-white/50 mt-1">Slope: {s.slope}</p>
                <p className="text-white/50">R² = {s.r2}</p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs text-center mt-3">Y-axis shows |ΔTf| — magnitude of freezing point depression. Dashed lines = trendlines (y-intercept forced through origin).</p>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 9: ANALYSIS ───── */}
      <SectionWrap id="analysis" number={9}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 9</span>
          <h2 className="text-4xl font-black mt-1">Analysis of Results</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Overall Finding</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                <strong className="text-red-400">All experimental values were more negative than predicted</strong>, suggesting systematically higher actual molalities than intended — consistent with excess solute being added.
              </p>
            </div>
            {[
              {
                name: 'Sucrose',
                color: sucroseColor,
                points: [
                  'Correct trend observed (more depression at higher concentration)',
                  'Percent errors: 114% (0.6 m) to 426% (0.1 m)',
                  'All values shifted more negative than predicted',
                ],
              },
              {
                name: 'NaCl',
                color: naclColor,
                points: [
                  'Inconsistent results — 0.4 m outlier: −6.0 °C in both trials (275.8% error)',
                  '0.2 m was closest to predicted at only 21.6% error',
                  'Lowest R² = 0.736 among the three solutes',
                ],
              },
              {
                name: 'CaCl₂·2H₂O',
                color: cacl2Color,
                points: [
                  'Most consistent results, correct trend throughout',
                  'Percent errors: 54.7% (0.4 m) to 158.9% (0.1 m)',
                  'Highest R² = 0.986 — best fit to linear model',
                ],
              },
            ].map(s => (
              <div key={s.name} className="rounded-xl p-4 border" style={{ borderColor: s.color + '30', backgroundColor: s.color + '08' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: s.color }}>{s.name}</h3>
                <ul className="space-y-1">
                  {s.points.map((p, i) => (
                    <li key={i} className="flex gap-2 text-xs text-white/70">
                      <span style={{ color: s.color }}>›</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3 text-sm uppercase tracking-wider">Primary Source of Error</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                <strong className="text-white">Excess solute</strong> was likely added to several solutions. A higher actual molality directly increases ΔTf through the equation ΔTf = i × Kf × m, shifting all results more negative.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Secondary Errors</h3>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex gap-2">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Ice bath warming between trials — bath temperature may have risen above −5 °C</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Possible incomplete dissolution for some higher-concentration solutions</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Only two trials per solution — insufficient to detect and eliminate outliers</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Percent Error Summary</h3>
              <div className="space-y-2">
                {[
                  { name: 'Sucrose', range: '114% – 426%', color: sucroseColor },
                  { name: 'NaCl (excl. outlier)', range: '22% – 275%', color: naclColor },
                  { name: 'CaCl₂·2H₂O', range: '55% – 159%', color: cacl2Color },
                ].map(s => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <span style={{ color: s.color }}>{s.name}</span>
                    <span className="font-mono text-white/60 text-xs">{s.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 10: ICE CREAM ───── */}
      <SectionWrap id="icecream" number={10}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 10</span>
          <h2 className="text-4xl font-black mt-1">Ice Cream Application 🍦</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border border-blue-500/20 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">How a Salt–Ice Bath Works</h3>
              <ol className="space-y-2 text-sm text-white/80">
                {[
                  'NaCl dissolves in the thin film of liquid water on ice surface',
                  'Dissolved Na⁺ and Cl⁻ lower the freezing point of that water',
                  'Ice melts endothermically, absorbing heat from surroundings',
                  'Bath temperature drops below 0 °C — cold enough to freeze cream',
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-xl p-5 border" style={{ borderColor: cacl2Color + '40', backgroundColor: cacl2Color + '08' }}>
              <h3 className="font-bold mb-2 text-sm uppercase tracking-wider" style={{ color: cacl2Color }}>Why CaCl₂·2H₂O Makes a Better Ice Cream Bath</h3>
              <p className="text-white/80 text-sm">With i = 3, CaCl₂·2H₂O produces <strong className="text-white">50% more particles</strong> than NaCl (i = 2), creating a colder bath and freezing the cream faster.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl p-5 border" style={{ borderColor: sucroseColor + '40', backgroundColor: sucroseColor + '08' }}>
              <h3 className="font-bold mb-2 text-sm uppercase tracking-wider" style={{ color: sucroseColor }}>Why Ice Cream Stays Scoopable</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                The sucrose dissolved in ice cream depresses <em>its own</em> freezing point to approximately −2 to −3 °C, keeping it soft enough to scoop even when fully frozen.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Real-World Applications</h3>
              <div className="space-y-2 text-sm text-white/80">
                {[
                  { icon: '🛣️', text: 'Road de-icing with NaCl and MgCl₂ in winter' },
                  { icon: '🚗', text: 'Antifreeze (ethylene glycol) in car radiators' },
                  { icon: '🏭', text: 'Food science — controlling texture in frozen products' },
                  { icon: '🧪', text: 'Laboratory cryogenic baths for temperature control' },
                ].map(a => (
                  <div key={a.text} className="flex gap-3">
                    <span className="shrink-0">{a.icon}</span>
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-blue-500/20 rounded-xl p-4">
              <p className="text-white/70 text-sm italic">
                &ldquo;The experiment directly demonstrated the same chemistry that keeps roads safe in winter and ice cream soft in the freezer.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 11: CONCLUSIONS ───── */}
      <SectionWrap id="conclusions" number={11}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 11</span>
          <h2 className="text-4xl font-black mt-1">Conclusions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border border-blue-500/20 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Was the Hypothesis Supported?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                <strong className="text-yellow-400">Partially supported.</strong>
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  CaCl₂·2H₂O produced the largest depression at every concentration
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  Sucrose produced the smallest depression at every concentration
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400 shrink-0">✗</span>
                  All experimental values were significantly larger than predicted due to experimental error
                </li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Key Findings</h3>
              <div className="space-y-2 text-sm">
                {[
                  { name: 'CaCl₂·2H₂O', label: 'Most consistent', note: 'R² = 0.986', color: cacl2Color },
                  { name: 'NaCl', label: 'Most variable', note: 'R² = 0.736, 0.4 m outlier', color: naclColor },
                  { name: 'Sucrose', label: 'Correct trend', note: 'Largest relative errors', color: sucroseColor },
                ].map(s => (
                  <div key={s.name} className="flex items-center gap-3 rounded-lg p-2.5 border" style={{ borderColor: s.color + '30', backgroundColor: s.color + '08' }}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="font-medium text-sm" style={{ color: s.color }}>{s.name}</span>
                    <span className="text-white/60 text-xs">{s.label}</span>
                    <span className="ml-auto text-white/40 text-xs font-mono">{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Recommendations</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {[
                  'Use a balance accurate to 0.001 g for more precise solute masses',
                  'Monitor ice bath temperature before every trial to ensure consistent conditions',
                  'Run three trials instead of two to identify and exclude outliers',
                  'Ensure complete dissolution (visually and with additional stirring) before testing',
                ].map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-400 shrink-0">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-wider">Further Research</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {[
                  'Test MgCl₂ (i = 3) or KCl (i = 2) as additional electrolytes',
                  'Test higher concentrations to identify linearity limits',
                  'Compare salt effectiveness for hand-cranked ice cream making',
                ].map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-purple-400 shrink-0">◆</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 12: REFERENCES ───── */}
      <SectionWrap id="references" number={12}>
        <div className="mb-8">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Section 12</span>
          <h2 className="text-4xl font-black mt-1">References</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Rutto, Patrick K., and C. Eugene Bennett. Journal of Chemical Education 99, no. 10 (2022): 3590–3594.',
            'Florida State University Department of Chemistry. Colligative Properties of Solutions. 2026.',
            'Wikipedia contributors. Colligative Properties. 2024.',
            'Lumen Learning. The Dissolution Process. SUNY OER Services. 2026.',
            'ChemTeam. Freezing Point Depression. 2026.',
            'LibreTexts Chemistry. Solutions of Electrolytes. 2023.',
            'LibreTexts Chemistry. Determination of Molar Mass by Freezing Point Depression. 2026.',
            'Wikipedia contributors. Van\'t Hoff Factor. 2025.',
            'Open Maricopa. Colligative Properties of Electrolyte Solutions. 2026.',
            'University of Georgia Extension. Using Freezing-Point Depression to Find Molecular Weight. 2026.',
            'IU East. Using Freezing Point Depression to Determine Molar Mass. 2021.',
            'Chad\'s Prep. 13.3 Colligative Properties. 2025.',
          ].map((ref, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex gap-3 bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-xl p-4 transition-colors"
            >
              <span className="text-blue-400 font-bold text-sm shrink-0 mt-0.5">[{i + 1}]</span>
              <p className="text-white/70 text-sm leading-relaxed">{ref}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center text-white/20 text-xs">
          <p>Ice Cream and Freezing Point Depression of Various Solutes</p>
          <p className="mt-1">Jordan &amp; Colin · Science Exposition Chemistry · May 2026</p>
        </div>
      </SectionWrap>
    </div>
  )
}
