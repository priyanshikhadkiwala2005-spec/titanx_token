import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import * as C from './content.js'
const { nav, faqs } = C

const ease = [0.22, 1, 0.36, 1]
const id = (s) => s.toLowerCase()

function Loader({ done }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setN((v) => { if (v >= 100) { clearInterval(t); setTimeout(done, 450); return 100 } return v + 2 }), 38)
    return () => clearInterval(t)
  }, [done])
  return (
    <motion.div className="fixed inset-0 z-[100] overflow-hidden bg-ink" exit={{ clipPath: 'circle(0% at 50% 50%)' }} initial={{ clipPath: 'circle(150% at 50% 50%)' }} transition={{ duration: 0.9, ease }}>
      <div className="grid-bg absolute inset-0" />
      <div className="absolute left-1/2 top-1/2 flex w-full max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col items-center px-6 text-center">
        <div className="relative h-52 w-52 sm:h-64 sm:w-64">
          <motion.div className="absolute inset-0 rounded-full border-2 border-transparent" style={{ borderTopColor: '#22D3EE', borderRightColor: '#8CFF1F' }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }} />
          <motion.div className="absolute inset-4 rounded-full border border-transparent" style={{ borderBottomColor: '#1E6BFF', borderLeftColor: '#22D3EE' }} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }} />
          <img src="/logo.jpeg" alt="TitanX" className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] rounded-full object-cover mix-blend-screen" />
        </div>
        <div className="mt-8 font-display text-5xl font-bold tabular-nums grad-text">{String(n).padStart(3, '0')}%</div>
        <div className="mt-4 h-1 w-64 max-w-full overflow-hidden rounded bg-white/10"><div className="h-full bg-gradient-to-r from-tx-blue via-tx-cyan to-tx-lime" style={{ width: n + '%' }} /></div>
        <p className="mt-4 text-xs tracking-wide text-slate-400 sm:text-sm">Initialising the TitanX smart contract interface</p>
      </div>
    </motion.div>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <a href="#home" className="flex items-center gap-3"><img src="/logo.jpeg" alt="" className="h-9 w-9 rounded-md object-cover" /><span className="font-display text-xl font-bold chrome-text">TITAN<span className="grad-text">X</span></span></a>
        <nav className="hidden gap-7 lg:flex">{nav.map((l) => <a key={l} href={'#' + id(l)} className="font-display text-sm text-slate-300 transition hover:text-tx-cyan">{l}</a>)}</nav>
        <button className="grid h-10 w-10 place-items-center lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          <span className="relative block h-3 w-6"><span className={`absolute left-0 h-0.5 w-6 bg-tx-cyan transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} /><span className={`absolute left-0 h-0.5 w-6 bg-tx-cyan transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} /></span>
        </button>
      </div>
      <AnimatePresence>{open && (
        <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5 bg-ink lg:hidden">
          {nav.map((l) => <a key={l} onClick={() => setOpen(false)} href={'#' + id(l)} className="block px-6 py-4 font-display text-lg text-slate-200 active:text-tx-cyan">{l}</a>)}
        </motion.nav>)}
      </AnimatePresence>
    </header>
  )
}

function Tilt({ children, className = '' }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const rx = useTransform(y, [-0.5, 0.5], [12, -12]), ry = useTransform(x, [-0.5, 0.5], [-12, 12])
  return (
    <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} className={className}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left) / r.width - 0.5); y.set((e.clientY - r.top) / r.height - 0.5) }}
      onPointerLeave={() => { x.set(0); y.set(0) }}>{children}</motion.div>
  )
}

const Head = ({ title, sub, children, center }) => (
  <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
    <motion.h2 initial={{ opacity: 0, y: 40, rotateX: -35 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease }} style={{ transformPerspective: 800 }} className="font-display text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">{title}</motion.h2>
    {sub && <p className="mt-3 font-display text-xl grad-text">{sub}</p>}
    {children && <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-400 sm:mt-5 sm:space-y-4 sm:text-lg">{children}</div>}
  </div>
)
const Section = ({ id, children, className = '' }) => <section id={id} className={`relative px-4 py-16 sm:px-5 sm:py-24 lg:py-32 ${className}`}><div className="mx-auto max-w-7xl">{children}</div></section>
const Btn = ({ children, href }) => <a href={href} className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-tx-blue via-tx-cyan to-tx-lime px-4 py-3 text-sm font-display font-semibold text-ink min-[420px]:px-6 sm:px-8 sm:py-3.5 sm:text-base transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_40px_rgba(34,211,238,.5)] active:translate-y-0">{children}</a>

const Sub = ({ children, className = '' }) => <h3 className={`font-display text-xl font-semibold text-white sm:text-2xl ${className}`}>{children}</h3>
const Fade = ({ children, className = '', delay = 0 }) => <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>

function Tbl({ head, rows, right = [], first = true, className = '' }) {
  return (
    <div className={`edge no-spot overflow-x-auto bg-white/[0.02] ${className}`}>
      <table className="w-full text-left text-[13px] sm:text-base">
        {head && <thead className="bg-tx-blue/10 font-display text-tx-cyan"><tr>{head.map((h, i) => <th key={h + i} className={`whitespace-nowrap px-3 py-2.5 font-semibold sm:px-4 sm:py-3 ${right.includes(i) ? 'text-right' : ''}`}>{h}</th>)}</tr></thead>}
        <tbody className="divide-y divide-white/5">
          {rows.map((r, ri) => (
            <tr key={ri} className="transition hover:bg-tx-cyan/[0.05]">
              {r.map((c, i) => <td key={i} className={`px-3 py-2.5 sm:px-4 sm:py-3 ${i === 0 && first ? 'font-display font-semibold text-white' : 'text-slate-300'} ${right.includes(i) ? 'text-right tabular-nums' : ''} ${i === 0 ? 'whitespace-nowrap' : ''}`}>{c}</td>)}
            </tr>))}
        </tbody>
      </table>
    </div>
  )
}
const Bullets = ({ items }) => <ul className="space-y-2.5">{items.map((t) => <li key={t} className="flex gap-3 text-slate-400"><span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-tx-cyan" />{t}</li>)}</ul>
const Card = ({ title, children, className = '' }) => (
  <div className={`edge relative bg-white/[0.03] p-5 sm:p-7 ${className}`}>
    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-tx-blue to-tx-lime" />
    {title && <Sub>{title}</Sub>}<div className={`${title ? 'mt-3 ' : ''}space-y-3 text-slate-400`}>{children}</div>
  </div>
)
const Note = ({ children }) => <p className="border-l-2 border-tx-lime/60 pl-4 text-sm text-slate-400">{children}</p>

const Eyebrow = ({ children }) => <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.25em] text-tx-lime sm:text-sm">{children}</p>
const Badge = ({ children }) => <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-tx-blue to-tx-lime font-display text-sm font-bold text-ink">{children}</div>

function CountUp({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const m = value.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/)
  const [txt, setTxt] = useState(m ? m[1] + '0' + m[3] : value)
  useEffect(() => {
    if (!inView || !m) return
    const target = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].includes(',')
    const c = animate(0, target, { duration: 2, ease, onUpdate: (v) => {
      const n = v.toFixed(dec)
      setTxt(m[1] + (comma ? Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : n) + m[3])
    } })
    return () => c.stop()
  }, [inView])
  return <span ref={ref}>{txt}</span>
}

function Timeline({ items, label = 'Step' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const h = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  return (
    <div ref={ref} className="relative pl-10 sm:pl-12">
      <div className="absolute bottom-0 left-4 top-0 w-px bg-white/10" />
      <motion.div className="absolute left-4 top-0 w-px origin-top bg-gradient-to-b from-tx-blue via-tx-cyan to-tx-lime shadow-[0_0_12px_#22D3EE]" style={{ scaleY: h, height: '100%' }} />
      {items.map(([t, d], i) => (
        <motion.div key={t} initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, ease }} className="relative pb-8 last:pb-0 sm:pb-12">
          <span className="absolute -left-10 top-1 grid h-9 w-9 place-items-center rounded-full border border-tx-cyan bg-ink font-display font-bold text-tx-cyan sm:-left-12">{i + 1}</span>
          <div className="edge bg-white/[0.03] p-5 sm:p-6"><div className="text-xs uppercase tracking-widest text-tx-lime">{label} {i + 1}</div><h3 className="font-display text-lg font-semibold text-white sm:text-xl">{t}</h3><p className="mt-2 text-sm text-slate-400 sm:text-base">{d}</p></div>
        </motion.div>))}
    </div>
  )
}

function CoinFace({ back = false }) {
  return (
    <div className="absolute inset-0 rounded-full" style={{ transform: `${back ? 'rotateY(180deg) ' : ''}translateZ(1.7cqw)`, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
      {/* metallic rim */}
      <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 210deg, #1E6BFF, #22D3EE, #e8f6ff, #8CFF1F, #22D3EE, #1E6BFF)', boxShadow: '0 0 40px rgba(34,211,238,.45)' }} />
      <div className="absolute inset-[3.2%] rounded-full bg-[#04091a]" />
      <div className="absolute inset-[5%] rounded-full border border-tx-cyan/40" style={{ background: 'radial-gradient(circle at 50% 40%, #0b2552 0%, #061233 55%, #030918 100%)', boxShadow: 'inset 0 0 40px rgba(34,211,238,.18)' }} />
      <img src="/titanx-logo-full.png" alt="TitanX – Rule the Digital Era" draggable="false" className="absolute inset-[7%] h-[86%] w-[86%] select-none" />
      {/* glass shine that slides across the face */}
      <div className="absolute inset-[5%] overflow-hidden rounded-full">
        <motion.div animate={{ x: ['-130%', '260%'] }} transition={{ repeat: Infinity, duration: 2.6, repeatDelay: 2.2, ease: 'easeInOut' }} className="h-full w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      </div>
    </div>
  )
}

function CoinScene() {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 14 }), sy = useSpring(my, { stiffness: 50, damping: 14 })
  const tiltY = useTransform(sx, [-0.5, 0.5], [-10, 10]), tiltX = useTransform(sy, [-0.5, 0.5], [8, -8])
  const px = useTransform(sx, [-0.5, 0.5], [14, -14]), py = useTransform(sy, [-0.5, 0.5], [10, -10])
  useEffect(() => {
    const on = (e) => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5) }
    window.addEventListener('pointermove', on)
    return () => window.removeEventListener('pointermove', on)
  }, [mx, my])
  const stars = useMemo(() => Array.from({ length: 34 }, (_, i) => {
    const r = (n) => { const x = Math.sin(i * 77.7 + n * 17.3) * 10000; return x - Math.floor(x) }
    return { x: r(1) * 100, y: r(2) * 100, s: 1 + r(3) * 2, t: 2 + r(4) * 4, d: r(5) * 4, c: ['#22D3EE', '#8CFF1F', '#9bbcff', '#fff'][Math.floor(r(6) * 4)] }
  }), [])
  const SLICES = 26
  return (
    <div className="relative mx-auto aspect-square w-full" style={{ containerType: 'inline-size' }}>
      <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,.26),rgba(30,107,255,.18)_45%,transparent_70%)]" />
      <motion.div style={{ x: px, y: py }} className="absolute inset-0">
        {stars.map((s, i) => <span key={i} className="twinkle absolute rounded-full" style={{ left: s.x + '%', top: s.y + '%', width: s.s, height: s.s, background: s.c, boxShadow: `0 0 ${s.s * 4}px ${s.c}`, '--t': s.t + 's', animationDelay: s.d + 's' }} />)}
      </motion.div>
      {[0, 1].map((i) => <motion.span key={i} initial={{ scale: 0.55, opacity: 0 }} animate={{ scale: [0.55, 1.5], opacity: [0.45, 0] }} transition={{ repeat: Infinity, duration: 5, delay: i * 2.5, ease: 'easeOut' }} className="absolute inset-[14%] rounded-full border border-tx-cyan/50" />)}

      {/* orbiting satellites around the coin */}
      <div className="absolute inset-0" style={{ perspective: '90cqw' }}>
        {[{ s: 96, tilt: 'rotateX(74deg) rotateY(-14deg)', dur: 13, rev: false, c: '#22D3EE' }, { s: 84, tilt: 'rotateX(70deg) rotateY(18deg)', dur: 9, rev: true, c: '#8CFF1F' }].map((r, i) => (
          <div key={i} className="absolute left-1/2 top-1/2" style={{ width: r.s + '%', height: r.s + '%', transform: `translate(-50%,-50%) ${r.tilt}` }}>
            <motion.div animate={{ rotate: r.rev ? -360 : 360 }} transition={{ repeat: Infinity, duration: r.dur, ease: 'linear' }} className="relative h-full w-full rounded-full border" style={{ borderColor: r.c + '40', boxShadow: `0 0 14px ${r.c}22` }}>
              <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full" style={{ background: r.c, boxShadow: `0 0 14px 4px ${r.c}` }} />
            </motion.div>
          </div>))}
      </div>

      {/* the spinning 3D coin */}
      <div className="absolute inset-0 grid place-items-center" style={{ perspective: '120cqw' }}>
        <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}>
          <motion.div animate={{ y: ['-1.2cqw', '1.2cqw', '-1.2cqw'] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} style={{ transformStyle: 'preserve-3d' }}>
            <motion.div animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 9, ease: 'linear' }} className="relative" style={{ width: '66cqw', height: '66cqw', transformStyle: 'preserve-3d', rotateX: -8 }}>
              {Array.from({ length: SLICES }, (_, i) => (
                <div key={i} className="absolute inset-0 rounded-full" style={{ transform: `translateZ(calc(${(i / (SLICES - 1) - 0.5).toFixed(3)} * 3.4cqw))`, background: i % 2 ? '#0e5d8f' : '#22D3EE', boxShadow: '0 0 0 1px rgba(2,10,30,.5)' }} />
              ))}
              <CoinFace />
              <CoinFace back />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* glow on the "floor" under the coin */}
      <motion.div animate={{ opacity: [0.35, 0.7, 0.35], scaleX: [0.9, 1.05, 0.9] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }} className="absolute bottom-[5%] left-1/2 h-[4%] w-[46%] -translate-x-1/2 rounded-full bg-tx-cyan/40 blur-xl" />

      {Array.from({ length: 10 }, (_, i) => <motion.span key={i} initial={{ opacity: 0 }} animate={{ y: [0, -140 - (i % 3) * 40], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 4 + (i % 4), delay: i * 0.55, ease: 'easeOut' }} className="absolute h-1 w-1 rounded-full" style={{ left: 14 + i * 7.5 + '%', bottom: 8 + (i % 3) * 6 + '%', background: i % 2 ? '#8CFF1F' : '#22D3EE', boxShadow: '0 0 8px currentColor' }} />)}
    </div>
  )
}

const heroTiles = [
  ['Blockchain', 'Security', <><path d="M12 3 4.5 6v5.5c0 4.4 3 8.2 7.5 9.5 4.5-1.3 7.5-5.1 7.5-9.5V6L12 3Z" /><path d="m8.8 12 2.3 2.3 4.2-4.6" /></>],
  ['Decentralized', 'Governance', <><circle cx="12" cy="5" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="M12 7v4.5M12 11.5 6.2 16.4M12 11.5l5.8 4.9M7 18h10" /></>],
  ['Real Earnings', 'Opportunities', <path d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6l1-8Z" />],
  ['Global', 'Community', <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z" /></>]]

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-5 pb-8 pt-20 lg:pb-4">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-tx-blue/20 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-2 grid-cols-[minmax(0,1fr)] lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2 lg:gap-8">
        <div className="relative z-10 order-2 min-w-0 lg:order-1">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2.5 rounded-full border border-tx-cyan/30 bg-tx-cyan/[0.06] px-4 py-2 font-display text-sm text-slate-200 sm:text-base">
            <span className="h-2.5 w-2.5 rounded-full bg-tx-cyan shadow-[0_0_10px_#22D3EE]" />Decentralized Platform
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease }} className="mt-5 font-display text-4xl font-bold leading-tight text-white min-[400px]:text-5xl sm:text-6xl lg:text-6xl xl:text-7xl">
            Rule the <span className="bg-gradient-to-r from-tx-cyan to-tx-lime bg-clip-text text-transparent">Digital Era</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
            A next-generation decentralized platform built on blockchain technology, empowering users with transparency, security and real earning opportunities.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-6">
            <a href="#about" className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-tx-blue via-tx-cyan to-tx-lime px-7 py-3.5 font-display text-base font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_40px_rgba(34,211,238,.5)] active:translate-y-0 lg:px-9 lg:py-4 lg:text-lg">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1ZM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2Z" /><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" /></svg>
              Get Started <span className="transition group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroTiles.map(([a, b, icon], i) => (
              <motion.div key={a} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 + i * 0.1, duration: 0.7, ease }} whileHover={{ y: -5 }} className="edge flex flex-col items-center gap-2.5 rounded-2xl bg-white/[0.03] px-2 py-4 text-center">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-tx-cyan" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,.6))' }}>{icon}</svg>
                <div className="font-display text-[13px] leading-tight text-slate-200 sm:text-sm">{a}<br />{b}</div>
              </motion.div>))}
          </div>
        </div>
        <div className="order-1 min-w-0 overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:z-0 lg:w-1/2">
          <div className="grid w-full place-items-center lg:h-full"><div className="w-full max-w-[460px] lg:max-w-[min(100%,calc(100vh-4rem))]"><CoinScene /></div></div>
        </div>
      </div>
    </section>
  )
}

function About() {
  const a = C.about
  return (
    <Section id="about">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>{a.eyebrow}</Eyebrow>
          <Head title={a.title}><p>{a.intro}</p></Head>
        </div>
        <div className="space-y-5 sm:space-y-6">
          {[['Our Vision', a.vision, 'from-tx-blue'], ['Our Mission', a.mission, 'from-tx-lime']].map(([t, d, c], i) => (
            <motion.div key={t} initial={{ opacity: 0, x: 80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, delay: i * 0.1, ease }} className="relative bg-white/[0.03] p-5 edge sm:p-7">
              <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${c} to-tx-cyan`} /><h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{t}</h3><p className="mt-3 text-sm text-slate-400 sm:text-base">{d}</p>
            </motion.div>))}
          <h3 className="pt-2 font-display text-xl font-semibold text-white sm:pt-4 sm:text-2xl">Our Core Principles</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {C.principles.map(([t, d], i) => (
              <motion.div key={t} initial={{ opacity: 0, scale: 0.8, rotate: i % 2 ? 4 : -4 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1, ease }} whileHover={{ y: -6 }} className="edge bg-gradient-to-br from-tx-blue/10 to-transparent p-5">
                <div className="font-display text-lg font-semibold grad-text">{t}</div><p className="mt-1 text-sm text-slate-400">{d}</p>
              </motion.div>))}
          </div>
        </div>
      </div>
    </Section>
  )
}

function TokenInfo({ tag, title, text, label, pct, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.6 + i * 0.35, ease }} className="w-full px-2 text-center">
      <span className="inline-block rounded-full border border-tx-cyan/40 bg-tx-cyan/10 px-4 py-1 font-display text-xs font-semibold uppercase tracking-widest text-tx-cyan">{tag}</span>
      <h4 className="mt-3 font-display text-lg font-semibold text-white">{title}</h4>
      <p className="mt-1 text-sm leading-snug text-slate-400">{text}</p>
      <div className="mx-auto mt-3 h-1.5 max-w-[200px] overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} whileInView={{ width: Math.max(pct, 4) + '%' }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.9 + i * 0.35, ease }} className="h-full rounded-full bg-gradient-to-r from-tx-blue via-tx-cyan to-tx-lime" /></div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</div>
    </motion.div>
  )
}

function TokenNode({ n, i, below }) {
  const [tag, title, text, label, pct] = n
  const info = <TokenInfo tag={tag} title={title} text={text} label={label} pct={pct} i={i} />
  return (
    <div className="grid grid-rows-[1fr_auto_1fr]">
      <div className="flex flex-col items-center justify-end">{!below && info}</div>
      <div className="relative z-10 my-3 grid h-14 place-items-center">
        <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.5 + i * 0.35 }} className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-tx-blue via-tx-cyan to-tx-lime font-display text-sm font-bold text-ink">
          <span className="absolute inset-0 animate-ping rounded-full bg-tx-cyan/30" />{i + 1}
        </motion.span>
      </div>
      <div className="flex flex-col items-center justify-start">{below && info}</div>
    </div>
  )
}

function Token() {
  const t = C.token
  return (
    <Section id="token" className="bg-gradient-to-b from-transparent via-navy/60 to-transparent">
      <div className="text-center"><Eyebrow>{t.eyebrow}</Eyebrow></div>
      <Head title={t.title} center><p>{t.intro}</p></Head>

      <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
        {C.tokenStats.map(([l, v, d], i) => (
          <motion.div key={l} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1, ease }} whileHover={{ y: -6 }} className={`edge relative overflow-hidden rounded-2xl bg-gradient-to-b from-tx-blue/10 to-transparent p-5 ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tx-lime to-transparent" />
            <div className="font-display text-xs font-semibold uppercase tracking-widest text-tx-lime">{l}</div>
            <div className="mt-3 font-display text-2xl font-bold text-white xl:text-3xl">{/^[0-9$]/.test(v) && !v.includes('/') ? <CountUp value={v} /> : v}</div>
            <p className="mt-1 text-sm text-slate-400">{d}</p>
          </motion.div>))}
      </div>

      <div className="relative mt-14 hidden lg:block">
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease }} style={{ transformOrigin: 'left' }} className="absolute inset-x-[10%] top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-tx-blue via-tx-cyan to-tx-lime shadow-[0_0_14px_#22D3EE]" />
        <div className="relative grid h-[500px] grid-cols-5">
          {C.tokenFlow.map((n, i) => <TokenNode key={n[0]} n={n} i={i} below={i % 2 === 1} />)}
        </div>
      </div>
      <div className="mt-10 lg:hidden">
        <Timeline items={C.tokenFlow.map((n) => [n[1], n[2] + ' ' + n[3] + '.'])} label="Stage" />
      </div>

      <Fade className="mt-10 sm:mt-14">
        <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-tx-lime/50 bg-tx-lime/[0.04] p-5 text-center sm:p-6">
          <span className="font-display font-semibold text-tx-lime">{C.tokenNote[0]}: </span><span className="text-slate-300">{C.tokenNote[1]}</span>
        </div>
      </Fade>

      <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-[1.2fr_1fr]">
        <Fade><h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">{t.detailsTitle}</h3><Tbl head={['Parameter', 'Details']} rows={C.tokenOverview} /></Fade>
        <Fade delay={0.1} className="space-y-6 lg:pt-12">
          <Card title="Public Token Information"><Bullets items={C.tokenCards[2][2]} /></Card>
          <Card title="Transparent Token Burning"><p>{C.tokenCards[1][1]}</p><Bullets items={C.tokenCards[1][2]} /></Card>
        </Fade>
      </div>
    </Section>
  )
}

function Donut() {
  const R = 78, C2 = 2 * Math.PI * R, gap = 2.2
  const segs = C.donut.map((d, i) => { const start = C.donut.slice(0, i).reduce((a, x) => a + x[1], 0); return { ...d, start, len: (d[1] / 100) * C2 - gap } })
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[380px]">
      <div className="absolute inset-4 rounded-full bg-tx-cyan/10 blur-3xl" />
      <svg viewBox="0 0 200 200" className="relative h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="26" />
        {segs.map((s, i) => (
          <motion.circle key={s[0]} cx="100" cy="100" r={R} fill="none" stroke={s[2]} strokeWidth="26"
            transform={`rotate(${(s.start / 100) * 360 + (gap / C2) * 180} 100 100)`}
            initial={{ strokeDasharray: `0 ${C2}` }} whileInView={{ strokeDasharray: `${s.len} ${C2}` }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.2 + i * 0.5, ease }} />
        ))}
      </svg>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: 'linear' }} className="absolute inset-[3%] rounded-full border border-dashed border-tx-cyan/25" />
      <div className="absolute inset-[24%] grid place-items-center rounded-full border border-tx-cyan/30 bg-ink/90 text-center shadow-[0_0_40px_rgba(34,211,238,.15)]">
        <div className="px-2">
          <span className="inline-block rounded-full border border-tx-lime/40 px-3 py-0.5 font-display text-[9px] font-semibold uppercase tracking-widest text-tx-lime sm:text-[10px]">Total Supply</span>
          <div className="mt-1 font-display text-xl font-bold text-white sm:text-3xl"><CountUp value="21,000,000" /></div>
          <div className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-300 sm:text-xs">TITANX</div>
          <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-tx-lime sm:text-[10px]">Fixed Supply</div>
        </div>
      </div>
    </div>
  )
}

function TnCard({ c, i, from }) {
  const [title, badge, value, text, color] = c
  return (
    <motion.div initial={{ opacity: 0, x: from }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, delay: i * 0.12, ease }} whileHover={{ y: -4 }}
      className="edge relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent p-4 sm:p-5" style={{ boxShadow: `inset 3px 0 0 ${color}` }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 font-display text-sm font-semibold text-white sm:text-base"><span className="h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />{title}</div>
        <span className="rounded-full border px-2.5 py-0.5 font-display text-xs font-bold" style={{ color, borderColor: color + '88' }}>{badge}</span>
      </div>
      <div className="mt-2 font-display text-lg font-bold sm:text-xl" style={{ color }}>{value}</div>
      <p className="mt-1 text-xs leading-snug text-slate-400 sm:text-sm">{text}</p>
    </motion.div>
  )
}

function Tokenomics() {
  const k = C.tokenomics
  const H3 = ({ children }) => <h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">{children}</h3>
  return (
    <Section id="tokenomics">
      <div className="text-center"><Eyebrow>Tokenomics</Eyebrow></div>
      <Head title={k.title} center><p>{k.intro}</p></Head>

      <div className="mt-12 grid items-center gap-8 sm:mt-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <div className="order-2 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:order-1 lg:grid-cols-1">{C.tnLeft.map((c, i) => <TnCard key={c[0]} c={c} i={i} from={-60} />)}</div>
        <div className="order-1 lg:order-2"><Donut /></div>
        <div className="order-3 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1">{C.tnRight.map((c, i) => <TnCard key={c[0]} c={c} i={i} from={60} />)}</div>
      </div>

      <Fade className="mt-12 sm:mt-16">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {C.donut.map((d) => <span key={d[0]} className="flex items-center gap-2 text-sm text-slate-300"><span className="h-3 w-3 rounded-full" style={{ background: d[2] }} />{d[0]}</span>)}
        </div>
        <div className="edge no-spot overflow-x-auto rounded-2xl bg-white/[0.02]">
          <table className="w-full min-w-[420px] text-left text-sm sm:text-base">
            <thead className="bg-tx-blue/15 font-display text-tx-cyan"><tr><th className="px-4 py-3.5 sm:px-6">Supply Category</th><th className="px-4 py-3.5 text-right sm:px-6">Tokens (TITANX)</th><th className="px-4 py-3.5 text-right sm:px-6">Percentage</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {C.donut.map((d) => (
                <tr key={d[0]} className="transition hover:bg-tx-cyan/[0.05]">
                  <td className="px-4 py-3.5 text-white sm:px-6"><span className="mr-3 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: d[2] }} />{d[0]}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-slate-300 sm:px-6">{d[3]}</td>
                  <td className="px-4 py-3.5 text-right font-display font-bold sm:px-6" style={{ color: d[2] }}>{d[1]}%</td>
                </tr>))}
              <tr className="bg-gradient-to-r from-tx-blue/15 to-tx-lime/10 font-display font-bold">
                <td className="px-4 py-4 text-tx-lime sm:px-6">Total Supply</td><td className="px-4 py-4 text-right tabular-nums text-white sm:px-6">21,000,000 TITANX</td><td className="px-4 py-4 text-right text-white sm:px-6">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Fade>

      <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-2">
        <Fade><H3>Token Rate Movement</H3><Tbl head={['Joining Value', 'Rate Movement']} rows={C.rateMovement} right={[1]} />
          <div className="mt-4"><Card title="Example"><Tbl rows={C.rateExample} right={[1]} /></Card></div></Fade>
        <Fade delay={0.1}><H3>Transaction Details</H3><Tbl head={['Transaction', 'Fee']} rows={C.txDetails} right={[1]} />
          <div className="mt-4"><Card title="Transparency Dashboard"><p>Live token information:</p>
            <div className="grid gap-3 sm:grid-cols-3">{C.dashboard.map((d) => <div key={d} className="edge bg-white/[0.03] p-3 text-center"><span className="mx-auto mb-2 block h-2 w-2 animate-pulse rounded-full bg-tx-lime" /><div className="font-display text-sm font-semibold text-white">{d}</div></div>)}</div></Card></div></Fade>
      </div>

      <Fade className="mt-12 sm:mt-16">
        <div className="relative overflow-hidden rounded-3xl border border-tx-lime/40 bg-gradient-to-br from-tx-blue/15 via-ink to-tx-lime/10 p-6 sm:p-10">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-tx-cyan/15 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-4xl">{C.tnBanner.title[0]} <span className="grad-text">{C.tnBanner.title[1]}</span> {C.tnBanner.title[2]}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{C.burnStructure}</p>
            </div>
            <ul className="space-y-2.5">
              {C.tnBanner.stats.map(([v, l]) => <li key={l} className="flex items-baseline gap-3 border-b border-white/10 pb-2"><span className="font-display text-xl font-bold text-tx-lime sm:text-2xl">{v}</span><span className="text-sm text-slate-300">{l}</span></li>)}
            </ul>
          </div>
        </div>
      </Fade>
    </Section>
  )
}

function Utility() {
  const u = C.utility
  return (
    <Section id="utility" className="bg-gradient-to-b from-transparent via-navy/60 to-transparent">
      <div className="text-center"><Eyebrow>{u.eyebrow}</Eyebrow></div>
      <Head title={u.title} center />
      <div className="mt-10 grid auto-rows-fr gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {C.utilities.map(([t, d, list], i) => (
          <motion.div key={t} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, delay: (i % 4) * 0.1, ease }} whileHover={{ y: -6 }}
            className="edge group relative overflow-hidden bg-white/[0.03] p-5 transition hover:bg-tx-cyan/[0.05] sm:p-6">
            <motion.div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tx-cyan to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 3 + (i % 4), ease: 'linear' }} />
            <div className="mb-4"><Badge>0{i + 1}</Badge></div>
            <h3 className="font-display text-lg font-semibold text-white">{t}</h3>
            <p className="mt-2 text-sm text-slate-400">{d}</p>
            {list && <div className="mt-3 text-sm"><Bullets items={list} /></div>}
          </motion.div>))}
      </div>
    </Section>
  )
}

function Referral() {
  const r = C.referral
  return (
    <Section id="referral">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Head title={r.title} sub={r.sub}><p>{r.intro}</p></Head>
          <div className="mt-8 max-w-md"><Card title={r.communityTitle}><p>{r.community}</p></Card></div>
          <div className="mt-6"><Btn href="#home">{r.cta}</Btn></div>
        </div>
        <div>
          <h3 className="mb-6 font-display text-xl font-semibold text-white sm:text-2xl">{r.stepsTitle}</h3>
          <Timeline items={C.referralSteps} />
        </div>
      </div>
    </Section>
  )
}

function FAQs() {
  const [o, setO] = useState(0)
  return (
    <Section id="faqs" className="bg-gradient-to-b from-transparent via-navy/60 to-transparent">
      <Head title="Frequently Asked Questions" center />
      <div className="mx-auto mt-10 max-w-3xl space-y-3 sm:mt-14">
        {faqs.map(([q, a], i) => (
          <motion.div key={q} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.6, delay: 0.03 * (i % 4) }} className={`edge overflow-hidden transition ${o === i ? 'bg-tx-cyan/[0.06] shadow-[0_0_30px_rgba(34,211,238,.12)]' : 'bg-white/[0.02]'}`}>
            <button onClick={() => setO(o === i ? -1 : i)} aria-expanded={o === i} className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left font-display text-base font-semibold text-white sm:px-5 sm:py-4 sm:text-lg"><span><span className="mr-2 text-tx-lime">{i + 1}.</span>{q}</span>
              <motion.span animate={{ rotate: o === i ? 45 : 0 }} className="text-2xl text-tx-lime">+</motion.span></button>
            <AnimatePresence initial={false}>{o === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden px-4 pb-4 text-sm text-slate-400 sm:px-5 sm:pb-5 sm:text-base">{a}</motion.p>}</AnimatePresence>
          </motion.div>))}
      </div>
    </Section>
  )
}

function Footer() {
  const f = C.footer
  return (
    <footer className="relative overflow-hidden border-t border-white/5 px-4 pb-8 pt-12 sm:px-5 sm:pt-16">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <p className="font-display text-xl font-bold chrome-text sm:text-3xl">TITANX – Rule the Digital Era</p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">{f.text}</p>
        <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {nav.map((l) => (
            <a key={l} href={'#' + id(l)} className="font-display text-sm text-slate-300 transition hover:text-tx-cyan">{l}</a>
          ))}
        </nav>
        <p className="mt-8 text-xs text-slate-500 sm:text-sm">{f.copy}</p>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-slate-500"><span className="font-semibold text-slate-400">Disclaimer:</span> {f.disclaimer}</p>
      </div>
      <motion.img
        src="/titanx-wordmark.png" alt="TITANX" draggable="false"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease }}
        className="pointer-events-none mx-auto mt-10 block w-[92%] max-w-[1000px] select-none"
      />
    </footer>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  useEffect(() => { document.body.style.overflow = ready ? '' : 'hidden' }, [ready])
  useEffect(() => {
    const on = (e) => {
      const el = e.target.closest && e.target.closest('.edge')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px')
    }
    document.addEventListener('pointermove', on)
    return () => document.removeEventListener('pointermove', on)
  }, [])
  return (
    <>
      <AnimatePresence>{!ready && <Loader done={() => setReady(true)} />}</AnimatePresence>
      <motion.div className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-tx-blue via-tx-cyan to-tx-lime" style={{ scaleX: bar }} />
      <Nav />
      <main><Hero /><About /><Token /><Tokenomics /><Utility /><Referral /><FAQs /></main>
      <Footer />
    </>
  )
}
