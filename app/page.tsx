'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import ParticleBackground from './components/ParticleBackground'
import ImageGallery, { type Photo } from './components/ImageGallery'

const LAB_PHOTOS: Photo[] = [
  { src: 'lab1.png',  caption: 'Labeling 13 test tubes before adding distilled water' },
  { src: 'lab2.png',  caption: 'Measuring 100 g of distilled water into each test tube' },
  { src: 'lab3.png',  caption: 'Weighing sucrose on the electronic balance (±0.01 g)' },
  { src: 'lab4.png',  caption: 'Weighing NaCl for 0.4 m and 0.6 m solutions' },
  { src: 'lab6.png',  caption: 'Stirring each solution with a glass rod until fully dissolved' },
  { src: 'lab7.png',  caption: 'Building the ice-salt bath: ice + 75 g NaCl in Styrofoam cup' },
  { src: 'lab8.png',  caption: 'Confirming ice bath temperature below −5 °C before testing' },
  { src: 'lab9.png',  caption: 'Lowering a test tube into the ice bath with temperature probe inserted' },
  { src: 'lab10.png', caption: 'Data logger recording the lowest temperature reached by the solution' },
  { src: 'lab11.png', caption: 'All 13 solutions lined up after testing — Day 2 complete' },
]

const SECTIONS = [
  { id: 'title',        label: 'Title' },
  { id: 'introduction', label: 'Introduction' },
  { id: 'solutions',    label: 'Solutions' },
  { id: 'colligative',  label: 'Colligative' },
  { id: 'equation',     label: 'Equation' },
  { id: 'materials',    label: 'Materials' },
  { id: 'data',         label: 'Data' },
  { id: 'graph',        label: 'Graph' },
  { id: 'analysis',     label: 'Analysis' },
  { id: 'icecream',     label: 'Ice Cream' },
  { id: 'conclusions',  label: 'Conclusions' },
  { id: 'references',   label: 'References' },
]

// Accent color per section — cycles coral / mint / sky
const ACCENT: Record<string, string> = {
  introduction: '#ff6b6b',
  solutions:    '#4ecdc4',
  colligative:  '#45b7d1',
  equation:     '#ff6b6b',
  materials:    '#4ecdc4',
  data:         '#45b7d1',
  graph:        '#ff6b6b',
  analysis:     '#4ecdc4',
  icecream:     '#ff6b6b',
  conclusions:  '#45b7d1',
  references:   '#4ecdc4',
}

// Alternating section backgrounds
const SECTION_BG: Record<string, string> = {
  introduction: '#fffef7',
  solutions:    '#f0fffd',
  colligative:  '#f0f9ff',
  equation:     '#fff5f5',
  materials:    '#fffef7',
  data:         '#fffde7',
  graph:        '#ffffff',
  analysis:     '#fff5f5',
  icecream:     '#f0fffd',
  conclusions:  '#f0f9ff',
  references:   '#fffef7',
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function scrollToNext(currentId: string) {
  const idx = SECTIONS.findIndex(s => s.id === currentId)
  if (idx < SECTIONS.length - 1) scrollTo(SECTIONS[idx + 1].id)
}

type Accent = 'coral' | 'mint' | 'sky'
const accentClasses: Record<Accent, { text: string; bg: string; border: string }> = {
  coral: { text: 'text-[#ff6b6b]', bg: 'bg-[#ff6b6b]/10', border: 'border-[#ff6b6b]/30' },
  mint:  { text: 'text-[#4ecdc4]', bg: 'bg-[#4ecdc4]/10', border: 'border-[#4ecdc4]/30' },
  sky:   { text: 'text-[#45b7d1]', bg: 'bg-[#45b7d1]/10', border: 'border-[#45b7d1]/30' },
}

function SectionWrap({
  id,
  number,
  children,
}: {
  id: string
  number: number
  children: React.ReactNode
}) {
  const bg = SECTION_BG[id] ?? '#fffef7'
  return (
    <section
      id={id}
      className="relative flex items-center justify-center overflow-hidden py-14 px-4"
      style={{ background: bg }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[18rem] font-black leading-none" style={{ color: 'rgba(0,0,0,0.035)' }}>
          {number}
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl mx-auto"
      >
        {children}
      </motion.div>
      <button
        onClick={() => scrollToNext(id)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-300 hover:text-[#ff6b6b] transition-colors"
      >
        <span className="text-[9px] uppercase tracking-widest font-semibold">Next</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown size={18} />
        </motion.div>
      </button>
    </section>
  )
}

function SectionLabel({ id, text }: { id: string; text: string }) {
  const color = ACCENT[id] ?? '#ff6b6b'
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} />
      <span className="text-sm font-bold uppercase tracking-widest" style={{ color }}>{text}</span>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-5 ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ color, children }: { color?: string; children: React.ReactNode }) {
  return (
    <h3 className="font-bold mb-3 text-sm uppercase tracking-wider" style={{ color: color ?? '#9ca3af' }}>
      {children}
    </h3>
  )
}

function Badge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-gray-300 text-xs">—</span>
  const color = pct < 50
    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
    : pct < 100
    ? 'bg-amber-50 text-amber-600 border-amber-200'
    : 'bg-red-50 text-red-500 border-red-200'
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded-lg text-[10px] font-mono border ${color}`}>
      {pct.toFixed(0)}%
    </span>
  )
}

function TdAvg({ val, pred }: { val: number; pred: number | null }) {
  if (pred === null) return <td className="px-3 py-2 font-mono text-gray-500 text-sm">{val}</td>
  const tooNeg = val < pred
  return (
    <td className={`px-3 py-2 font-mono text-sm font-semibold ${tooNeg ? 'text-red-500' : 'text-emerald-600'}`}>
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
  const dataRef = useRef<HTMLDivElement>(null)
  const [dataInView, setDataInView] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }) },
      { threshold: 0.3 }
    )
    SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el) })
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

  const handleNavClick = useCallback((id: string) => { scrollTo(id) }, [])

  const sucroseColor = '#4ecdc4'
  const naclColor    = '#45b7d1'
  const cacl2Color   = '#ff6b6b'

  const rawRows = [
    { conc: 'Control', s1: -0.5, s2: -0.3, n1: -0.5, n2: -0.3, c1: -0.5, c2: -0.3 },
    { conc: '0.1 m',   s1: -1.2, s2: -1.6, n1: -1.1, n2: -1.6, c1: -1.8, c2: -1.9 },
    { conc: '0.2 m',   s1: -1.7, s2: -2.2, n1: -1.0, n2: -1.6, c1: -2.4, c2: -2.5 },
    { conc: '0.4 m',   s1: -2.2, s2: -2.5, n1: -6.0, n2: -6.0, c1: -3.8, c2: -3.9 },
    { conc: '0.6 m',   s1: -2.7, s2: -2.9, n1: -4.7, n2: -4.5, c1: -5.7, c2: -6.1 },
  ]

  const avgRows = [
    { conc: 'Control', sAvg: -0.4, sPred: null, sPct: null, nAvg: -0.4, nPred: null, nPct: null, cAvg: -0.4, cPred: null, cPct: null },
    { conc: '0.1 m', sAvg: -1.40, sPred: -0.19, sPct: 426, nAvg: -1.35, nPred: -0.37, nPct: 157, cAvg: -1.85, cPred: -0.56, cPct: 159 },
    { conc: '0.2 m', sAvg: -1.95, sPred: -0.37, sPct: 319, nAvg: -1.30, nPred: -0.74, nPct: 22,  cAvg: -2.45, cPred: -1.12, cPct: 83  },
    { conc: '0.4 m', sAvg: -2.35, sPred: -0.74, sPct: 164, nAvg: -6.00, nPred: -1.49, nPct: 276, cAvg: -3.85, cPred: -2.23, cPct: 55  },
    { conc: '0.6 m', sAvg: -2.80, sPred: -1.12, sPct: 114, nAvg: -4.60, nPred: -2.23, nPct: 88,  cAvg: -5.90, cPred: -3.35, cPct: 64  },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#fffef7', color: '#1a1a2e' }}>

      {/* Progress bar */}
      <motion.div
        style={{ scaleX, background: 'linear-gradient(to right, #ff6b6b, #ffe66d, #4ecdc4, #45b7d1)' }}
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
      />

      {/* Floating Navbar */}
      <nav className="fixed top-2 left-0 right-0 z-40 flex justify-center px-4">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-full px-3 py-1.5 flex gap-0.5 hide-scrollbar max-w-full overflow-x-auto shadow-md">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 ${
                activeSection === id
                  ? 'text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
              style={activeSection === id ? { background: ACCENT[id] ?? '#ff6b6b' } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Side dot navigation */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2.5 hidden lg:flex">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            title={label}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300 border-2"
            style={{
              background: activeSection === id ? (ACCENT[id] ?? '#ff6b6b') : 'transparent',
              borderColor: activeSection === id ? (ACCENT[id] ?? '#ff6b6b') : '#d1d5db',
              transform: activeSection === id ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* ───── SLIDE 1: TITLE ───── */}
      <section id="title" className="relative min-h-screen flex items-center justify-center overflow-hidden ice-pattern">
        {mounted && <ParticleBackground />}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffef7]/60 via-transparent to-[#fffef7]/60 pointer-events-none" />

        {/* Floating ice cream decorations */}
        <span className="absolute top-24 left-8 text-5xl opacity-20 select-none" style={{ transform: 'rotate(12deg)' }}>🍦</span>
        <span className="absolute top-16 right-12 text-4xl opacity-15 select-none" style={{ transform: 'rotate(-8deg)' }}>🍨</span>
        <span className="absolute bottom-28 left-16 text-3xl opacity-20 select-none" style={{ transform: 'rotate(6deg)' }}>🍡</span>
        <span className="absolute bottom-20 right-10 text-4xl opacity-15 select-none" style={{ transform: 'rotate(-12deg)' }}>🧁</span>
        <span className="absolute top-1/3 left-4 text-2xl opacity-10 select-none" style={{ transform: 'rotate(20deg)' }}>🍦</span>
        <span className="absolute top-1/2 right-6 text-2xl opacity-10 select-none" style={{ transform: 'rotate(-15deg)' }}>🍨</span>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
            style={{ background: '#ff6b6b15', border: '2px solid #ff6b6b40', color: '#ff6b6b' }}
          >
            🧪 Science Exposition Chemistry
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="gradient-title text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-3 tracking-tight"
          >
            Ice Cream and Freezing Point Depression
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-2xl font-bold text-gray-500 mb-8"
          >
            of Various Solutes 🍦
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="space-y-1 text-gray-500 text-xl"
          >
            <p className="font-bold text-gray-700 text-2xl">Jordan &amp; Colin</p>
            <p>May 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-10"
          >
            <button
              onClick={() => scrollToNext('title')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-base transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #ff6b6b, #45b7d1)' }}
            >
              Begin Presentation
              <ChevronDown size={18} />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── SLIDE 2: INTRODUCTION ───── */}
      <SectionWrap id="introduction" number={2}>
        <SectionLabel id="introduction" text="Section 2 — Introduction & Hypothesis" />
        <h2 className="text-5xl font-black mb-8 text-gray-900">Introduction &amp; Hypothesis</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <Card>
              <CardHeader color="#ff6b6b">Real-World Hook</CardHeader>
              <p className="text-gray-700 text-lg leading-relaxed">
                Roads stay ice-free after salting because dissolved salt lowers the freezing point of water.
              </p>
            </Card>
            <Card>
              <CardHeader color="#ff6b6b">Purpose</CardHeader>
              <p className="text-gray-700 text-lg leading-relaxed">
                Investigate how the <strong className="text-gray-900">type of solute</strong> and its <strong className="text-gray-900">concentration</strong> affect the freezing point of water.
              </p>
            </Card>
            <Card>
              <CardHeader color="#ff6b6b">Experimental Design</CardHeader>
              <div className="space-y-2 text-gray-700 text-base">
                <p>Three solutes tested at four concentrations each</p>
                <p>12 solutions plus 1 control (distilled water)</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { name: 'Sucrose', formula: 'C₁₂H₂₂O₁₁', color: sucroseColor },
                    { name: 'NaCl',    formula: 'NaCl',       color: naclColor },
                    { name: 'CaCl₂·2H₂O', formula: 'CaCl₂·2H₂O', color: cacl2Color },
                  ].map(s => (
                    <div key={s.name} className="rounded-2xl p-2.5 text-center border-2" style={{ borderColor: s.color + '50', backgroundColor: s.color + '12' }}>
                      <p className="font-black text-sm" style={{ color: s.color }}>{s.name}</p>
                      <p className="text-gray-400 text-[11px] font-mono mt-0.5">{s.formula}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2">Concentrations: 0.1 m, 0.2 m, 0.4 m, 0.6 m</p>
              </div>
            </Card>
          </div>
          <div className="rounded-3xl p-6 border-2" style={{ background: '#fff5f5', borderColor: '#ff6b6b30' }}>
            <CardHeader color="#ff6b6b">Hypothesis</CardHeader>
            <p className="text-gray-700 text-lg leading-relaxed mb-5">
              CaCl₂·2H₂O will produce the <strong className="text-gray-900">largest freezing point depression</strong>, NaCl the second largest, and sucrose the least. Depression will also scale linearly with concentration.
            </p>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Predicted Ranking</p>
            <div className="space-y-2">
              {[
                { rank: 1, name: 'CaCl₂·2H₂O', color: cacl2Color },
                { rank: 2, name: 'NaCl',        color: naclColor },
                { rank: 3, name: 'Sucrose',      color: sucroseColor },
              ].map(r => (
                <div key={r.rank} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-2.5 shadow-sm">
                  <span className="text-gray-300 font-black text-base w-6">#{r.rank}</span>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                  <span className="font-bold text-base" style={{ color: r.color }}>{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 3: SOLUTIONS ───── */}
      <SectionWrap id="solutions" number={3}>
        <SectionLabel id="solutions" text="Section 3 — Solutions & Dissolving" />
        <h2 className="text-5xl font-black mb-8 text-gray-900">Solutions &amp; Dissolving</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <Card>
              <CardHeader color="#4ecdc4">What Is a Solution?</CardHeader>
              <p className="text-gray-700 text-base leading-relaxed">
                A <strong className="text-gray-900">homogeneous mixture</strong> where a solute dissolves in a solvent. In this experiment, water is always the solvent.
              </p>
            </Card>
            <Card>
              <CardHeader color="#4ecdc4">Three Steps of Dissolving</CardHeader>
              <div className="space-y-2.5">
                {[
                  { step: 1, text: 'Break solute bonds', energy: 'Energy IN',  color: '#ff6b6b' },
                  { step: 2, text: 'Disrupt solvent bonds', energy: 'Energy IN',  color: '#ff6b6b' },
                  { step: 3, text: 'Form solute–solvent attractions', energy: 'Energy OUT', color: '#4ecdc4' },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: '#4ecdc4' }}>{s.step}</span>
                    <span className="text-gray-700 text-base flex-1">{s.text}</span>
                    <span className="text-sm font-bold" style={{ color: s.color }}>{s.energy}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader color="#4ecdc4">Like Dissolves Like</CardHeader>
              <p className="text-gray-700 text-base">Water is polar so it dissolves polar and ionic substances.</p>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader color="#4ecdc4">Electrolytes vs Non-Electrolytes</CardHeader>
              <div className="space-y-2.5">
                <div className="rounded-2xl p-3.5 border-2" style={{ borderColor: naclColor + '40', backgroundColor: naclColor + '10' }}>
                  <p className="font-black text-base" style={{ color: naclColor }}>Strong Electrolytes dissociate into ions</p>
                  <p className="text-gray-500 text-sm mt-0.5">NaCl, CaCl₂·2H₂O</p>
                </div>
                <div className="rounded-2xl p-3.5 border-2" style={{ borderColor: sucroseColor + '40', backgroundColor: sucroseColor + '10' }}>
                  <p className="font-black text-base" style={{ color: sucroseColor }}>Non-Electrolytes stay intact as one molecule</p>
                  <p className="text-gray-500 text-sm mt-0.5">Sucrose</p>
                </div>
              </div>
            </Card>
            <Card>
              <CardHeader color="#4ecdc4">Dissolution Equations</CardHeader>
              <div className="space-y-2.5 font-mono text-base">
                {[
                  { label: 'Sucrose', color: sucroseColor, eq: 'C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)' },
                  { label: 'NaCl',    color: naclColor,    eq: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq)' },
                  { label: 'CaCl₂·2H₂O', color: cacl2Color, eq: 'CaCl₂·2H₂O(s) → Ca²⁺(aq) + 2Cl⁻(aq) + 2H₂O(l)' },
                ].map(e => (
                  <div key={e.label} className="rounded-2xl p-3 border border-gray-100" style={{ background: e.color + '08' }}>
                    <p className="text-[11px] font-black uppercase tracking-wider mb-1" style={{ color: e.color }}>{e.label}</p>
                    <p className="text-gray-800 text-sm">{e.eq}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 4: COLLIGATIVE PROPERTIES ───── */}
      <SectionWrap id="colligative" number={4}>
        <SectionLabel id="colligative" text="Section 4 — Colligative Properties" />
        <h2 className="text-5xl font-black mb-8 text-gray-900">Colligative Properties</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="rounded-3xl p-6 border-2" style={{ background: 'linear-gradient(135deg, #4ecdc415, #45b7d115)', borderColor: '#45b7d130' }}>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Key Principle</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Colligative properties depend only on the <span className="font-black" style={{ color: '#45b7d1' }}>NUMBER</span> of dissolved particles — not their identity.
              </p>
            </div>
            <Card>
              <CardHeader color="#45b7d1">The Four Colligative Properties</CardHeader>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Freezing Point Depression', highlight: true },
                  { name: 'Boiling Point Elevation',   highlight: false },
                  { name: 'Vapor Pressure Lowering',   highlight: false },
                  { name: 'Osmotic Pressure',          highlight: false },
                ].map(p => (
                  <div
                    key={p.name}
                    className="rounded-2xl p-3 text-sm font-bold text-center border-2"
                    style={p.highlight
                      ? { background: '#45b7d115', borderColor: '#45b7d140', color: '#45b7d1' }
                      : { background: '#f9fafb', borderColor: '#f3f4f6', color: '#9ca3af' }
                    }
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card>
            <CardHeader color="#45b7d1">Why Does Freezing Point Drop?</CardHeader>
            <div className="space-y-4">
              {[
                'Dissolved particles get in the way of water molecules trying to form ice crystals.',
                'More particles means more interference which means a lower freezing point.',
                'Dissolving increases disorder and makes it harder for water to form ice.',
              ].map((point, i) => (
                <div key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5" style={{ background: '#45b7d1' }}>{i + 1}</span>
                  <p className="text-gray-700 text-base leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 5: THE EQUATION ───── */}
      <SectionWrap id="equation" number={5}>
        <SectionLabel id="equation" text="Section 5 — The Equation" />
        <h2 className="text-5xl font-black mb-6 text-gray-900">The Equation</h2>
        <div className="text-center mb-8">
          <div className="inline-block rounded-3xl px-10 py-6 border-2 shadow-lg" style={{ background: '#fff5f5', borderColor: '#ff6b6b30' }}>
            <p className="text-5xl md:text-6xl font-black font-mono tracking-tight text-gray-900">
              ΔT<sub className="text-3xl">f</sub> = i × K<sub className="text-3xl">f</sub> × m
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-3">
            {[
              { sym: 'ΔTf', name: 'Drop in freezing point',         detail: 'in degrees Celsius',              color: '#ff6b6b' },
              { sym: 'i',   name: "Van't Hoff factor",               detail: 'Number of particles per formula unit', color: '#4ecdc4' },
              { sym: 'Kf',  name: '1.86 °C·kg/mol for water',        detail: '',                                color: '#45b7d1' },
              { sym: 'm',   name: 'Molality',                        detail: 'Moles of solute per kilogram of solvent', color: '#ff6b6b' },
            ].map(v => (
              <div key={v.sym} className="flex gap-4 items-start bg-white rounded-3xl border border-gray-100 shadow-sm p-4">
                <span className="text-2xl font-black font-mono w-10 shrink-0 mt-0.5" style={{ color: v.color }}>{v.sym}</span>
                <div>
                  <p className="font-bold text-gray-900 text-base">{v.name}</p>
                  {v.detail && <p className="text-gray-500 text-sm">{v.detail}</p>}
                </div>
              </div>
            ))}
            <Card>
              <p className="text-gray-500 text-sm mb-1 font-semibold">Why molality and not molarity?</p>
              <p className="text-gray-700 text-base">Molality is used instead of molarity because mass does not change with temperature.</p>
            </Card>
          </div>
          <Card>
            <CardHeader color="#ff6b6b">Van&apos;t Hoff Factors</CardHeader>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { name: 'Sucrose',      i: 1, color: sucroseColor },
                { name: 'NaCl',        i: 2, color: naclColor },
                { name: 'CaCl₂·2H₂O', i: 3, color: cacl2Color },
              ].map(s => (
                <div key={s.name} className="rounded-2xl p-3 text-center border-2" style={{ borderColor: s.color + '40', backgroundColor: s.color + '12' }}>
                  <p className="text-4xl font-black" style={{ color: s.color }}>{s.i}</p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-1">{s.name}</p>
                </div>
              ))}
            </div>
            <CardHeader color="#ff6b6b">Predicted Freezing Points (°C)</CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-2 px-2 text-left text-gray-400 font-semibold">m</th>
                    <th className="py-2 px-2 text-center font-black" style={{ color: sucroseColor }}>Sucrose</th>
                    <th className="py-2 px-2 text-center font-black" style={{ color: naclColor }}>NaCl</th>
                    <th className="py-2 px-2 text-center font-black" style={{ color: cacl2Color }}>CaCl₂</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { m: '0.1', s: '−0.19', n: '−0.37', c: '−0.56' },
                    { m: '0.2', s: '−0.37', n: '−0.74', c: '−1.12' },
                    { m: '0.4', s: '−0.74', n: '−1.49', c: '−2.23' },
                    { m: '0.6', s: '−1.12', n: '−2.23', c: '−3.35' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-2 font-mono font-semibold text-gray-500">{row.m}</td>
                      <td className="py-2 px-2 font-mono text-center font-semibold" style={{ color: sucroseColor }}>{row.s}</td>
                      <td className="py-2 px-2 font-mono text-center font-semibold" style={{ color: naclColor }}>{row.n}</td>
                      <td className="py-2 px-2 font-mono text-center font-semibold" style={{ color: cacl2Color }}>{row.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 6: MATERIALS & PROCEDURE ───── */}
      <SectionWrap id="materials" number={6}>
        <SectionLabel id="materials" text="Section 6 — Materials & Procedure" />
        <h2 className="text-5xl font-black mb-8 text-gray-900">Materials &amp; Procedure</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <Card>
              <CardHeader color="#4ecdc4">Materials</CardHeader>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Sucrose', 'NaCl', 'CaCl₂·2H₂O', 'Distilled water',
                  'Ice', 'Electronic balance (0.01 g)', 'Temperature probes', 'Data logger',
                  '13 test tubes', 'Graduated cylinder', 'Styrofoam cup', 'Glass stirring rods',
                  'Weighing boats', 'Safety goggles', 'Gloves', 'Lab coat',
                ].map(m => (
                  <div key={m} className="flex items-center gap-2 text-gray-600 text-sm">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#4ecdc4' }} />
                    {m}
                  </div>
                ))}
              </div>
            </Card>
            <div className="rounded-3xl p-4 border-2" style={{ background: '#fffbeb', borderColor: '#f59e0b40' }}>
              <CardHeader color="#f59e0b">⚠ Safety</CardHeader>
              <p className="text-gray-700 text-base">CaCl₂·2H₂O is a skin and eye irritant. <strong className="text-gray-900">Wear gloves and goggles at all times</strong> when handling solutions.</p>
            </div>
          </div>
          <Card>
            <CardHeader color="#4ecdc4">Procedure</CardHeader>
            <ol className="space-y-3">
              {[
                'Labeled 13 test tubes and added 100 g distilled water to each.',
                'Weighed and added the correct mass of each solute.',
                'Stirred each solution until fully dissolved.',
                'Set up the ice bath with 75 g NaCl and made sure the temperature was below −5 °C.',
                'Inserted the temperature probe and lowered each solution into the ice bath.',
                'Recorded the lowest temperature reached for each solution.',
                'Repeated for all 13 solutions over two days.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-gray-700 text-base">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5" style={{ background: '#4ecdc4' }}>{i + 1}</span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
        <div className="mt-5">
          <p className="font-black text-[#4ecdc4] text-sm uppercase tracking-wider mb-2">Lab Photo Gallery</p>
          <ImageGallery photos={LAB_PHOTOS} />
        </div>
      </SectionWrap>

      {/* ───── SLIDE 7: DATA & RESULTS ───── */}
      <SectionWrap id="data" number={7}>
        <div ref={dataRef}>
          <SectionLabel id="data" text="Section 7 — Data & Results" />
          <h2 className="text-5xl font-black mb-8 text-gray-900">Data &amp; Results</h2>
        </div>

        {/* Stat badges */}
        <div className="grid grid-cols-3 gap-4 mb-7">
          {[
            { label: 'Solutions Tested',    value: 13, color: cacl2Color },
            { label: 'Trials per Solution', value: 2,  color: naclColor },
            { label: 'Total Measurements',  value: 26, color: sucroseColor },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 text-center">
              <p className="text-4xl font-black" style={{ color: s.color }}>
                <CountUp target={s.value} inView={dataInView} />
              </p>
              <p className="text-gray-500 text-sm font-semibold mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Raw Data */}
        <div className="mb-6">
          <p className="font-black text-gray-400 mb-3 text-sm uppercase tracking-wider">Raw Data (°C) — Lowest Temperature Recorded</p>
          <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="py-3 px-3 text-left text-gray-400 font-semibold">Conc.</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: sucroseColor }}>Sucrose T1</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: sucroseColor }}>Sucrose T2</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: naclColor }}>NaCl T1</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: naclColor }}>NaCl T2</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: cacl2Color }}>CaCl₂ T1</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: cacl2Color }}>CaCl₂ T2</th>
                </tr>
              </thead>
              <tbody>
                {rawRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-gray-600">{row.conc}</td>
                    {[row.s1, row.s2, row.n1, row.n2, row.c1, row.c2].map((v, j) => (
                      <td key={j} className="py-2.5 px-3 font-mono text-center text-gray-700 font-semibold">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Averages vs Predicted */}
        <div>
          <p className="font-black text-gray-400 mb-3 text-sm uppercase tracking-wider">Averages vs. Predicted (°C)</p>
          <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="py-3 px-3 text-left text-gray-400 font-semibold">Conc.</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: sucroseColor }}>S Avg</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: sucroseColor }}>S Pred</th>
                  <th className="py-3 px-3 text-center text-gray-400 font-semibold">% Err</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: naclColor }}>N Avg</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: naclColor }}>N Pred</th>
                  <th className="py-3 px-3 text-center text-gray-400 font-semibold">% Err</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: cacl2Color }}>C Avg</th>
                  <th className="py-3 px-3 text-center font-black" style={{ color: cacl2Color }}>C Pred</th>
                  <th className="py-3 px-3 text-center text-gray-400 font-semibold">% Err</th>
                </tr>
              </thead>
              <tbody>
                {avgRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-gray-600">{row.conc}</td>
                    <TdAvg val={row.sAvg} pred={row.sPred} />
                    <td className="py-2.5 px-3 font-mono text-center text-gray-400 font-semibold">{row.sPred ?? '0'}</td>
                    <td className="py-2.5 px-3 text-center"><Badge pct={row.sPct} /></td>
                    <TdAvg val={row.nAvg} pred={row.nPred} />
                    <td className="py-2.5 px-3 font-mono text-center text-gray-400 font-semibold">{row.nPred ?? '0'}</td>
                    <td className="py-2.5 px-3 text-center"><Badge pct={row.nPct} /></td>
                    <TdAvg val={row.cAvg} pred={row.cPred} />
                    <td className="py-2.5 px-3 font-mono text-center text-gray-400 font-semibold">{row.cPred ?? '0'}</td>
                    <td className="py-2.5 px-3 text-center"><Badge pct={row.cPct} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400 font-semibold">
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-md bg-emerald-100 border border-emerald-200" /> Under 50% error</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-md bg-amber-100 border border-amber-200" /> 50–100% error</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-md bg-red-100 border border-red-200" /> Over 100% error</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-md" style={{ background: '#ff6b6b22', border: '1px solid #ff6b6b50' }} /> More negative than predicted</span>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 8: GRAPH ───── */}
      <SectionWrap id="graph" number={8}>
        <SectionLabel id="graph" text="Section 8 — Graph" />
        <h2 className="text-5xl font-black mb-2 text-gray-900">Graph</h2>
        <p className="text-gray-500 text-lg font-semibold mb-6">Freezing Point Depression vs. Molality for Three Solutes</p>
        <Card>
          <div className="relative w-full rounded-2xl overflow-hidden bg-white">
            <Image
              src="/images/lab5.png"
              alt="Freezing Point Depression vs. Molality for Three Solutes"
              width={591}
              height={378}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              { name: 'Sucrose',      slope: '3.6',  r2: '0.875', color: sucroseColor },
              { name: 'NaCl',        slope: '8.65', r2: '0.736', color: naclColor },
              { name: 'CaCl₂·2H₂O', slope: '8.61', r2: '0.986', color: cacl2Color },
            ].map(s => (
              <div key={s.name} className="rounded-2xl p-3 border-2" style={{ borderColor: s.color + '30', backgroundColor: s.color + '08' }}>
                <p className="font-black text-base" style={{ color: s.color }}>{s.name}</p>
                <p className="text-gray-500 text-sm mt-1 font-semibold">Slope: {s.slope}</p>
                <p className="text-gray-500 text-sm font-semibold">R² = {s.r2}</p>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>

      {/* ───── SLIDE 9: ANALYSIS ───── */}
      <SectionWrap id="analysis" number={9}>
        <SectionLabel id="analysis" text="Section 9 — Analysis of Results" />
        <h2 className="text-5xl font-black mb-8 text-gray-900">Analysis of Results</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <Card>
              <CardHeader color="#4ecdc4">Overall Finding</CardHeader>
              <p className="text-gray-700 text-base leading-relaxed">
                <strong className="text-red-500">All experimental values were more negative than predicted.</strong>
              </p>
            </Card>
            {[
              {
                name: 'Sucrose',
                color: sucroseColor,
                points: [
                  'The trend was correct with more depression at higher concentrations.',
                  'Percent error ranged from 114% at 0.6 m to 426% at 0.1 m.',
                  'All values were more negative than predicted.',
                ],
              },
              {
                name: 'NaCl',
                color: naclColor,
                points: [
                  'The results were inconsistent and the 0.4 m outlier was −6.0 °C in both trials at 275.8% error.',
                  '0.2 m was closest to predicted at only 21.6% error.',
                  'It had the lowest R² value at 0.736.',
                ],
              },
              {
                name: 'CaCl₂·2H₂O',
                color: cacl2Color,
                points: [
                  'Most consistent results with the correct trend throughout.',
                  'Percent error ranged from 54.7% at 0.4 m to 158.9% at 0.1 m.',
                  'Most consistent results with R² = 0.986.',
                ],
              },
            ].map(s => (
              <div key={s.name} className="rounded-3xl p-4 border-2" style={{ borderColor: s.color + '30', backgroundColor: s.color + '08' }}>
                <h3 className="font-black text-base mb-2.5" style={{ color: s.color }}>{s.name}</h3>
                <ul className="space-y-1.5">
                  {s.points.map((p, i) => (
                    <li key={i} className="flex gap-2 text-gray-700 text-base">
                      <span className="font-black mt-0.5" style={{ color: s.color }}>›</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl p-5 border-2" style={{ background: '#fff5f5', borderColor: '#ff6b6b30' }}>
              <CardHeader color="#ff6b6b">Primary Source of Error</CardHeader>
              <p className="text-gray-700 text-base leading-relaxed">
                <strong className="text-gray-900">Excess solute</strong> was probably added to several solutions. A higher molality directly increases ΔTf in the equation ΔTf = i × Kf × m which shifted all results more negative.
              </p>
            </div>
            <Card>
              <CardHeader color="#4ecdc4">Secondary Errors</CardHeader>
              <div className="space-y-2.5">
                {[
                  'The ice bath may have warmed up between trials.',
                  'Some solutions might not have fully dissolved.',
                ].map((e, i) => (
                  <div key={i} className="flex gap-2 text-gray-700 text-base">
                    <span className="font-black shrink-0" style={{ color: '#4ecdc4' }}>→</span>
                    {e}
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader color="#4ecdc4">Percent Error Summary</CardHeader>
              <div className="space-y-2.5">
                {[
                  { name: 'Sucrose',              range: '114% – 426%', color: sucroseColor },
                  { name: 'NaCl (excl. outlier)', range: '22% – 275%',  color: naclColor },
                  { name: 'CaCl₂·2H₂O',          range: '55% – 159%',  color: cacl2Color },
                ].map(s => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="font-bold text-base" style={{ color: s.color }}>{s.name}</span>
                    <span className="font-mono text-gray-500 text-sm font-semibold">{s.range}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 10: ICE CREAM ───── */}
      <SectionWrap id="icecream" number={10}>
        <SectionLabel id="icecream" text="Section 10 — Ice Cream Application" />
        <h2 className="text-5xl font-black mb-8 text-gray-900">Ice Cream Application 🍦🍨</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="rounded-3xl p-5 border-2" style={{ background: 'linear-gradient(135deg, #f0fffd, #f0f9ff)', borderColor: '#45b7d130' }}>
              <CardHeader color="#45b7d1">How a Salt-Ice Bath Works</CardHeader>
              <ol className="space-y-2.5">
                {[
                  'NaCl dissolves in the thin film of water on the ice.',
                  'The dissolved ions lower the freezing point of that water.',
                  'The ice melts and absorbs heat from the surroundings.',
                  'The bath drops below 0°C which is cold enough to freeze the cream.',
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-gray-700 text-base">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5" style={{ background: '#45b7d1' }}>{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl p-5 border-2" style={{ borderColor: cacl2Color + '40', backgroundColor: cacl2Color + '08' }}>
              <CardHeader color={cacl2Color}>Why CaCl₂·2H₂O Makes a Better Ice Cream Bath 🍦</CardHeader>
              <p className="text-gray-700 text-base">CaCl₂·2H₂O makes a more effective ice cream bath than NaCl because i = 3 produces more particles and a colder bath.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl p-5 border-2" style={{ borderColor: sucroseColor + '40', backgroundColor: sucroseColor + '08' }}>
              <CardHeader color={sucroseColor}>Why Ice Cream Stays Scoopable 🍨</CardHeader>
              <p className="text-gray-700 text-base leading-relaxed">
                Ice cream stays scoopable because dissolved sucrose depresses its own freezing point to approximately −2 to −3 °C.
              </p>
            </div>
            <Card>
              <CardHeader color="#ff6b6b">Real-World Applications</CardHeader>
              <div className="space-y-2.5">
                {[
                  { icon: '🛣️', text: 'Road de-icing' },
                  { icon: '🚗', text: 'Antifreeze in cars' },
                  { icon: '🏭', text: 'Food science industry' },
                ].map(a => (
                  <div key={a.text} className="flex gap-3 text-gray-700 text-base">
                    <span className="text-lg shrink-0">{a.icon}</span>
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <p className="text-gray-600 text-base italic leading-relaxed">
                The experiment directly demonstrated these real world applications.
              </p>
            </Card>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 11: CONCLUSIONS ───── */}
      <SectionWrap id="conclusions" number={11}>
        <SectionLabel id="conclusions" text="Section 11 — Conclusions" />
        <h2 className="text-5xl font-black mb-8 text-gray-900">Conclusions 🍦</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="rounded-3xl p-5 border-2" style={{ background: 'linear-gradient(135deg, #f0f9ff, #f0fffd)', borderColor: '#45b7d130' }}>
              <CardHeader color="#45b7d1">Was the Hypothesis Supported?</CardHeader>
              <p className="text-amber-600 font-black text-lg mb-3">Partially supported.</p>
              <ul className="space-y-2.5">
                {[
                  { icon: '✓', color: '#4ecdc4', text: 'CaCl₂·2H₂O produced the largest depression at every concentration.' },
                  { icon: '✓', color: '#4ecdc4', text: 'Sucrose produced the smallest depression at every concentration.' },
                  { icon: '✗', color: '#ff6b6b', text: 'All experimental values were significantly larger than predicted due to experimental errors.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-700 text-base">
                    <span className="font-black shrink-0 text-lg" style={{ color: item.color }}>{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <Card>
              <p className="text-gray-700 text-base">CaCl₂·2H₂O had the most consistent results with R² = 0.986.</p>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader color="#45b7d1">Recommendations</CardHeader>
              <ul className="space-y-2.5">
                {[
                  'Use balance accurate to 0.001 g.',
                  'Monitor ice bath temperature before every trial.',
                  'Run three trials instead of two.',
                  'Ensure complete dissolution before testing.',
                ].map((r, i) => (
                  <li key={i} className="flex gap-2 text-gray-700 text-base">
                    <span className="font-black shrink-0" style={{ color: '#45b7d1' }}>→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardHeader color="#45b7d1">Further Research</CardHeader>
              <ul className="space-y-2.5">
                {[
                  'Test MgCl₂ or KCl.',
                  'Test higher concentrations.',
                  'Compare salt effectiveness for ice cream making.',
                ].map((r, i) => (
                  <li key={i} className="flex gap-2 text-gray-700 text-base">
                    <span className="font-black shrink-0" style={{ color: '#ff6b6b' }}>◆</span>
                    {r}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </SectionWrap>

      {/* ───── SLIDE 12: REFERENCES ───── */}
      <SectionWrap id="references" number={12}>
        <SectionLabel id="references" text="Section 12 — References" />
        <h2 className="text-5xl font-black mb-8 text-gray-900">References</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Rutto, Patrick K., and C. Eugene Bennett. Journal of Chemical Education 99, no. 10 (2022): 3590–3594.',
            'Florida State University Department of Chemistry. Colligative Properties of Solutions. 2026.',
            'Wikipedia contributors. Colligative Properties. 2024.',
            'Lumen Learning. The Dissolution Process. SUNY OER Services. 2026.',
            'ChemTeam. Freezing Point Depression. 2026.',
            'LibreTexts Chemistry. Solutions of Electrolytes. 2023.',
            'LibreTexts Chemistry. Determination of Molar Mass by Freezing Point Depression. 2026.',
            "Wikipedia contributors. Van't Hoff Factor. 2025.",
            'Open Maricopa. Colligative Properties of Electrolyte Solutions. 2026.',
            'University of Georgia Extension. Using Freezing-Point Depression to Find Molecular Weight. 2026.',
            'IU East. Using Freezing Point Depression to Determine Molar Mass. 2021.',
            "Chad's Prep. 13.3 Colligative Properties. 2025.",
          ].map((ref, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="flex gap-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-3xl p-4 transition-colors shadow-sm"
            >
              <span className="font-black text-base shrink-0 mt-0.5" style={{ color: i % 3 === 0 ? '#ff6b6b' : i % 3 === 1 ? '#4ecdc4' : '#45b7d1' }}>[{i + 1}]</span>
              <p className="text-gray-600 text-sm leading-relaxed">{ref}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center text-gray-300 text-sm font-semibold">
          <p>Ice Cream and Freezing Point Depression of Various Solutes 🍦</p>
          <p className="mt-1">Jordan &amp; Colin · Science Exposition Chemistry · May 2026</p>
        </div>
      </SectionWrap>

    </div>
  )
}
