import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import Globe3D from './Globe3D.jsx'
import * as C from './content.js'
const { nav, steps, faqs } = C

const ease = [0.22, 1, 0.36, 1]
const id = (s) => s.toLowerCase()

function Loader({ done }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setN((v) => { if (v >= 100) { clearInterval(t); setTimeout(done, 450); return 100 } return v + 2 }), 38)
    return () => clearInterval(t)
  }, [done])
  return (
    <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-ink" exit={{ clipPath: 'circle(0% at 50% 50%)' }} initial={{ clipPath: 'circle(150% at 50% 50%)' }} transition={{ duration: 0.9, ease }}>
      <div className="grid-bg absolute inset-0" />
      <div className="relative flex flex-col items-center px-6">
        <div className="relative h-52 w-52 sm:h-64 sm:w-64">
          <motion.div className="absolute inset-0 rounded-full border-2 border-transparent" style={{ borderTopColor: '#22D3EE', borderRightColor: '#8CFF1F' }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }} />
          <motion.div className="absolute inset-4 rounded-full border border-transparent" style={{ borderBottomColor: '#1E6BFF', borderLeftColor: '#22D3EE' }} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }} />
          <img src="/logo.jpeg" alt="TitanX" className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] rounded-full object-cover mix-blend-screen" />
        </div>
        <div className="mt-8 font-display text-5xl font-bold tabular-nums grad-text">{String(n).padStart(3, '0')}%</div>
        <div className="mt-4 h-1 w-64 max-w-full overflow-hidden rounded bg-white/10"><div className="h-full bg-gradient-to-r from-tx-blue via-tx-cyan to-tx-lime" style={{ width: n + '%' }} /></div>
        <p className="mt-4 text-sm tracking-wide text-slate-400">Initialising the TitanX smart contract interface</p>
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
const Btn = ({ children, href }) => <a href={href} className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-tx-blue via-tx-cyan to-tx-lime px-8 py-3.5 font-display font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_40px_rgba(34,211,238,.5)] active:translate-y-0">{children}</a>

const Sub = ({ children, className = '' }) => <h3 className={`font-display text-xl font-semibold text-white sm:text-2xl ${className}`}>{children}</h3>
const Fade = ({ children, className = '', delay = 0 }) => <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>

function Tbl({ head, rows, right = [], first = true, className = '' }) {
  return (
    <div className={`edge overflow-x-auto bg-white/[0.02] ${className}`}>
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

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-5 pb-6 pt-20 lg:pb-4">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-tx-blue/20 blur-[120px]" /><div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-tx-cyan/15 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-4 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1fr_1.1fr]">
        <div className="order-2 lg:order-1">
          <motion.h1 initial="h" animate="s" transition={{ staggerChildren: 0.08, delayChildren: 0.3 }} className="font-display text-3xl font-bold leading-[1.15] min-[400px]:text-4xl sm:text-5xl lg:text-4xl xl:text-5xl">
            {['TITANX – Rule the', 'Digital Era'].map((l, i) => <span key={l} className="block overflow-hidden -mb-3"><motion.span variants={{ h: { y: '110%' }, s: { y: 0 } }} transition={{ duration: 0.9, ease }} className={`block pb-3 ${i === 1 ? 'grad-text' : 'chrome-text'}`}>{l}</motion.span></span>)}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-3 flex flex-wrap gap-3"><Btn href="#about">Explore TitanX</Btn><Btn href="#how">Connect Wallet</Btn><Btn href="#how">Join Now</Btn></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-5 max-w-xl space-y-2 text-[13px] leading-relaxed text-slate-400 xl:text-sm">
            <p>{C.hero.tagline}</p>
            <p>{C.hero.sub}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {C.highlights.map(([h, d], i) => <div key={h} className="edge bg-white/[0.03] px-3.5 py-2.5"><div className="flex items-center gap-2 font-display text-sm font-semibold text-white"><span className="h-2 w-2 shrink-0 rotate-45" style={{ background: ['#1E6BFF', '#22D3EE', '#8CFF1F', '#22D3EE'][i] }} />{h}</div><p className="mt-1 text-[11px] leading-snug text-slate-400 xl:text-xs">{d}</p></div>)}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1.4, ease }} className="order-1 h-[380px] sm:h-[500px] lg:order-2 lg:h-[calc(100vh-4rem)] lg:max-h-[860px]"><Globe3D /></motion.div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const h = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  return (
    <Section id="how">
      <Head title="TitanX at a Glance" center />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {C.stats.map(([v, l], i) => (
          <motion.div key={l} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease }} whileHover={{ y: -6 }} className="edge bg-gradient-to-br from-tx-blue/10 to-transparent p-6">
            <div className="font-display text-2xl font-bold grad-text sm:text-3xl">{v}</div><p className="mt-1 text-sm text-slate-400">{l}</p>
          </motion.div>))}
      </div>
      <div className="mt-24 grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Head title="How TitanX Works" sub="Five simple steps" />
          <div className="mt-8 max-w-md"><p className="font-display text-xl font-semibold text-white">{C.closing.title}</p><p className="mt-2 text-slate-400">{C.closing.text}</p>
            <div className="mt-6 flex flex-wrap gap-4"><Btn href="#about">Explore TitanX</Btn><Btn href="#home">Connect Wallet</Btn><Btn href="#home">Join Now</Btn></div></div>
        </div>
        <div ref={ref} className="relative pl-10 sm:pl-12">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-white/10" />
          <motion.div className="absolute left-4 top-0 w-px origin-top bg-gradient-to-b from-tx-blue via-tx-cyan to-tx-lime shadow-[0_0_12px_#22D3EE]" style={{ scaleY: h, height: '100%' }} />
          {steps.map(([t, d], i) => (
            <motion.div key={t} initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, ease }} className="relative pb-12 last:pb-0">
              <span className="absolute -left-10 top-1 sm:-left-12 grid h-9 w-9 place-items-center rounded-full border border-tx-cyan bg-ink font-display font-bold text-tx-cyan">{i + 1}</span>
              <div className="edge bg-white/[0.03] p-6"><div className="text-xs uppercase tracking-widest text-tx-lime">Step {i + 1}</div><h3 className="font-display text-xl font-semibold text-white">{t}</h3><p className="mt-2 text-slate-400">{d}</p></div>
            </motion.div>))}
        </div>
      </div>
    </Section>
  )
}

function About() {
  const a = C.about
  return (
    <Section id="about">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Head title={a.title}>{a.intro.map((p) => <p key={p}>{p}</p>)}</Head>
          <div className="mt-8 flex flex-wrap gap-2.5">{a.foundation.map((f) => <span key={f} className="edge bg-white/[0.03] px-4 py-2 font-display text-sm text-tx-cyan">{f}</span>)}</div>
        </div>
        <div className="space-y-6">
          {[['Our Vision', a.vision, 'from-tx-blue'], ['Our Mission', a.mission, 'from-tx-lime']].map(([t, d, c], i) => (
            <motion.div key={t} initial={{ opacity: 0, x: 80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, delay: i * 0.1, ease }} className="relative bg-white/[0.03] p-7 edge">
              <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${c} to-tx-cyan`} /><h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{t}</h3><p className="mt-3 text-slate-400">{d}</p>
            </motion.div>))}
          <h3 className="pt-4 font-display text-xl font-semibold text-white sm:text-2xl">What Makes TitanX Different?</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {C.different.map(([t, d], i) => (
              <motion.div key={t} initial={{ opacity: 0, scale: 0.8, rotate: i % 2 ? 4 : -4 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1, ease }} whileHover={{ y: -6 }} className={`edge bg-gradient-to-br from-tx-blue/10 to-transparent p-5 ${i === 4 ? 'sm:col-span-2' : ''}`}>
                <div className="font-display text-lg font-semibold grad-text">{t}</div><p className="mt-1 text-sm text-slate-400">{d}</p>
              </motion.div>))}
          </div>
          <Card title="Who Can Join?">
            <p>{a.who}</p>
            <p className="font-display text-sm font-semibold text-white">Supported wallet examples:</p>
            <Bullets items={a.wallets} />
          </Card>
        </div>
      </div>
    </Section>
  )
}

function Token() {
  const t = C.token
  return (
    <Section id="token" className="bg-gradient-to-b from-transparent via-navy/60 to-transparent">
      <Head title={t.title} center><p>{t.intro}</p></Head>
      <div className="mt-10 grid gap-6 sm:mt-16 lg:grid-cols-2">
        <Fade><h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">Token Overview</h3><Tbl head={['Parameter', 'Details']} rows={C.tokenOverview} /></Fade>
        <Fade delay={0.1} className="space-y-6">
          <div><h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">Transaction Charges</h3><Tbl head={['Transaction', 'Gas Fee']} rows={C.charges} /><p className="mt-3 text-sm text-slate-400">Note: {C.chargeNote}</p></div>
          <div><h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">Price Calculation Examples</h3><Tbl head={['Joining Amount', 'Rate Movement']} rows={C.priceExamples} /><p className="mt-3 text-sm text-slate-400">Example: Starting Rate $0.50 → After $1,000 joining: <span className="text-tx-lime">$0.505</span></p></div>
        </Fade>
      </div>
      <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {C.tokenCards.map(([title, ps], i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 80, rotateX: 40 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, delay: i * 0.12, ease }} style={{ transformPerspective: 900 }}>
            <Tilt className="edge group relative h-full overflow-hidden bg-ink/80 p-5 sm:p-7">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-tx-cyan/20 blur-3xl transition group-hover:bg-tx-lime/30" />
              <div className="mb-5 grid h-12 w-12 place-items-center bg-gradient-to-br from-tx-blue to-tx-lime font-display font-bold text-ink rounded-full">{title[0] === 'T' ? title.split(' ')[1][0] : title[0]}</div>
              <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
              <div className="mt-2 space-y-2 text-slate-400">{ps.map((p) => <p key={p}>{p}</p>)}</div>
            </Tilt>
          </motion.div>))}
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Fade><Card title="Token Burning Details"><Bullets items={C.burnPoints} /></Card></Fade>
        <Fade delay={0.1} className="space-y-6">
          <Card title="Token Transparency"><p>Total Supply, Total Mint and Total Burn are shown openly to support transparent token tracking.</p></Card>
          <div><h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">Technical Information</h3><Tbl rows={C.technical} /></div>
        </Fade>
      </div>
      <div className="mt-12 text-center"><Btn href="#tokenomics">Explore Tokenomics</Btn></div>
    </Section>
  )
}

function Tokenomics() {
  const nodes = [['Mint', 0], ['Circulate', 90], ['Transact', 180], ['Burn', 270]]
  return (
    <Section id="tokenomics">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <svg viewBox="0 0 320 320" className="h-full w-full overflow-visible">
            <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1E6BFF" /><stop offset=".5" stopColor="#22D3EE" /><stop offset="1" stopColor="#8CFF1F" /></linearGradient></defs>
            <circle cx="160" cy="160" r="120" fill="none" stroke="rgba(34,211,238,.12)" strokeWidth="2" strokeDasharray="3 7" />
            <motion.circle cx="160" cy="160" r="120" fill="none" stroke="url(#g)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.4, ease }} style={{ rotate: -90, transformOrigin: '160px 160px' }} />
            <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 24, ease: 'linear' }} style={{ transformOrigin: '160px 160px' }}><circle cx="160" cy="28" r="70" fill="none" /><circle cx="160" cy="40" r="6" fill="#8CFF1F" /></motion.g>
            {nodes.map(([l, a], i) => { const r = ((a - 90) * Math.PI) / 180, x = 160 + Math.cos(r) * 120, y = 160 + Math.sin(r) * 120; return (
              <motion.g key={l} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.5, type: 'spring' }} style={{ transformOrigin: `${x}px ${y}px` }}>
                <circle cx={x} cy={y} r="22" fill="#02040A" stroke="url(#g)" strokeWidth="2" /><text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Poppins" fontWeight="600">{l}</text></motion.g>) })}
          </svg>
          <img src="/logo.jpeg" alt="" className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover mix-blend-screen" />
        </div>
        <div>
          <Head title="Understanding the TitanX Token Economy">{C.tokenomicsIntro.map((p) => <p key={p}>{p}</p>)}</Head>
          <div className="mt-8"><Tbl head={['Token Supply & Burning', 'Value']} rows={C.supply} /></div>
        </div>
      </div>
      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="divide-y divide-white/5 border-y border-white/5">
          {C.tokenomics.map(([t, d], i) => (
            <motion.div key={t} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.7, ease }} className="group py-4 transition hover:pl-3">
              <div className="font-display text-lg font-semibold text-white group-hover:text-tx-cyan">{t}</div><p className="text-sm text-slate-400">{d}</p></motion.div>))}
        </div>
        <div className="space-y-6">
          <Fade><h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">Transaction Fee Structure</h3><Tbl head={['Transaction', 'Percentage']} rows={C.feeStructure} right={[1]} /></Fade>
          <Fade delay={0.1}><Card title="Public Token Data"><p>The following information is displayed openly:</p>
            <ol className="space-y-2">{C.publicData.map((d, i) => <li key={d} className="flex gap-3"><span className="font-display font-bold text-tx-lime">{i + 1}.</span>{d}</li>)}</ol></Card></Fade>
          <Note>{C.tokenomicsNote}</Note>
        </div>
      </div>
    </Section>
  )
}

function Utility() {
  const u = C.utility
  return (
    <Section id="utility" className="bg-gradient-to-b from-transparent via-navy/60 to-transparent">
      <Head title={u.title} center><p>{u.intro}</p></Head>
      <div className="mt-12 grid auto-rows-fr gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {C.utilities.map(([t, ps], i) => (
          <motion.div key={t} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease }} whileHover={{ y: -6 }}
            className="edge group relative overflow-hidden bg-white/[0.03] p-5 transition hover:bg-tx-cyan/[0.05] sm:p-7">
            <motion.div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tx-cyan to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 3 + i, ease: 'linear' }} />
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-tx-blue to-tx-lime font-display text-sm font-bold text-ink">0{i + 1}</div>
            <h3 className="font-display text-lg font-semibold text-white sm:text-xl">{t}</h3>
            <div className="mt-2 space-y-2 text-sm text-slate-400 sm:text-base">{ps.map((p) => <p key={p}>{p}</p>)}</div>
          </motion.div>))}
      </div>
      <Fade className="mx-auto mt-10 max-w-3xl sm:mt-14">
        <h3 className="mb-4 text-center font-display text-xl font-semibold text-white sm:text-2xl">Flexi vs Regular Staking Plans</h3>
        <Tbl head={C.planCompare.head} rows={C.planCompare.rows} />
      </Fade>
    </Section>
  )
}

function Referral() {
  const r = C.referral, s = C.staking, rk = C.rankInfo, un = C.unityInfo, sl = C.singleLeg
  const Block = ({ tag, title, children }) => (
    <Fade className="mt-10 sm:mt-14">
      <div className="mb-5 flex items-center gap-3 sm:gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center bg-gradient-to-br from-tx-blue to-tx-lime font-display font-bold text-ink rounded-full">{tag}</span><h3 className="font-display text-xl font-bold text-white sm:text-3xl">{title}</h3></div>
      <div className="space-y-5">{children}</div>
    </Fade>
  )
  return (
    <Section id="referral">
      <Head title={r.title} center><p>{r.intro}</p></Head>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">{r.tabs.map((t, i) => <span key={t} className="edge bg-white/[0.03] px-4 py-2 font-display text-sm text-tx-cyan">{'ABCDE'[i]} · {t}</span>)}</div>

      <Block tag="A" title="Staking Rewards (ROI)">
        <p className="text-slate-400">{s.intro}</p>
        <Tbl head={s.head} rows={s.rows} />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Capping Structure"><Tbl rows={s.cap} /><p>{s.capText}</p></Card>
          <Card title="Example"><Tbl rows={s.example} /><Note>{s.note}</Note></Card>
        </div>
      </Block>

      <Block tag="B" title="Direct Income">
        <p className="text-slate-400">{C.direct.intro}</p>
        <Tbl head={['Level', 'Percentage']} rows={C.direct.rows} right={[1]} className="max-w-xl" />
      </Block>

      <Block tag="C" title="Rank Income">
        <div><p className="font-display text-xl text-tx-cyan">{rk.title}</p><p className="mt-1 text-slate-400">{rk.intro}</p></div>
        <Tbl head={['Rank', 'A Team Business', 'Other Team Business', 'Rank Percentage']} rows={C.ranks.map((x) => x.slice(0, 4))} right={[1, 2, 3]} />
        <Card title="Rank Rules"><Bullets items={rk.rules} /></Card>
      </Block>

      <Block tag="D" title="Unity Income">
        <div><p className="font-display text-xl text-tx-cyan">{un.title}</p><p className="mt-1 text-slate-400">{un.intro}</p></div>
        <Tbl head={['Rank', 'A Team Business', 'Other Team Business', 'Daily Reward']} rows={C.ranks.map((x) => [x[0], x[1], x[0] === 'Lumen' ? '$0–$3,000' : x[2], x[4]])} right={[1, 2, 3]} />
        <Card title="Unity Income Rules"><Bullets items={un.rules} /></Card>
      </Block>

      <Block tag="E" title="Single-Leg Income">
        <div><p className="font-display text-xl text-tx-cyan">{sl.title}</p><p className="mt-1 text-slate-400">{sl.intro}</p></div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Upline Distribution"><Bullets items={sl.upline} /></Card>
          <Card title="Downline Distribution"><Bullets items={sl.downline} /></Card>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {sl.features.map(([t, d]) => <div key={t} className="edge bg-gradient-to-br from-tx-blue/10 to-transparent p-5"><div className="font-display text-lg font-semibold grad-text">{t}</div><p className="mt-1 text-sm text-slate-400">{d}</p></div>)}
        </div>
        <Note>{sl.note}</Note>
      </Block>
    </Section>
  )
}

function FAQs() {
  const [o, setO] = useState(0)
  return (
    <Section id="faqs" className="bg-gradient-to-b from-transparent via-navy/60 to-transparent">
      <Head title="Frequently Asked Questions" center />
      <div className="mx-auto mt-14 max-w-3xl space-y-3">
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
  return (
    <footer className="relative overflow-hidden border-t border-white/5 px-5 pb-8 pt-16">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <p className="font-display text-2xl font-bold chrome-text sm:text-3xl">TITANX – Rule the Digital Era</p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">{C.footer.text}</p>
        <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {nav.map((l) => (
            <a key={l} href={'#' + id(l)} className="font-display text-sm text-slate-300 transition hover:text-tx-cyan">{l}</a>
          ))}
        </nav>
        <p className="mt-8 text-xs text-slate-500 sm:text-sm">{C.footer.copy}</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease }}
        className="pointer-events-none mt-10 select-none text-center font-display text-[16vw] font-bold leading-none tracking-wider opacity-[0.08] grad-text"
      >
        TITANX
      </motion.div>
    </footer>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  useEffect(() => { document.body.style.overflow = ready ? '' : 'hidden' }, [ready])
  return (
    <>
      <AnimatePresence>{!ready && <Loader done={() => setReady(true)} />}</AnimatePresence>
      <motion.div className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-tx-blue via-tx-cyan to-tx-lime" style={{ scaleX: bar }} />
      <Nav />
      <main><Hero /><HowItWorks /><About /><Token /><Tokenomics /><Utility /><Referral /><FAQs /></main>
      <Footer />
    </>
  )
}
