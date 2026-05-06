import { useEffect, useRef, useState } from 'react'
import './App.css'

/* ============================================================
   ANIMATION PRIMITIVES
   ============================================================ */

function useReveal(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in'); return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.unobserve(el)
        }
      })
    }, { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal()
  const cls = `reveal ${variant === 'left' ? 'reveal-left' : variant === 'right' ? 'reveal-right' : variant === 'scale' ? 'reveal-scale' : ''} ${className}`.trim()
  const style = delay ? { transitionDelay: `${delay}ms`, ...(rest.style || {}) } : rest.style
  return <Tag ref={ref} className={cls} {...rest} style={style}>{children}</Tag>
}

function ScrollProgress() {
  useEffect(() => {
    let raf = 0
    const update = () => {
      const h = document.documentElement
      const max = (h.scrollHeight - h.clientHeight) || 1
      const p = Math.min(1, Math.max(0, h.scrollTop / max))
      document.documentElement.style.setProperty('--p', String(p))
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])
  return <div className="scroll-progress" aria-hidden />
}

function MathBg() {
  /* Each: [content, top, left|right, fontSize, color (rgba), rotation start, rotation end, dx, dy, dur (s), delay (s)] */
  const items = [
    /* Original set */
    { c: 'π',                    top: '8%',  left: '6%',   size: 92, color: 'rgba(0,74,173,0.10)',  r1: -8, r2: 6, tx: 8,  ty: -16, dur: 7,   delay: 0 },
    { c: '∑',                    top: '14%', right: '8%',  size: 78, color: 'rgba(5,221,235,0.16)', r1: 4,  r2: -6, tx: -10, ty: -12, dur: 6.5, delay: -2 },
    { c: '√x',                   top: '70%', left: '4%',   size: 54, color: 'rgba(10,118,207,0.18)',r1: -6, r2: 4,  tx: 6,  ty: -18, dur: 5.5, delay: -1 },
    { c: '∫',                    top: '60%', right: '5%',  size: 96, color: 'rgba(0,74,173,0.10)',  r1: -3, r2: 8, tx: -8,  ty: -10, dur: 8,   delay: -3 },
    { c: '∞',                    top: '40%', left: '47%',  size: 64, color: 'rgba(5,221,235,0.14)', r1: 0,  r2: -10,tx: 12, ty: -8,  dur: 7.5, delay: -4 },
    { c: '%',                    top: '82%', right: '38%', size: 60, color: 'rgba(10,118,207,0.16)',r1: 6,  r2: -4, tx: -6, ty: -14, dur: 6,   delay: -2.5 },
    { c: 'a² + b² = c²',         top: '24%', left: '38%',  size: 18, color: 'rgba(0,74,173,0.16)',  r1: -2, r2: 2,  tx: 4,  ty: -10, dur: 9,   delay: -1.5 },
    { c: 'y = ax² + bx + c',     top: '54%', left: '35%',  size: 16, color: 'rgba(0,32,94,0.12)',  r1: 2,  r2: -2, tx: -4, ty: -12, dur: 8.5, delay: -3.5 },
    { c: 'f(x)',                 top: '76%', left: '22%',  size: 28, color: 'rgba(5,221,235,0.18)', r1: -5, r2: 3,  tx: 6,  ty: -10, dur: 6.2, delay: -0.5 },
    { c: '× ÷',                  top: '20%', left: '22%',  size: 32, color: 'rgba(0,74,173,0.14)',  r1: 4,  r2: -8, tx: -6, ty: -14, dur: 5.8, delay: -2.2 },
    { c: 'Δ',                    top: '88%', left: '60%',  size: 56, color: 'rgba(10,118,207,0.18)',r1: -4, r2: 6,  tx: 8,  ty: -16, dur: 7.2, delay: -1.2 },
    { c: '≠',                    top: '6%',  left: '54%',  size: 44, color: 'rgba(5,221,235,0.20)', r1: 5,  r2: -3, tx: -10, ty: -8,  dur: 6.8, delay: -3.8 },

    /* Second wave — more density, financial + logic flavor */
    { c: 'R$',                   top: '34%', left: '12%',  size: 38, color: 'rgba(5,221,235,0.18)', r1: -6, r2: 6,  tx: 8,  ty: -14, dur: 6.4, delay: -2.8 },
    { c: '$',                    top: '92%', left: '10%',  size: 70, color: 'rgba(0,74,173,0.10)',  r1: 3,  r2: -5, tx: -8, ty: -12, dur: 7.8, delay: -1.7 },
    { c: '∂',                    top: '52%', right: '18%', size: 54, color: 'rgba(10,118,207,0.16)',r1: -2, r2: 8,  tx: 6,  ty: -10, dur: 6.6, delay: -0.8 },
    { c: '≈',                    top: '12%', left: '32%',  size: 48, color: 'rgba(5,221,235,0.18)', r1: 4,  r2: -6, tx: -6, ty: -12, dur: 6.0, delay: -3.2 },
    { c: '±',                    top: '78%', right: '24%', size: 36, color: 'rgba(0,74,173,0.16)',  r1: -5, r2: 5,  tx: 8,  ty: -8,  dur: 7.0, delay: -2.6 },
    { c: '∑ⁿ',                   top: '90%', left: '32%',  size: 30, color: 'rgba(10,118,207,0.16)',r1: 5,  r2: -3, tx: -10, ty: -14, dur: 8.2, delay: -1.4 },
    { c: '(1+i)ⁿ',               top: '36%', left: '4%',   size: 18, color: 'rgba(0,32,94,0.14)',  r1: -3, r2: 3,  tx: 6,  ty: -8,  dur: 8.6, delay: -3.4 },
    { c: 'M = C·(1+i)ⁿ',         top: '64%', left: '12%',  size: 16, color: 'rgba(0,74,173,0.14)',  r1: 2,  r2: -4, tx: -6, ty: -12, dur: 9.2, delay: -0.4 },
    { c: 'P → Q',                top: '46%', left: '6%',   size: 22, color: 'rgba(5,221,235,0.18)', r1: 6,  r2: -4, tx: 4,  ty: -10, dur: 7.4, delay: -1.9 },
    { c: 'log',                  top: '8%',  right: '32%', size: 30, color: 'rgba(10,118,207,0.16)',r1: -4, r2: 4,  tx: -8, ty: -14, dur: 6.8, delay: -2.1 },
    { c: 'lim',                  top: '70%', right: '12%', size: 30, color: 'rgba(0,74,173,0.14)',  r1: 3,  r2: -3, tx: 6,  ty: -10, dur: 7.6, delay: -3.6 },
    { c: '√',                    top: '92%', right: '6%',  size: 64, color: 'rgba(5,221,235,0.16)', r1: -5, r2: 7,  tx: -6, ty: -16, dur: 6.4, delay: -1.1 },
    { c: 'i²= −1',               top: '4%',  right: '18%', size: 18, color: 'rgba(0,32,94,0.14)',  r1: 4,  r2: -2, tx: 4,  ty: -10, dur: 8.0, delay: -2.7 },
    { c: 'n!',                   top: '28%', right: '36%', size: 36, color: 'rgba(0,74,173,0.16)',  r1: -3, r2: 5,  tx: -6, ty: -12, dur: 6.6, delay: -0.9 },
    { c: '+',                    top: '50%', left: '24%',  size: 42, color: 'rgba(5,221,235,0.20)', r1: 0,  r2: -8, tx: 8,  ty: -8,  dur: 5.6, delay: -3.1 },
    { c: '−',                    top: '18%', left: '76%',  size: 50, color: 'rgba(10,118,207,0.18)',r1: 5,  r2: -5, tx: -8, ty: -10, dur: 6.2, delay: -1.6 },
    { c: '∝',                    top: '84%', left: '50%',  size: 44, color: 'rgba(0,74,173,0.14)',  r1: -4, r2: 4,  tx: 6,  ty: -12, dur: 7.4, delay: -2.4 },
    { c: '∈',                    top: '58%', left: '70%',  size: 40, color: 'rgba(5,221,235,0.18)', r1: 2,  r2: -6, tx: -6, ty: -10, dur: 6.0, delay: -0.7 },
    { c: '∀x',                   top: '44%', left: '20%',  size: 24, color: 'rgba(10,118,207,0.18)',r1: -2, r2: 6,  tx: 8,  ty: -8,  dur: 8.2, delay: -3.9 },
    { c: '⌈x⌉',                  top: '12%', right: '12%', size: 22, color: 'rgba(0,74,173,0.16)',  r1: 4,  r2: -4, tx: -6, ty: -12, dur: 7.0, delay: -1.3 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {items.map((it, i) => (
        <span
          key={i}
          className="math-float"
          style={{
            top: it.top, left: it.left, right: it.right,
            fontSize: `${it.size}px`,
            color: it.color,
            '--r1': `${it.r1}deg`, '--r2': `${it.r2}deg`,
            '--tx': `${it.tx}px`, '--ty': `${it.ty}px`,
            '--dur': `${it.dur}s`, '--delay': `${it.delay}s`,
          }}
        >{it.c}</span>
      ))}
    </div>
  )
}

function Marquee({ items }) {
  const seq = (
    <span className="marquee-track">
      {[...items, ...items].map((it, i) => (
        <span key={i} className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-[#00205e]/65">
          <span className="text-[#05ddeb]">◆</span>{it}
        </span>
      ))}
    </span>
  )
  return (
    <div className="marquee-wrap py-5 bg-[#f4f8fd] border-y border-[#dde6f1]">
      {seq}
    </div>
  )
}

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash || '#/')
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

function useCountdown() {
  const [t, setT] = useState({ h: '00', m: '00', s: '00' })
  useEffect(() => {
    const end = new Date(); end.setHours(23, 59, 59, 999)
    const tick = () => {
      const d = end.getTime() - Date.now()
      if (d <= 0) return
      const h = Math.floor(d / 3600000)
      const m = Math.floor((d % 3600000) / 60000)
      const s = Math.floor((d % 60000) / 1000)
      setT({ h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  return t
}

/* Square badge primitives — share the same 28x28 footprint across the site */
function LogoPC({ className = '' }) {
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-[6px] gradient-cta text-white font-semibold text-[11px] tracking-tight shrink-0 ${className}`}>
      PC
    </span>
  )
}
function LogoBB({ className = '' }) {
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-[6px] bg-[#002A75] text-[#FAE100] font-bold text-[11px] tracking-tight shrink-0 ${className}`}>
      BB
    </span>
  )
}

/* Stylized BB-inspired mark — two interlocking parallelograms in navy on yellow */
function LogoBBMark({ size = 64, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Banco do Brasil"
    >
      <rect width="64" height="64" rx="8" fill="#FAE100" />
      <g transform="translate(32 32)">
        {/* Upper interlocking rhombus */}
        <path d="M -22 -4 L 8 -20 L 22 -12 L -8 4 Z" fill="#002A75" />
        {/* Lower interlocking rhombus */}
        <path d="M -22 12 L 8 -4 L 22 4 L -8 20 Z" fill="#002A75" />
        {/* Tiny yellow break to echo the gap in real BB mark */}
        <path d="M 6 -4 L 10 -2 L 6 0 Z" fill="#FAE100" />
      </g>
    </svg>
  )
}

function BBBanner({ onClose }) {
  return (
    <div className="bb-banner w-full relative">
      <a href="#/bb" className="block">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-5 py-3 pr-12 flex items-center justify-center sm:justify-between gap-3 sm:gap-4 text-[12px] sm:text-sm">
          <div className="flex items-center gap-3 min-w-0">
            <LogoBB />
            <span className="font-semibold tracking-tight truncate">
              <span className="hidden sm:inline">NOVO CURSO · </span>Matemática Financeira — Concurso BB 2026
              <span className="hidden md:inline"> · Edital previsto p/ 1º sem.</span>
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] shrink-0">
            Saiba mais
            <span aria-hidden>→</span>
          </span>
        </div>
      </a>
      <button
        onClick={onClose}
        aria-label="Fechar banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-[#002A75] hover:bg-[#002A75]/10 rounded-full text-base font-bold"
      >
        ×
      </button>
    </div>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[#dde6f1]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
        <a href="#top" className="text-[#00205e] font-medium tracking-tight text-[15px] sm:text-base flex items-center gap-2 shrink-0">
          <LogoPC />
          <span className="hidden xs:inline sm:inline">Prof. Carrijo</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#1f2c44]">
          <a href="#metodologia" className="hover:text-[#004aad]">Metodologia</a>
          <a href="#cursos"      className="hover:text-[#004aad]">Cursos</a>
          <a href="#depoimentos" className="hover:text-[#004aad]">Depoimentos</a>
          <a href="#faq"         className="hover:text-[#004aad]">FAQ</a>
          <a href="#/bb"         className="text-[#002A75] font-semibold flex items-center gap-1.5"><LogoBB className="!w-5 !h-5 !text-[9px]" />Curso BB</a>
        </nav>
        <a href="#cursos" className="btn btn-primary text-xs sm:text-sm whitespace-nowrap">Ver cursos →</a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="gradient-hero pt-16 pb-20 md:pt-20 md:pb-24 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <span className="blob blob-cyan w-[480px] h-[480px] -top-32 -left-24" />
        <span className="blob blob-blue blob-delay-1 w-[520px] h-[520px] top-40 -right-32" />
        <span className="blob blob-mid blob-delay-2 w-[360px] h-[360px] bottom-0 left-1/3" />
      </div>

      {/* Floating math icons */}
      <MathBg />

      <div className="max-w-[1180px] mx-auto px-5 relative">
        <div className="grid md:grid-cols-[1.15fr_1fr] gap-10 md:gap-14 items-center">
          {/* Texto */}
          <div>
            <Reveal variant="up">
              <span className="pill pill-purple mb-7">
                <span className="caption-code">RLM · Concursos Públicos</span>
              </span>
            </Reveal>
            <Reveal variant="up" delay={80}>
              <h1 className="display-hero mb-6">
                Domine <span className="text-[#004aad]">Matemática Básica</span>, <span className="text-[#0a76cf]">Matemática Financeira</span> e <span className="text-[#004aad]">Raciocínio Lógico</span> para Concursos.
              </h1>
            </Reveal>
            <Reveal variant="up" delay={160}>
              <p className="body-large mb-3 text-[#1f2c44] font-medium">
                Mesmo começando do zero.
              </p>
            </Reveal>
            <Reveal variant="up" delay={220}>
              <p className="body-large mb-8 text-[#5a6678]">
                Pare de perder pontos nas matérias que mais eliminam candidatos. Você não precisa ser "bom em exatas" — você precisa do <strong className="text-[#00205e] font-semibold">método certo</strong>.
              </p>
            </Reveal>
            <Reveal variant="up" delay={280}>
              <div className="flex items-center gap-3 flex-wrap">
                <a href="#cursos" className="btn btn-primary btn-lg">Ver os cursos</a>
                <a href="#metodologia" className="btn btn-ghost btn-lg">Conhecer o método</a>
              </div>
              <p className="text-xs text-[#5a6678] mt-5">7 dias de garantia incondicional · Acesso imediato</p>
            </Reveal>
          </div>

          {/* Foto */}
          <Reveal variant="scale" delay={120} className="relative">
            <div className="absolute -inset-4 gradient-cta photo-glow opacity-25 blur-3xl rounded-full" aria-hidden />
            <div className="relative aspect-[3/4] rounded-[12px] overflow-hidden border border-[#dde6f1] bg-[#f4f8fd] card-elevated">
              <img
                src="/prof-carrijo.png"
                alt="Professor Carrijo de braços cruzados em frente a um quadro com equações matemáticas"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SocialProof() {
  const aprovados = [
    ['Aluno 01', '1º Polícia Federal'], ['Aluno 02', '3º TCU'], ['Aluno 03', '1º SEFAZ-RN'],
    ['Aluno 04', '5º Banco do Brasil'], ['Aluno 05', '2º Caixa Econômica'], ['Aluno 06', '1º TJ-SP'],
    ['Aluno 07', '4º Receita Federal'], ['Aluno 08', '2º INSS'], ['Aluno 09', '1º TRT 2ª Região'],
  ]
  return (
    <section className="py-24 bg-[#f4f8fd]">
      <div className="max-w-[1080px] mx-auto px-5">
        <div className="text-center mb-12">
          <p className="caption-code text-[#004aad] mb-3">PROVA SOCIAL</p>
          <h2 className="display-large mb-4">O resultado que só esse método entrega.</h2>
          <p className="body-large max-w-2xl mx-auto">Nossos alunos conquistando as primeiras colocações nos concursos mais disputados do Brasil.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {aprovados.map(([nome, cargo]) => (
            <div key={nome} className="bg-white border border-[#dde6f1] rounded-[6px] px-5 py-4 flex items-center gap-3">
              <span className="pill pill-success text-[10px]">APROVADO</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#00205e] truncate">{nome}</div>
                <div className="text-xs text-[#5a6678] truncate">{cargo}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#5a6678] mt-6 italic">* Lista parcial — substituir por aprovados reais do Prof. Carrijo.</p>
        <div className="text-center mt-10"><a href="#planos" className="btn btn-primary btn-lg">Quero aprender com esse método</a></div>
      </div>
    </section>
  )
}

function Dor() {
  const frases = [
    'Eu sou de humanas, não levo jeito pra exatas.',
    'Toda vez que abro uma questão de RLM eu travo.',
    'Até entendo a teoria, mas na prova nunca sei qual aplicar.',
    'Eu chuto todas as questões de exatas.',
    'Pulei matéria de concurso por causa de exatas.',
    'Já tentei vários cursos e continuo errando o básico.',
    'Faço conta de calculadora e dá certo, mas no papel sai errado.',
    'Demoro uma eternidade pra resolver — não termino a prova.',
    'Sei que se passasse em RLM, já estava aprovado.',
  ]
  const [marcadas, setMarcadas] = useState(() => new Set())
  const toggle = (i) => setMarcadas(prev => {
    const next = new Set(prev)
    if (next.has(i)) next.delete(i); else next.add(i)
    return next
  })
  const total = marcadas.size
  return (
    <section className="py-24">
      <div className="max-w-[820px] mx-auto px-5">
        <div className="text-center mb-12">
          <p className="caption-code text-[#e6234d] mb-3">VOCÊ SE IDENTIFICA?</p>
          <h2 className="heading-section mb-4">Marque quantas dessas frases você já disse.</h2>
          <p className="body-large">Se for 3 ou mais, o problema <u>não é você</u>. É o método.</p>
        </div>
        <ul className="grid sm:grid-cols-2 gap-3">
          {frases.map((f, i) => {
            const on = marcadas.has(i)
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={on}
                  className={`w-full text-left flex items-start gap-3 rounded-[6px] p-4 transition border ${on ? 'bg-[#f4f8fd] border-[#004aad]' : 'bg-white border-[#dde6f1] hover:border-[#b8d6f5]'}`}
                >
                  <span className={`w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center transition ${on ? 'bg-[#004aad] border border-[#004aad]' : 'border border-[#b8d6f5] bg-white'}`}>
                    {on && (
                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M3 8.5l3.5 3.5L13 4.5" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm ${on ? 'text-[#00205e] font-medium' : 'text-[#1f2c44]'}`}>{f}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <div
          className={`mt-8 text-center text-sm transition ${total >= 3 ? 'text-[#004aad] font-semibold' : 'text-[#5a6678]'}`}
          aria-live="polite"
        >
          {total === 0 && 'Comece marcando as frases que você já disse.'}
          {total > 0 && total < 3 && `Você marcou ${total}. Continue lendo, talvez se identifique com mais.`}
          {total >= 3 && `Você marcou ${total}. O problema não é você — é o método. Hora de mudar.`}
        </div>
      </div>
    </section>
  )
}

function ParaQuem() {
  const items = [
    ['🎯', 'Foco em concurso', 'Fiscal, policial, tribunal, bancário ou controle.'],
    ['📉', 'Já perdeu vaga', 'Por causa da nota em RLM ou matemática.'],
    ['🧠', 'Trava na prova', 'Mesmo tendo estudado, não consegue aplicar.'],
    ['⏱️', 'Pouco tempo', 'Precisa de método direto, sem enrolação.'],
    ['🔄', 'Tentou outros cursos', 'E continua no mesmo ponto.'],
    ['🏆', 'Quer gabaritar', 'E transformar RLM em diferencial.'],
  ]
  return (
    <section className="py-24 bg-[#f4f8fd]">
      <div className="max-w-[1080px] mx-auto px-5">
        <Reveal className="text-center mb-14">
          <p className="caption-code text-[#004aad] mb-3">PRA QUEM É</p>
          <h2 className="display-large">Esse curso é para você que…</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map(([ic, t, d], i) => (
            <Reveal key={t} variant="up" delay={i * 80} className="card card-hover">
              <div className="text-2xl mb-3">{ic}</div>
              <h3 className="heading-sub mb-2 text-lg">{t}</h3>
              <p className="text-[#5a6678] text-sm leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Professor() {
  return (
    <section className="py-24">
      <div className="max-w-[1080px] mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-square rounded-[8px] bg-[#f4f8fd] border border-[#dde6f1] flex items-center justify-center text-[#5a6678] text-sm card-elevated">
          [ FOTO PROF. CARRIJO ]
        </div>
        <div>
          <p className="caption-code text-[#004aad] mb-3">QUEM ESTÁ POR TRÁS</p>
          <h2 className="display-large mb-5">Muito prazer, sou o <span className="text-[#004aad]">Professor Carrijo</span>.</h2>
          <p className="body-large mb-4">...mas a maioria dos meus alunos me conhece como "o professor que destrava RLM".</p>
          <p className="text-[#5a6678] mb-4">Ajudei milhares de concurseiros a sair do zero em Raciocínio Lógico-Matemático e chegar nos primeiros lugares dos concursos mais disputados do país.</p>
          <p className="text-[#5a6678]">O método que você vai conhecer aqui <strong className="text-[#00205e] font-medium">não depende de dom pra exatas</strong>. Depende de seguir passo a passo um processo já validado.</p>
        </div>
      </div>
    </section>
  )
}

function Metodologia() {
  const mitos = [
    ['Matemática é difícil', 'Você só nunca viu sendo bem explicada.'],
    ['Raciocínio lógico é "pra quem nasceu com dom"', 'Não é. É treino + método.'],
    ['Matemática financeira é cheia de fórmulas impossíveis', 'A maioria das fórmulas você nem precisa decorar.'],
  ]
  return (
    <section id="metodologia" className="py-24 gradient-dark text-white relative overflow-hidden">
      <div className="max-w-[1080px] mx-auto px-5 relative">
        <Reveal className="text-center mb-14">
          <p className="caption-code text-[#05ddeb] mb-3">METODOLOGIA</p>
          <h2 className="display-large text-white mb-5">Durante anos, te fizeram acreditar que…</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {mitos.map(([titulo, contra], i) => (
            <Reveal key={titulo} variant="up" delay={i * 120} className="rounded-[8px] p-7 bg-white/[0.04] border border-white/10 backdrop-blur card-hover">
              <div className="text-[#05ddeb]/80 text-xs uppercase tracking-widest font-bold mb-3">Mito</div>
              <h3 className="text-white text-lg font-medium mb-4 leading-snug">"{titulo}"</h3>
              <div className="border-t border-white/10 pt-4">
                <div className="text-[#05ddeb] text-xs uppercase tracking-widest font-bold mb-2">Verdade</div>
                <p className="text-white/85 text-sm leading-relaxed">{contra}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal variant="scale" className="max-w-[760px] mx-auto text-center">
          <p className="text-white/85 text-xl md:text-2xl leading-relaxed font-light mb-6">
            Você nunca teve acesso a um <span className="text-[#05ddeb] font-medium">método direto ao ponto</span>.
          </p>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Você não precisa aprender tudo. Você precisa aprender <strong className="text-white font-medium">o que cai</strong> + <strong className="text-white font-medium">como resolver</strong>.
          </p>
          <p className="text-white/65 text-base leading-relaxed mb-10 max-w-[640px] mx-auto">
            Para você que deseja dominar a Matemática e conquistar a aprovação no concurso dos seus sonhos, os cursos foram cuidadosamente elaborados visando elevar suas habilidades e otimizar o tempo de resolução das questões — proporcionando uma compreensão sólida e eficaz. Tudo isso com o auxílio do <span className="text-[#05ddeb] font-semibold">#métodocarrijo</span>.
          </p>
          <a href="#cursos" className="btn btn-on-dark btn-lg">Quero conhecer os cursos</a>
        </Reveal>
      </div>
    </section>
  )
}

function CustoDeErrar() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[820px] mx-auto px-5 text-center">
        <p className="caption-code text-[#e6234d] mb-3">⚠ CUSTO DE OPORTUNIDADE</p>
        <h2 className="display-large mb-6">Quanto custa errar as questões de RLM numa prova?</h2>
        <p className="body-large mb-3">Um cargo de fiscal estadual paga, em média, <span className="text-[#00205e] font-medium">R$ 30.000/mês</span>.</p>
        <p className="body-large mb-8">Em 4 anos, isso é:</p>
        <div className="inline-block gradient-cta rounded-[8px] px-10 py-8 card-elevated">
          <div className="text-white text-6xl md:text-7xl font-light tracking-tight">R$ 1.440.000</div>
        </div>
        <p className="body-large mt-8 max-w-xl mx-auto">Cada questão de RLM que você erra — e seu concorrente acerta — pode ser <u>a diferença entre esse futuro e continuar onde está</u>.</p>
      </div>
    </section>
  )
}

function Cursos() {
  return (
    <section id="cursos" className="py-24 bg-[#f4f8fd]">
      <div className="max-w-[1080px] mx-auto px-5">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <p className="caption-code text-[#004aad] mb-3">OS CURSOS</p>
          <h2 className="display-large mb-5">Não são só cursos.</h2>
          <p className="body-large text-[#5a6678]">
            É um <strong className="text-[#00205e] font-semibold">processo de desbloqueio em exatas</strong>. Um sistema criado para transformar quem trava em matemática em alguém que resolve questões com segurança.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Curso 1 — Destravando a Base */}
          <Reveal variant="left" delay={80} className="card card-elevated card-hover relative flex flex-col">
            <span className="absolute -top-4 left-6 pill pill-purple pill-float !text-[11px] font-bold">DESTRAVANDO A BASE</span>
            <h3 className="heading-sub mt-3 mb-2 text-2xl text-[#00205e] font-semibold">Desvendando a Matemática</h3>
            <p className="text-[#5a6678] text-[15px] leading-relaxed mb-6">
              Você vai entender matemática básica como nunca antes. Sem fórmulas decoradas. Com lógica.
            </p>
            <ul className="space-y-2 text-sm text-[#1f2c44] mb-7 flex-1">
              <li>✓ Base completa para qualquer concurso</li>
              <li>✓ Sem decoreba — pura compreensão</li>
              <li>✓ Aulas didáticas, direto ao ponto</li>
              <li>✓ Acesso imediato após pagamento</li>
            </ul>
            <a
              href="https://pay.kiwify.com.br/gcSP33B"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-lg w-full"
            >
              Quero esse curso →
            </a>
          </Reveal>

          {/* Curso 2 — Matemática que cai na prova */}
          <Reveal variant="right" delay={160} className="card card-elevated card-hover relative flex flex-col">
            <span className="absolute -top-4 left-6 pill pill-cyan pill-float pill-float-delay !text-[11px] font-bold">MATEMÁTICA QUE CAI NA PROVA</span>
            <h3 className="heading-sub mt-3 mb-2 text-2xl text-[#00205e] font-semibold">Matemática Financeira para Bancos</h3>
            <p className="text-[#5a6678] text-[15px] leading-relaxed mb-6">
              Você vai conferir conceitos como porcentagem, juros simples e compostos, financiamentos e, principalmente, como utilizar tudo isso a seu favor na hora da prova — e também no dia a dia. Sem complicação. Direto na aplicação.
            </p>
            <ul className="space-y-2 text-sm text-[#1f2c44] mb-7 flex-1">
              <li>✓ Foco em concursos bancários (BB, Caixa, etc.)</li>
              <li>✓ Porcentagem, juros simples e compostos</li>
              <li>✓ Financiamentos e amortização</li>
              <li>✓ Aplicação direta em questões reais</li>
            </ul>
            <a
              href="#/bb"
              className="btn btn-primary btn-lg w-full"
              style={{ background: 'linear-gradient(90deg, #0a76cf 0%, #05ddeb 100%)' }}
            >
              Ver curso completo →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Bonus() {
  const bonus = [
    ['#1', 'Simulados Cronometrados', '30+ simulados nos moldes de prova real.'],
    ['#2', 'Mapas Mentais PDF',        'Conteúdo sintetizado em 1 página por tema.'],
    ['#3', 'Comunidade Fechada',       'Plantão de dúvidas diretamente comigo.'],
    ['#4', 'Aulas ao vivo mensais',    'Resolução de questões do seu edital.'],
  ]
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1080px] mx-auto px-5">
        <div className="text-center mb-14">
          <p className="caption-code text-[#e6234d] mb-3">BÔNUS EXCLUSIVOS</p>
          <h2 className="display-large">E entrando hoje você ainda leva:</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {bonus.map(([n, t, d]) => (
            <div key={n} className="card card-elevated relative">
              <span className="absolute -top-3 left-6 pill gradient-accent text-white border-0">BÔNUS {n}</span>
              <h3 className="mt-4 heading-sub text-lg font-medium">{t}</h3>
              <p className="text-[#5a6678] text-sm mt-2">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComoFunciona() {
  const steps = [
    'Acesse a plataforma logo após a confirmação do pagamento.',
    'Escolha sua trilha (pré-edital genérica ou pós-edital específica).',
    'Siga o passo a passo do método — aulas curtas, exercícios guiados.',
    'Em poucas semanas, passa a acertar questões que pareciam impossíveis.',
    'Vai para a prova com confiança. RLM vira seu diferencial.',
  ]
  return (
    <section className="py-24 bg-[#f4f8fd]">
      <div className="max-w-[820px] mx-auto px-5">
        <div className="text-center mb-12">
          <p className="caption-code text-[#004aad] mb-3">NA PRÁTICA</p>
          <h2 className="display-large">Como funciona</h2>
        </div>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4 items-start card">
              <div className="w-9 h-9 rounded-[6px] gradient-cta text-white flex items-center justify-center font-medium shrink-0">{i + 1}</div>
              <p className="pt-1.5 text-[#1f2c44]">{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Depoimentos() {
  const deps = [
    ['Eu vou ser eternamente grata ao professor Carrijo por tudo que ele fez por mim, por ter acreditado em mim quando nem eu acreditava e por ter me incentivado tanto. Nunca vou ter como agradecer. Essa aprovação só foi possível por causa dele.', 'Aluna aprovada'],
    ['Oi Prof. Carrijo! Passando pra agradecer por seus ensinamentos, fiz a prova dos Correios e acertei 9/10. Gratidão, professor! Estou muito feliz com meu desempenho e sei que posso avançar mais.', 'Aluna · prova dos Correios'],
    ['Graças a Jeová e a sua dedicação e didática fiz a prova dos Correios e acertei 9/10 em Matemática. Isso me deixou muito feliz!! Obrigado mesmo, professor.', 'Rafael · Mentoria do BB'],
    ['Nunca vi alguém fazer a matemática parecer algo tão simples como você faz. Você tem uma explicação incrível, um dos professores que mais tem a minha admiração! Tenho certeza que centenas ou milhares de vidas são mudadas graças às suas aulas.', 'Fabrício, 18 anos · Mentoria do Beto'],
    ['Obrigada pelo seu trabalho, dedicação, amor pelo o que faz. Nunca na vida eu me imaginei indo bem em matemática… era um bloqueio. Glória a Deus por isso. Que venha o BB! 🙏', 'Aluna · 9/10 em matemática'],
    ['Graças às suas aulas eu gabaritei matemática na prova dos correios. Achei até fácil kkk — espero que tenha sido pq eu estudei, porque eu achei que estava muito fácil de resolver os cálculos.', 'Aluna · gabaritou matemática'],
  ]
  return (
    <section id="depoimentos" className="py-24 bg-white">
      <div className="max-w-[1080px] mx-auto px-5">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <p className="caption-code text-[#004aad] mb-3">DEPOIMENTOS</p>
          <h2 className="display-large mb-4">Esse método não nasceu em teoria.</h2>
          <p className="body-large text-[#5a6678]">Nasceu na prática, com alunos reais, com dificuldades reais — e <strong className="text-[#00205e] font-semibold">resultados reais</strong>.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {deps.map(([t, n], i) => (
            <Reveal key={i} as="figure" variant="up" delay={(i % 3) * 100} className="card card-hover relative">
              <span className="absolute -top-3.5 left-5 pill pill-cyan pill-float !text-[10px] font-bold" style={{ animationDelay: `${(i % 3) * -1.2}s` }}>WHATSAPP</span>
              <blockquote className="text-[#1f2c44] text-[14px] leading-relaxed mt-3 mb-5">"{t}"</blockquote>
              <figcaption className="text-xs font-semibold text-[#004aad] uppercase tracking-wider">— {n}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TabelaValor() {
  const itens = [
    ['RLM do Zero', 397], ['Lógica Proposicional', 297], ['Análise Combinatória', 297],
    ['Matemática Financeira', 397], ['Probabilidade Avançada', 297], ['Estatística Descritiva', 297],
    ['Questões FGV + CEBRASPE', 397], ['Reta Final', 497], ['Simulados Cronometrados', 297], ['Comunidade + Aulas ao vivo', 497],
  ]
  const total = itens.reduce((a, [, v]) => a + v, 0)
  return (
    <section className="py-24 bg-[#f4f8fd]">
      <div className="max-w-[720px] mx-auto px-5">
        <div className="text-center mb-10">
          <p className="caption-code text-[#004aad] mb-3">VALOR TOTAL</p>
          <h2 className="display-large">Tudo o que você ganha ao se matricular</h2>
        </div>
        <div className="card card-elevated">
          <ul className="divide-y divide-[#dde6f1]">
            {itens.map(([n, v]) => (
              <li key={n} className="flex justify-between items-center py-3 text-sm">
                <span className="text-[#1f2c44]">✓ {n}</span>
                <span className="font-medium text-[#00205e] font-mono">R$ {v}</span>
              </li>
            ))}
            <li className="flex justify-between items-center pt-5 mt-2 text-base">
              <span className="text-[#00205e] font-medium">Total somado</span>
              <span className="font-medium text-[#004aad] text-2xl font-mono tracking-tight">R$ {total.toLocaleString('pt-BR')}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Planos() {
  return (
    <section id="planos" className="py-24 gradient-dark text-white relative overflow-hidden">
      <div className="max-w-[1080px] mx-auto px-5">
        <div className="text-center mb-14">
          <p className="caption-code text-[#05ddeb] mb-3">CONDIÇÃO EXCLUSIVA</p>
          <h2 className="display-large text-white mb-3">Escolha seu plano e comece hoje</h2>
          <p className="body-large text-white/70">Essa condição vale apenas enquanto o contador ao final estiver ativo.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* VITALÍCIO */}
          <div className="relative rounded-[8px] bg-white text-[#00205e] p-8 card-elevated">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 pill gradient-cta text-white border-0 font-medium">MELHOR OPÇÃO</span>
            <h3 className="heading-sub mt-3 font-medium">Acesso Vitalício</h3>
            <p className="text-[#5a6678] text-sm mb-6">Pague uma vez, estude pra sempre.</p>
            <div className="mb-6">
              <div className="text-xs text-[#5a6678] caption-code">À VISTA NO PIX</div>
              <div className="text-5xl font-light tracking-tight mt-1">R$ 497</div>
              <div className="text-sm text-[#5a6678]">ou 12× de R$ 51</div>
            </div>
            <ul className="space-y-2 text-sm mb-8 text-[#1f2c44]">
              <li>✓ Acesso vitalício a todas as trilhas</li>
              <li>✓ Todas as atualizações futuras</li>
              <li>✓ 4 bônus exclusivos</li>
              <li>✓ Comunidade fechada para sempre</li>
              <li>✓ 7 dias de garantia</li>
            </ul>
            <a href="#" className="btn btn-primary btn-lg w-full">Quero acesso vitalício</a>
          </div>

          {/* 1 ANO */}
          <div className="rounded-[8px] bg-white/[0.04] border border-white/10 p-8">
            <h3 className="heading-sub font-medium text-white">1 Ano de Acesso</h3>
            <p className="text-white/60 text-sm mb-6">Ideal se seu concurso sai este ano.</p>
            <div className="mb-6">
              <div className="text-xs text-white/60 caption-code">À VISTA NO PIX</div>
              <div className="text-5xl font-light tracking-tight mt-1 text-white">R$ 397</div>
              <div className="text-sm text-white/60">ou 12× de R$ 41</div>
            </div>
            <ul className="space-y-2 text-sm mb-8 text-white/80">
              <li>✓ 12 meses de acesso completo</li>
              <li>✓ Todas as trilhas atuais</li>
              <li>✓ 4 bônus exclusivos</li>
              <li>✓ Comunidade durante 12 meses</li>
              <li>✓ 7 dias de garantia</li>
            </ul>
            <a href="#" className="btn btn-on-dark btn-lg w-full">Quero 1 ano de acesso</a>
          </div>
        </div>
        <p className="text-center text-xs text-white/40 mt-8">* Troque os links dos botões pelo checkout real (Hotmart / Kiwify / Stripe).</p>
      </div>
    </section>
  )
}

function Comparativo() {
  const rows = [
    ['Método', 'Passo a passo guiado, sem pular etapas', 'Teoria densa sem prática dirigida'],
    ['Organização', 'Trilhas por banca e cargo', 'Tudo junto, sem segmentação'],
    ['Foco', 'Resolver rápido, não só entender', 'Decoreba de fórmulas'],
    ['Questões', 'Milhares comentadas em vídeo', 'Pouca resolução de questão real'],
    ['Material', 'Concentrado (sem enrolação)', 'Disperso (você junta sozinho)'],
  ]
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1080px] mx-auto px-5">
        <div className="text-center mb-14">
          <p className="caption-code text-[#004aad] mb-3">COMPARATIVO</p>
          <h2 className="display-large">Método Prof. Carrijo vs. cursos tradicionais</h2>
        </div>
        {/* Desktop: 3-col grid table */}
        <div className="hidden md:block card overflow-hidden p-0">
          <div className="grid grid-cols-3 text-sm">
            <div className="p-4 border-b border-[#dde6f1] font-medium text-[#5a6678] caption-code">CRITÉRIO</div>
            <div className="p-4 border-b border-[#dde6f1] font-medium text-[#004aad] caption-code">PROF. CARRIJO</div>
            <div className="p-4 border-b border-[#dde6f1] font-medium text-[#5a6678] caption-code">TRADICIONAIS</div>
            {rows.map(([k, a, b], i) => (
              <div key={k} className="contents">
                <div className={`p-4 text-[#1f2c44] font-medium ${i < rows.length - 1 ? 'border-b border-[#dde6f1]' : ''}`}>{k}</div>
                <div className={`p-4 text-[#00205e] ${i < rows.length - 1 ? 'border-b border-[#dde6f1]' : ''}`}>✓ {a}</div>
                <div className={`p-4 text-[#5a6678] ${i < rows.length - 1 ? 'border-b border-[#dde6f1]' : ''}`}>✗ {b}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile: stacked cards per criterion */}
        <div className="md:hidden space-y-3">
          {rows.map(([k, a, b]) => (
            <div key={k} className="card p-5">
              <p className="caption-code text-[#5a6678] mb-3">{k}</p>
              <div className="mb-2 flex gap-2"><span className="text-[#004aad]">✓</span><span className="text-[#00205e] text-sm">{a}</span></div>
              <div className="flex gap-2"><span className="text-[#5a6678]">✗</span><span className="text-[#5a6678] text-sm">{b}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Escolha() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[760px] mx-auto px-5 text-center">
        <Reveal>
          <p className="caption-code text-[#004aad] mb-4">A ESCOLHA É SUA</p>
          <h2 className="display-large mb-6">Você pode continuar tentando sozinho…</h2>
          <p className="body-large text-[#5a6678] mb-3">…ou pode <strong className="text-[#00205e] font-semibold">encurtar o caminho</strong>.</p>
          <p className="body-large text-[#5a6678] mb-10">A escolha é sua.</p>
        </Reveal>

        <Reveal variant="scale" delay={120}>
          <div className="inline-block gradient-cta rounded-[8px] px-7 py-5 card-elevated mb-8">
            <p className="text-white font-semibold uppercase tracking-widest text-xs mb-2">Condição especial</p>
            <p className="text-white text-2xl md:text-3xl font-light">Hoje você entra com condição especial.</p>
            <p className="text-white/85 text-sm mt-2">Mas não por muito tempo.</p>
          </div>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <a href="#cursos" className="btn btn-primary btn-lg">Ver cupom de promoção</a>
        </Reveal>
      </div>
    </section>
  )
}

function Garantia() {
  return (
    <section className="py-24 bg-[#f4f8fd]">
      <Reveal className="max-w-[720px] mx-auto px-5 text-center">
        <div className="inline-flex items-center gap-2 pill pill-success mb-6">🛡 7 DIAS DE GARANTIA</div>
        <h2 className="display-large mb-5">7 dias para testar sem risco</h2>
        <p className="body-large mb-10 text-[#5a6678]">
          Você tem, por lei, o direito de testar o produto durante 7 dias. Se dentro desse período você achar que não é para você, entre em contato com o nosso suporte e devolvemos 100% do valor. Sem perguntas, sem burocracia.
        </p>
        <a href="#cursos" className="btn btn-primary btn-lg">Quero conhecer os cursos</a>
      </Reveal>
    </section>
  )
}

function SobreProfessor() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[820px] mx-auto px-5">
        <div className="text-center mb-10">
          <p className="caption-code text-[#004aad] mb-3">CONHEÇA O PROFESSOR</p>
          <h2 className="display-large">Professor Carrijo</h2>
        </div>
        <div className="card">
          <ul className="space-y-3 text-[#1f2c44]">
            <li>• Especialista em Raciocínio Lógico-Matemático para concursos públicos</li>
            <li>• Milhares de alunos aprovados em concursos federais, estaduais e municipais</li>
            <li>• Criador do método que destrava exatas para concurseiros de humanas</li>
            <li>• Conteúdo diário no Instagram <a href="https://instagram.com/profcarrijo" className="text-[#004aad] font-medium" target="_blank" rel="noreferrer">@profcarrijo</a></li>
          </ul>
          <p className="text-xs text-[#5a6678] italic mt-5">* Substituir por bio, formação e histórico reais do Prof. Carrijo.</p>
        </div>
      </div>
    </section>
  )
}

function Urgencia() {
  const { h, m, s } = useCountdown()
  return (
    <section className="py-24 gradient-dark text-white">
      <div className="max-w-[720px] mx-auto px-5 text-center">
        <p className="caption-code text-[#05ddeb] mb-3">⏱ ATENÇÃO</p>
        <h2 className="display-large text-white mb-8">Essa condição especial acaba em:</h2>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10">
          {[[h, 'horas'], [m, 'min'], [s, 'seg']].map(([v, l]) => (
            <div key={l} className="rounded-[8px] bg-white/[0.06] border border-white/10 p-5">
              <div className="text-5xl font-light tracking-tight font-mono">{v}</div>
              <div className="caption-code text-white/60 mt-2">{l}</div>
            </div>
          ))}
        </div>
        <a href="#cursos" className="btn btn-on-dark btn-lg">Quero garantir minha vaga</a>
      </div>
    </section>
  )
}

function FAQ() {
  const qa = [
    ['E se eu for muito ruim?', 'Melhor ainda. O método foi feito exatamente pra isso — começar do zero, sem assumir que você se lembra de algo da escola. A base é reconstruída passo a passo.'],
    ['Já tentei antes e não consegui…', 'Provavelmente você só tentou do jeito errado. A maioria dos cursos despeja teoria sem mostrar como aplicar na questão. Aqui é o oposto: cada conceito vira ferramenta de prova.'],
    ['Preciso de conhecimento prévio?', 'Não. O método começa do zero absoluto. Se você sabe somar e multiplicar, já dá pra começar.'],
    ['Como funciona o acesso?', 'Após a confirmação do pagamento, você recebe um e-mail com login e senha. Acesso liberado em minutos.'],
    ['Funciona no celular?', 'Sim. Plataforma 100% responsiva — celular, tablet, notebook e desktop.'],
    ['Quais formas de pagamento?', 'PIX (à vista com desconto) ou cartão em até 12×. Ambiente 100% seguro pela Kiwify.'],
    ['Serve para qualquer concurso?', 'Sim — concursos federais, estaduais, municipais, bancários (BB, Caixa) e tribunais. As principais bancas (FGV, CEBRASPE, FCC, VUNESP, CESGRANRIO) seguem padrões cobertos no método.'],
    ['E se não for pra mim?', '7 dias de garantia incondicional. Um e-mail e devolvemos 100% do valor — sem perguntas.'],
  ]
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-[720px] mx-auto px-5">
        <Reveal className="text-center mb-12">
          <p className="caption-code text-[#004aad] mb-3">FAQ</p>
          <h2 className="display-large">Perguntas frequentes</h2>
        </Reveal>
        <div className="space-y-2">
          {qa.map(([q, a], i) => (
            <Reveal key={i} as="details" variant="up" delay={i * 50} className="group card card-hover py-5 px-5">
              <summary className="flex justify-between items-center text-[#00205e] font-medium">
                <span>{q}</span>
                <span className="w-7 h-7 rounded-[6px] border border-[#d8e7f8] text-[#004aad] flex items-center justify-center transition-transform duration-300 group-open:rotate-45 group-open:bg-[#004aad] group-open:text-white group-open:border-[#004aad]">+</span>
              </summary>
              <p className="text-[#5a6678] mt-3 text-sm leading-relaxed">{a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTAFinal() {
  return (
    <section className="py-28 gradient-cta text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden>
        <span className="blob w-[400px] h-[400px] -top-20 -left-20" style={{ background: 'rgba(255,255,255,0.5)' }} />
        <span className="blob blob-delay-1 w-[500px] h-[500px] -bottom-32 -right-32" style={{ background: 'rgba(5,221,235,0.6)' }} />
      </div>
      <Reveal className="max-w-[820px] mx-auto px-5 text-center relative">
        <h2 className="display-hero text-white mb-8">Chegou a hora de transformar matemática no seu diferencial.</h2>
        <a href="#cursos" className="btn btn-on-dark btn-lg">Quero começar agora</a>
        <p className="text-sm text-white/85 mt-6">7 dias de garantia · Acesso imediato · Pagamento seguro</p>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#00102e] text-white/60 py-14">
      <div className="max-w-[1080px] mx-auto px-5 text-sm grid md:grid-cols-3 gap-10">
        <div>
          <div className="text-white font-semibold mb-3 flex items-center gap-2.5 tracking-tight">
            <LogoPC />
            <span className="text-base">Prof. Carrijo</span>
          </div>
          <p className="leading-relaxed">Matemática Básica, Financeira e Raciocínio Lógico para concursos públicos. <span className="text-[#05ddeb] font-semibold">#métodocarrijo</span></p>
        </div>
        <div>
          <div className="caption-code text-white/40 mb-3">CONTATO</div>
          <a href="https://instagram.com/profcarrijo" className="block hover:text-white transition" target="_blank" rel="noreferrer">@profcarrijo</a>
        </div>
        <div>
          <div className="caption-code text-white/40 mb-3">LEGAL</div>
          <p className="text-xs">© 2026 Prof. Carrijo. Todos os direitos reservados.</p>
          <p className="text-xs mt-2 text-white/40">Este site não garante resultados. Aprovação depende de dedicação individual.</p>
        </div>
      </div>
    </footer>
  )
}

function BBModal({ onClose }) {
  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = orig; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(6,27,49,0.62)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[520px] rounded-[8px] overflow-hidden"
        style={{
          background: '#FAE100',
          boxShadow: 'rgba(0,42,117,0.4) 0px 40px 80px -20px, rgba(0,0,0,0.3) 0px 24px 48px -24px',
          border: '2px solid #002A75',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 w-9 h-9 flex items-center justify-center text-[#002A75] hover:bg-[#002A75]/10 rounded-full text-2xl leading-none z-10"
        >
          ×
        </button>

        <div className="p-6 sm:p-8">
          {/* BB logo mark — prominent */}
          <div className="flex items-center gap-3 mb-6">
            <LogoBBMark size={56} />
            <div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-[#002A75]">Edição especial</div>
              <div className="text-sm font-semibold text-[#002A75]">Concurso BB 2026</div>
            </div>
          </div>

          <h2 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-[#002A75] mb-3 leading-[1.15]">
            Novo curso de <span className="underline decoration-[#002A75]/40 decoration-2 underline-offset-4">Matemática Financeira</span> para o Banco do Brasil.
          </h2>
          <p className="text-[#1f1f1f]/80 text-[15px] leading-relaxed mb-6">
            Edital previsto para o 1º semestre de 2026 · Escriturário nível médio · remuneração até <strong className="text-[#002A75]">R$ 8.700/mês</strong>. Curso 100% focado no padrão CESGRANRIO.
          </p>

          <ul className="space-y-2.5 text-sm text-[#1f1f1f] mb-7">
            <li className="flex items-start gap-2.5"><span className="bg-[#002A75] text-[#FAE100] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>8 módulos · 40h+ de aulas</li>
            <li className="flex items-start gap-2.5"><span className="bg-[#002A75] text-[#FAE100] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>900+ questões comentadas em vídeo</li>
            <li className="flex items-start gap-2.5"><span className="bg-[#002A75] text-[#FAE100] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>Simulados cronometrados no molde BB</li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#/bb"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#002A75] hover:bg-[#001858] text-[#FAE100] font-bold uppercase tracking-wider text-[13px] px-6 py-4 rounded-[4px] transition"
            >
              Ver curso completo →
            </a>
            <button
              onClick={onClose}
              className="sm:flex-none inline-flex items-center justify-center text-[#002A75] font-medium text-sm px-5 py-4 hover:underline"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Home({ showBanner, onBannerClose }) {
  return (
    <>
      <ScrollProgress />
      {showBanner && <BBBanner onClose={onBannerClose} />}
      <Nav />
      <Hero />
      <Marquee items={[
        'Matemática Básica',
        'Matemática Financeira',
        'Raciocínio Lógico',
        'Juros Simples & Compostos',
        'Porcentagem',
        'Análise Combinatória',
        'Lógica Proposicional',
        'Concursos Bancários',
        'Tribunais',
        'Receita Federal',
        'Polícia Federal',
        '#métodocarrijo',
      ]} />
      <Dor />
      <ParaQuem />
      <Metodologia />
      <Cursos />
      <Depoimentos />
      <Escolha />
      <Garantia />
      <SobreProfessor />
      <Urgencia />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  )
}

/* ============================================================
   BB COURSE PAGE — Mistral-inspired design, BB yellow anchor
   ============================================================ */

function BBNav() {
  return (
    <header className="sticky top-0 z-40 bg-[#fffaeb]/90 backdrop-blur border-b border-[#1f1f1f]/10" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
        <a href="#/" className="flex items-center gap-2 sm:gap-2.5 text-[#1f1f1f] shrink-0">
          <LogoPC />
          <span className="text-[#1f1f1f]/30 text-lg font-light">×</span>
          <LogoBB />
          <span className="hidden sm:inline text-sm font-medium tracking-tight ml-1">Curso BB</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#programa" className="hover:text-[#fa520f]">Programa</a>
          <a href="#metodo"   className="hover:text-[#fa520f]">Método</a>
          <a href="#investir" className="hover:text-[#fa520f]">Investir</a>
          <a href="#/"        className="text-[#5a6678] hover:text-[#fa520f]">← Voltar</a>
        </nav>
        <a href="#investir" className="bb-btn bb-btn-dark text-[12px] sm:text-[13px] whitespace-nowrap">Matricular-se</a>
      </div>
    </header>
  )
}

function BBHero() {
  return (
    <section className="bb-gradient-hero relative overflow-hidden" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[1200px] mx-auto px-5 pt-20 pb-28 md:pt-28 md:pb-36 relative">
        {/* Block logo — Mistral style */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-[#FAE100]" />
            <div className="w-6 h-6 bg-[#FFA110]" />
            <div className="w-6 h-6 bg-[#fb6424]" />
            <div className="w-6 h-6 bg-[#fa520f]" />
          </div>
          <span className="uppercase text-xs tracking-widest font-semibold text-[#1f1f1f]">Edição especial · Banco do Brasil</span>
        </div>

        <h1 className="display-mistral max-w-[18ch] text-[#1f1f1f] mb-8">
          Matemática<br/>
          Financeira<br/>
          <span className="text-[#fa520f]">para o BB 2026.</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl text-[#1f1f1f]/75 mb-10 leading-relaxed">
          Edital previsto para o 1º semestre de 2026 · Escriturário nível médio · até <strong className="text-[#1f1f1f]">R$ 8.700/mês</strong> com benefícios. Matemática Financeira é a matéria que mais elimina candidato. Esse curso existe para você <em>não</em> ser um deles.
        </p>

        <div className="flex flex-wrap gap-3">
          <a href="#investir" className="bb-btn bb-btn-primary">Garantir minha vaga</a>
          <a href="#programa" className="bb-btn bb-btn-yellow">Ver programa completo</a>
        </div>

        <div className="mt-14 flex flex-wrap gap-8 text-sm text-[#1f1f1f]/70">
          <div><span className="block text-2xl font-medium text-[#1f1f1f]">40h+</span>aulas gravadas</div>
          <div><span className="block text-2xl font-medium text-[#1f1f1f]">900+</span>questões comentadas</div>
          <div><span className="block text-2xl font-medium text-[#1f1f1f]">100%</span>foco em banca CESGRANRIO</div>
        </div>
      </div>

      {/* Decorative block gradient */}
      <div className="absolute -right-10 -bottom-10 w-72 h-72 bb-gradient-block opacity-80 hidden md:block" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }} />
    </section>
  )
}

function BBStrip() {
  const items = ['JUROS SIMPLES', 'JUROS COMPOSTOS', 'DESCONTO', 'TAXAS EQUIVALENTES', 'AMORTIZAÇÃO', 'SÉRIES UNIFORMES', 'SISTEMA PRICE', 'SAC', 'FLUXO DE CAIXA']
  return (
    <section className="mistral-dark py-5 overflow-hidden" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[1400px] mx-auto px-5 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs tracking-widest text-[#fffaeb]/80">
        {items.map(i => <span key={i}>· {i}</span>)}
      </div>
    </section>
  )
}

function BBConcurso() {
  const facts = [
    ['EDITAL', '1º semestre de 2026', 'Previsão abril a junho · banca em fase final de escolha'],
    ['CARGO', 'Escriturário', 'Agente Comercial · Agente de Tecnologia'],
    ['NÍVEL', 'Médio', 'Sem exigência de superior · concorrência alta'],
    ['REMUNERAÇÃO', 'Até R$ 8.700/mês', 'Salário-base + PLR + auxílio-alimentação + saúde + previdência'],
    ['BANCA PROVÁVEL', 'CESGRANRIO', 'Organizadora tradicional dos certames do BB'],
    ['VAGAS', 'Todo o Brasil', 'Ampla distribuição, incluindo Distrito Federal'],
  ]
  return (
    <section className="mistral-cream py-24 md:py-28" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="md:flex md:items-end md:justify-between gap-10 mb-14">
          <div>
            <p className="uppercase text-xs tracking-widest font-semibold text-[#002A75] mb-4">CONCURSO BB 2026 · CONFIRMADO</p>
            <h2 className="display-mistral-md text-[#1f1f1f] max-w-[18ch]">O certame mais esperado do ano.</h2>
          </div>
          <p className="text-[#1f1f1f]/70 max-w-md mt-6 md:mt-0 text-[15px] leading-relaxed">
            Com edital previsto para o 1º semestre e banca quase definida (Cesgranrio), quem começa agora tem vantagem real sobre quem vai esperar o edital sair.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-[#1f1f1f] border border-[#1f1f1f]">
          {facts.map(([label, value, detail]) => (
            <div key={label} className="p-6 md:p-7 bg-[#fff0c2]">
              <p className="uppercase text-[11px] tracking-widest font-semibold text-[#fa520f] mb-2">{label}</p>
              <p className="text-lg md:text-xl font-medium tracking-tight text-[#1f1f1f] mb-1">{value}</p>
              <p className="text-sm text-[#1f1f1f]/65 leading-snug">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bb-card-filled bb-shadow">
          <p className="uppercase text-[11px] tracking-widest font-semibold text-[#002A75] mb-3">O QUE CAI NA PROVA</p>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-2 text-[15px] text-[#1f1f1f]">
            <div>
              <strong className="block mb-2">Conhecimentos Básicos</strong>
              <ul className="space-y-1 text-[#1f1f1f]/80">
                <li>· Língua Portuguesa</li>
                <li>· Língua Inglesa</li>
                <li>· Matemática</li>
                <li>· Atualidades do Mercado Financeiro</li>
              </ul>
            </div>
            <div>
              <strong className="block mb-2">Conhecimentos Específicos</strong>
              <ul className="space-y-1 text-[#1f1f1f]/80">
                <li>· <u>Matemática Financeira</u> — foco deste curso</li>
                <li>· Conhecimentos Bancários</li>
                <li>· Informática (aprofundado para Agente de Tecnologia)</li>
                <li>· Vendas e Negociação</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#1f1f1f]/50 mt-6 italic">* Acompanhe a publicação oficial do edital em bb.com.br/concurso. Este curso é de autoria do Prof. Carrijo e não tem vínculo oficial com o Banco do Brasil.</p>
      </div>
    </section>
  )
}

function BBPrograma() {
  const modulos = [
    ['01', 'Fundamentos',     'Porcentagem, razão, proporção e notação financeira. A base que quase todo concurseiro ignora — e paga caro depois.'],
    ['02', 'Juros Simples',   'Fórmula, variações da banca CESGRANRIO, pegadinhas de período fracionário e desconto simples.'],
    ['03', 'Juros Compostos', 'Capitalização, taxa equivalente, nominal vs. efetiva. Domínio total de conversão entre taxas.'],
    ['04', 'Descontos',       'Racional e comercial, simples e composto. Comparação direta com questões do último certame.'],
    ['05', 'Séries & Rendas', 'Anuidades, rendas antecipadas e postecipadas. Montagem de fluxo de caixa passo a passo.'],
    ['06', 'Amortização',     'SAC, Price e sistemas mistos. Como a CESGRANRIO cobra cada um — com atalhos de prova.'],
    ['07', 'VPL, TIR & IL',   'Análise de investimentos nos moldes exigidos pelo BB. Interpretação de critérios de decisão.'],
    ['08', 'Reta Final',      '200 questões da CESGRANRIO comentadas em vídeo + simulado cronometrado nos moldes de prova real.'],
  ]
  return (
    <section id="programa" className="mistral-surface py-24 md:py-32" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="mb-16 md:flex md:items-end md:justify-between gap-10">
          <div>
            <p className="uppercase text-xs tracking-widest font-semibold text-[#fa520f] mb-4">PROGRAMA</p>
            <h2 className="display-mistral-md text-[#1f1f1f] max-w-[18ch]">8 módulos. Zero enrolação.</h2>
          </div>
          <p className="text-[#1f1f1f]/70 max-w-md mt-6 md:mt-0">Cada módulo é construído a partir das questões dos últimos certames do BB. Nada que não caia. Tudo que cai.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-[#1f1f1f]">
          {modulos.map(([n, t, d], i) => (
            <div key={n} className={`p-8 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < modulos.length - 2 ? 'border-b' : ''} ${i === modulos.length - 2 ? 'md:border-b-0 border-b' : ''} border-[#1f1f1f]/20`}>
              <div className="flex items-start gap-5">
                <span className="text-[#fa520f] font-medium text-3xl tracking-tight shrink-0">{n}</span>
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-[#1f1f1f] mb-2">{t}</h3>
                  <p className="text-sm text-[#1f1f1f]/70 leading-relaxed">{d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BBMetodo() {
  const steps = [
    ['Diagnóstico', 'Teste inicial que mapeia o que você já sabe e o que precisa revisar. Personaliza a ordem dos módulos para o seu caso.'],
    ['Aula + Aplicação', 'Cada conceito vem com resolução imediata de 5 questões reais da CESGRANRIO. Sem teoria que não vira nota.'],
    ['Banca-foco', 'Módulos de padrão de banca: como a CESGRANRIO formula pegadinhas, ordem preferida de alternativas, armadilhas recorrentes.'],
    ['Simulados cronometrados', 'Prova-réplica nos moldes do BB. Correção comentada em vídeo no dia seguinte.'],
  ]
  return (
    <section id="metodo" className="mistral-cream py-24 md:py-32" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[1200px] mx-auto px-5">
        <p className="uppercase text-xs tracking-widest font-semibold text-[#fa520f] mb-4">MÉTODO</p>
        <h2 className="display-mistral-md text-[#1f1f1f] max-w-[20ch] mb-16">Feito para passar. Não para estudar bonito.</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map(([t, d], i) => (
            <div key={t} className="bb-card bb-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-[#FAE100] border border-[#1f1f1f] flex items-center justify-center text-sm font-medium">{i + 1}</span>
                <h3 className="text-xl font-medium tracking-tight">{t}</h3>
              </div>
              <p className="text-[#1f1f1f]/70 leading-relaxed text-[15px]">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BBProfSpotlight() {
  return (
    <section className="mistral-surface py-24" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[1000px] mx-auto px-5 grid md:grid-cols-[1fr_1.3fr] gap-10 items-center">
        <div className="aspect-square bb-gradient-block border border-[#1f1f1f] flex items-center justify-center text-[#1f1f1f]/50 text-sm bb-shadow">
          [ FOTO PROF. CARRIJO ]
        </div>
        <div>
          <p className="uppercase text-xs tracking-widest font-semibold text-[#fa520f] mb-3">QUEM MINISTRA</p>
          <h2 className="display-mistral-md text-[#1f1f1f] mb-5">Prof. Carrijo</h2>
          <p className="text-[#1f1f1f]/75 text-lg leading-relaxed mb-4">
            Especialista em RLM e Matemática Financeira para concursos públicos. Já ajudou milhares de concurseiros a destravarem exatas — inclusive candidatos aprovados no BB nos últimos certames.
          </p>
          <p className="text-[#1f1f1f]/60 text-sm">
            Conteúdo diário em <a href="https://instagram.com/profcarrijo" target="_blank" rel="noreferrer" className="text-[#fa520f] underline font-medium">@profcarrijo</a>.
          </p>
        </div>
      </div>
    </section>
  )
}

function BBInvestir() {
  return (
    <section id="investir" className="mistral-dark py-28" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="mb-16 text-center">
          <p className="uppercase text-xs tracking-widest font-semibold text-[#FAE100] mb-4">INVESTIR</p>
          <h2 className="display-mistral-md text-[#fffaeb] max-w-[20ch] mx-auto">Duas formas de entrar.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Plano combo */}
          <div className="bg-[#FAE100] text-[#1f1f1f] p-10 border-2 border-[#1f1f1f] relative bb-shadow">
            <span className="absolute -top-3 left-10 bg-[#002A75] text-[#FAE100] text-xs uppercase tracking-widest font-bold px-3 py-1">Combo BB + Vitalício</span>
            <h3 className="text-2xl font-medium tracking-tight mt-4 mb-1">Combo Aprovação BB</h3>
            <p className="text-sm text-[#1f1f1f]/70 mb-6">Curso BB + Escola de RLM vitalícia.</p>
            <div className="mb-6">
              <div className="uppercase text-[11px] tracking-widest">À VISTA NO PIX</div>
              <div className="text-5xl font-medium tracking-tight mt-2">R$ 797</div>
              <div className="text-sm">ou 12× de R$ 82</div>
            </div>
            <ul className="space-y-2 text-[14px] mb-8">
              <li>· Curso completo BB (8 módulos)</li>
              <li>· Todas as trilhas de RLM vitalícias</li>
              <li>· Simulados cronometrados</li>
              <li>· Comunidade fechada</li>
              <li>· 7 dias de garantia</li>
            </ul>
            <a href="#" className="bb-btn bb-btn-dark w-full">Quero o combo</a>
          </div>

          {/* Plano BB only */}
          <div className="bg-[#fffaeb]/[0.04] border-2 border-[#fffaeb]/20 text-[#fffaeb] p-10 relative">
            <h3 className="text-2xl font-medium tracking-tight mb-1">Apenas Curso BB</h3>
            <p className="text-sm text-[#fffaeb]/60 mb-6">Foco absoluto no edital do Banco do Brasil.</p>
            <div className="mb-6">
              <div className="uppercase text-[11px] tracking-widest text-[#FAE100]">À VISTA NO PIX</div>
              <div className="text-5xl font-medium tracking-tight mt-2">R$ 497</div>
              <div className="text-sm text-[#fffaeb]/70">ou 12× de R$ 51</div>
            </div>
            <ul className="space-y-2 text-[14px] text-[#fffaeb]/85 mb-8">
              <li>· Curso completo BB (8 módulos)</li>
              <li>· 900+ questões comentadas</li>
              <li>· Simulados cronometrados</li>
              <li>· Acesso por 12 meses</li>
              <li>· 7 dias de garantia</li>
            </ul>
            <a href="#" className="bb-btn bb-btn-yellow w-full">Quero só o BB</a>
          </div>
        </div>

        <p className="text-center text-xs text-[#fffaeb]/40 mt-10">* Troque os links pelos checkouts reais (Hotmart / Kiwify / Stripe).</p>
      </div>
    </section>
  )
}

function BBFAQ() {
  const qa = [
    ['Por que um curso específico para o BB?', 'Porque a banca CESGRANRIO tem padrões próprios — tipo de pegadinha, ordem de alternativas, forma de cobrar juros compostos. Um curso genérico ignora isso. Esse aqui é 100% cirúrgico.'],
    ['E se eu não for aprovado?', 'A garantia é de 7 dias incondicional. Se você concluir o curso, aplicar o método e ainda assim não evoluir, mandamos seu dinheiro de volta — sem burocracia.'],
    ['Preciso saber matemática antes?', 'Não. O módulo 01 reconstrói a base (porcentagem, razão, proporção). Você sai dele preparado para qualquer tema de matemática financeira.'],
    ['Quanto tempo até o próximo BB?', 'O edital sai historicamente a cada 2 a 3 anos. O curso foi pensado para quem tem 90 a 180 dias de preparação — mas funciona para quem tem mais (aprofunda) e menos (reta final).'],
    ['Serve para outras bancas?', 'Sim. Apesar do foco BB/CESGRANRIO, todo o conteúdo serve para FGV, FCC, VUNESP e CEBRASPE. O que muda é o estilo de pegadinha — coberto em módulo específico.'],
  ]
  return (
    <section className="mistral-surface py-24" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[820px] mx-auto px-5">
        <p className="uppercase text-xs tracking-widest font-semibold text-[#fa520f] mb-4">FAQ</p>
        <h2 className="display-mistral-md text-[#1f1f1f] mb-12">Dúvidas frequentes.</h2>
        <div className="border-t border-[#1f1f1f]/15">
          {qa.map(([q, a], i) => (
            <details key={i} className="group border-b border-[#1f1f1f]/15">
              <summary className="flex justify-between items-center py-6 text-[#1f1f1f] text-lg font-medium">
                <span>{q}</span>
                <span className="text-[#fa520f] text-2xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-[#1f1f1f]/70 pb-6 leading-relaxed text-[15px]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function BBCTAFinal() {
  return (
    <section className="py-28 bb-gradient-block" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[900px] mx-auto px-5 text-center text-[#1f1f1f]">
        <h2 className="display-mistral max-w-[16ch] mx-auto mb-10">Sua vaga no BB passa pela matemática financeira.</h2>
        <a href="#investir" className="bb-btn bb-btn-dark">Garantir minha vaga agora</a>
        <p className="text-sm text-[#1f1f1f]/70 mt-6">7 dias de garantia · Acesso imediato · Pagamento seguro</p>
      </div>
    </section>
  )
}

function BBFooter() {
  return (
    <footer className="mistral-dark py-12" style={{ fontFamily: 'Arial, ui-sans-serif, system-ui, sans-serif' }}>
      <div className="max-w-[1200px] mx-auto px-5 text-sm text-[#fffaeb]/60 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex gap-1 mb-3">
            <div className="w-4 h-4 bg-[#FAE100]" />
            <div className="w-4 h-4 bg-[#FFA110]" />
            <div className="w-4 h-4 bg-[#fb6424]" />
            <div className="w-4 h-4 bg-[#fa520f]" />
          </div>
          <p className="text-[#fffaeb] font-medium">Curso BB — Prof. Carrijo</p>
          <p className="mt-2">Matemática Financeira cirúrgica.</p>
        </div>
        <div>
          <div className="uppercase text-xs tracking-widest text-[#fffaeb]/40 mb-3">Contato</div>
          <a href="https://instagram.com/profcarrijo" target="_blank" rel="noreferrer" className="block hover:text-[#FAE100]">@profcarrijo</a>
        </div>
        <div>
          <div className="uppercase text-xs tracking-widest text-[#fffaeb]/40 mb-3">Legal</div>
          <p className="text-xs">© 2026 Prof. Carrijo. Todos os direitos reservados.</p>
          <p className="text-xs mt-2 text-[#fffaeb]/40">Curso não afiliado ao Banco do Brasil. A marca BB é citada apenas para referência do concurso.</p>
          <a href="#/" className="inline-block mt-4 text-[#FAE100] hover:underline">← Voltar ao site principal</a>
        </div>
      </div>
    </footer>
  )
}

function BBPage() {
  return (
    <>
      <BBNav />
      <BBHero />
      <BBStrip />
      <BBConcurso />
      <BBPrograma />
      <BBMetodo />
      <BBProfSpotlight />
      <BBInvestir />
      <BBFAQ />
      <BBCTAFinal />
      <BBFooter />
    </>
  )
}

export default function App() {
  const route = useRoute()
  const [modalOpen, setModalOpen] = useState(true)
  const [bannerClosed, setBannerClosed] = useState(false)

  const onHome = !route.startsWith('#/bb')
  const showModal = onHome && modalOpen
  const showBanner = onHome && !modalOpen && !bannerClosed

  return (
    <>
      {route.startsWith('#/bb') ? (
        <BBPage />
      ) : (
        <Home showBanner={showBanner} onBannerClose={() => setBannerClosed(true)} />
      )}
      {showModal && <BBModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
