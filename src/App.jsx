import { useEffect, useState } from 'react'
import './App.css'

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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[#e5edf5]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
        <a href="#top" className="text-[#061b31] font-medium tracking-tight text-[15px] sm:text-base flex items-center gap-2 shrink-0">
          <LogoPC />
          <span className="hidden xs:inline sm:inline">Prof. Carrijo</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#273951]">
          <a href="#metodologia" className="hover:text-[#533afd]">Metodologia</a>
          <a href="#trilhas"    className="hover:text-[#533afd]">Trilhas</a>
          <a href="#planos"     className="hover:text-[#533afd]">Planos</a>
          <a href="#faq"        className="hover:text-[#533afd]">FAQ</a>
          <a href="#/bb"        className="text-[#002A75] font-semibold flex items-center gap-1.5"><LogoBB className="!w-5 !h-5 !text-[9px]" />Curso BB</a>
        </nav>
        <a href="#planos" className="btn btn-primary text-xs sm:text-sm whitespace-nowrap">Começar agora →</a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="gradient-hero pt-20 pb-24 md:pt-28 md:pb-32 relative overflow-hidden">
      <div className="max-w-[1080px] mx-auto px-5 text-center relative">
        <span className="pill pill-purple mb-8">
          <span className="caption-code">RLM · Concursos Públicos</span>
        </span>
        <h1 className="display-hero max-w-4xl mx-auto mb-6">
          Milhares vão <span className="text-[#533afd]">perder vagas</span> nos melhores concursos por causa da prova de exatas.
        </h1>
        <p className="body-large max-w-2xl mx-auto mb-10">
          Você não precisa estar entre eles. O método do Professor Carrijo já está destravando RLM para milhares de concurseiros — mesmo quem sempre odiou matemática.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="#planos" className="btn btn-primary btn-lg">Quero dominar RLM agora</a>
          <a href="#metodologia" className="btn btn-ghost btn-lg">Ver metodologia</a>
        </div>
        <p className="text-xs text-[#64748d] mt-6">7 dias de garantia incondicional · Acesso imediato</p>
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
    <section className="py-24 bg-[#f6f9fc]">
      <div className="max-w-[1080px] mx-auto px-5">
        <div className="text-center mb-12">
          <p className="caption-code text-[#533afd] mb-3">PROVA SOCIAL</p>
          <h2 className="display-large mb-4">O resultado que só esse método entrega.</h2>
          <p className="body-large max-w-2xl mx-auto">Nossos alunos conquistando as primeiras colocações nos concursos mais disputados do Brasil.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {aprovados.map(([nome, cargo]) => (
            <div key={nome} className="bg-white border border-[#e5edf5] rounded-[6px] px-5 py-4 flex items-center gap-3">
              <span className="pill pill-success text-[10px]">APROVADO</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#061b31] truncate">{nome}</div>
                <div className="text-xs text-[#64748d] truncate">{cargo}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#64748d] mt-6 italic">* Lista parcial — substituir por aprovados reais do Prof. Carrijo.</p>
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
  return (
    <section className="py-24">
      <div className="max-w-[820px] mx-auto px-5">
        <div className="text-center mb-12">
          <p className="caption-code text-[#ea2261] mb-3">VOCÊ SE IDENTIFICA?</p>
          <h2 className="heading-section mb-4">Marque quantas dessas frases você já disse.</h2>
          <p className="body-large">Se for 3 ou mais, o problema <u>não é você</u>. É o método.</p>
        </div>
        <ul className="grid sm:grid-cols-2 gap-3">
          {frases.map((f, i) => (
            <li key={i} className="flex items-start gap-3 bg-white border border-[#e5edf5] rounded-[6px] p-4">
              <span className="w-5 h-5 rounded border border-[#b9b9f9] shrink-0 mt-0.5" />
              <span className="text-[#273951] text-sm">{f}</span>
            </li>
          ))}
        </ul>
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
    <section className="py-24 bg-[#f6f9fc]">
      <div className="max-w-[1080px] mx-auto px-5">
        <div className="text-center mb-14">
          <p className="caption-code text-[#533afd] mb-3">PRA QUEM É</p>
          <h2 className="display-large">Esse curso é para você que…</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map(([ic, t, d]) => (
            <div key={t} className="card">
              <div className="text-2xl mb-3">{ic}</div>
              <h3 className="heading-sub mb-2 text-lg">{t}</h3>
              <p className="text-[#64748d] text-sm leading-relaxed">{d}</p>
            </div>
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
        <div className="aspect-square rounded-[8px] bg-[#f6f9fc] border border-[#e5edf5] flex items-center justify-center text-[#64748d] text-sm card-elevated">
          [ FOTO PROF. CARRIJO ]
        </div>
        <div>
          <p className="caption-code text-[#533afd] mb-3">QUEM ESTÁ POR TRÁS</p>
          <h2 className="display-large mb-5">Muito prazer, sou o <span className="text-[#533afd]">Professor Carrijo</span>.</h2>
          <p className="body-large mb-4">...mas a maioria dos meus alunos me conhece como "o professor que destrava RLM".</p>
          <p className="text-[#64748d] mb-4">Ajudei milhares de concurseiros a sair do zero em Raciocínio Lógico-Matemático e chegar nos primeiros lugares dos concursos mais disputados do país.</p>
          <p className="text-[#64748d]">O método que você vai conhecer aqui <strong className="text-[#061b31] font-medium">não depende de dom pra exatas</strong>. Depende de seguir passo a passo um processo já validado.</p>
        </div>
      </div>
    </section>
  )
}

function Metodologia() {
  const fases = [
    ['01', 'Reconstruindo a base',  'Corrigimos a lógica matemática desde a raiz. Sem pular etapas. Mesmo que você tenha esquecido tudo da escola.'],
    ['02', 'Efeito Dominó',          'Aplicamos a base em milhares de questões reais. Você passa a reconhecer padrões antes de ler a questão inteira.'],
    ['03', 'Reta Final',             'Planejamento específico pré e pós-edital. Você vai pra prova sabendo exatamente o que cai e como resolver em segundos.'],
  ]
  return (
    <section id="metodologia" className="py-24 gradient-dark text-white">
      <div className="max-w-[1080px] mx-auto px-5">
        <div className="text-center mb-14">
          <p className="caption-code text-[#f96bee] mb-3">METODOLOGIA</p>
          <h2 className="display-large text-white mb-4">Como milhares estão dominando RLM em 3 fases</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {fases.map(([n, t, d]) => (
            <div key={n} className="rounded-[8px] p-7 bg-white/[0.04] border border-white/10 backdrop-blur">
              <div className="text-[#f96bee] text-5xl font-light mb-3">{n}</div>
              <h3 className="text-white text-xl font-light mb-3 tracking-tight">{t}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="#planos" className="btn btn-on-dark btn-lg">Quero dominar RLM agora</a>
        </div>
      </div>
    </section>
  )
}

function CustoDeErrar() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[820px] mx-auto px-5 text-center">
        <p className="caption-code text-[#ea2261] mb-3">⚠ CUSTO DE OPORTUNIDADE</p>
        <h2 className="display-large mb-6">Quanto custa errar as questões de RLM numa prova?</h2>
        <p className="body-large mb-3">Um cargo de fiscal estadual paga, em média, <span className="text-[#061b31] font-medium">R$ 30.000/mês</span>.</p>
        <p className="body-large mb-8">Em 4 anos, isso é:</p>
        <div className="inline-block gradient-cta rounded-[8px] px-10 py-8 card-elevated">
          <div className="text-white text-6xl md:text-7xl font-light tracking-tight">R$ 1.440.000</div>
        </div>
        <p className="body-large mt-8 max-w-xl mx-auto">Cada questão de RLM que você erra — e seu concorrente acerta — pode ser <u>a diferença entre esse futuro e continuar onde está</u>.</p>
      </div>
    </section>
  )
}

function Trilhas() {
  const list = [
    ['📐', 'RLM do Zero', 'Fundamentos completos'],
    ['🔢', 'Lógica Proposicional', 'Tabelas-verdade e equivalências'],
    ['🧩', 'Análise Combinatória', 'Permutações e arranjos'],
    ['📊', 'Matemática Financeira', 'Juros, descontos e taxas'],
    ['🎲', 'Probabilidade', 'Do básico ao avançado'],
    ['📈', 'Estatística Descritiva', 'Medidas e distribuições'],
    ['🏛️', 'Questões FGV', 'Padrões da banca'],
    ['⚖️', 'Questões CEBRASPE', 'Certo/errado sem pegadinhas'],
    ['🎯', 'Reta Final', 'Revisão 30 dias pré-prova'],
  ]
  return (
    <section id="trilhas" className="py-24 bg-[#f6f9fc]">
      <div className="max-w-[1080px] mx-auto px-5">
        <div className="text-center mb-14">
          <p className="caption-code text-[#533afd] mb-3">O QUE ESTÁ INCLUSO</p>
          <h2 className="display-large">Acesso imediato a todas estas trilhas</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {list.map(([ic, t, d]) => (
            <div key={t} className="card flex gap-4 items-start">
              <span className="text-2xl shrink-0">{ic}</span>
              <div>
                <h3 className="font-medium text-[#061b31] mb-1">{t}</h3>
                <p className="text-[#64748d] text-sm">{d}</p>
              </div>
            </div>
          ))}
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
          <p className="caption-code text-[#ea2261] mb-3">BÔNUS EXCLUSIVOS</p>
          <h2 className="display-large">E entrando hoje você ainda leva:</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {bonus.map(([n, t, d]) => (
            <div key={n} className="card card-elevated relative">
              <span className="absolute -top-3 left-6 pill gradient-accent text-white border-0">BÔNUS {n}</span>
              <h3 className="mt-4 heading-sub text-lg font-medium">{t}</h3>
              <p className="text-[#64748d] text-sm mt-2">{d}</p>
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
    <section className="py-24 bg-[#f6f9fc]">
      <div className="max-w-[820px] mx-auto px-5">
        <div className="text-center mb-12">
          <p className="caption-code text-[#533afd] mb-3">NA PRÁTICA</p>
          <h2 className="display-large">Como funciona</h2>
        </div>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4 items-start card">
              <div className="w-9 h-9 rounded-[6px] gradient-cta text-white flex items-center justify-center font-medium shrink-0">{i + 1}</div>
              <p className="pt-1.5 text-[#273951]">{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Depoimentos() {
  const deps = [
    ['Antes eu chutava todas as questões de RLM. Depois do método, tirei 100% em lógica no último concurso. Fui aprovada.', 'Depoimento 01'],
    ['Estudava há 3 anos sem passar. Em 4 meses com o Prof. Carrijo, passei em 1º lugar.', 'Depoimento 02'],
    ['Eu era de humanas. Nunca imaginei entender RLM. Hoje sou fiscal — e RLM foi minha maior nota.', 'Depoimento 03'],
  ]
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1080px] mx-auto px-5">
        <div className="text-center mb-14">
          <p className="caption-code text-[#533afd] mb-3">DEPOIMENTOS</p>
          <h2 className="display-large">Imagine chegar na prova sem medo de RLM</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {deps.map(([t, n], i) => (
            <figure key={i} className="card">
              <blockquote className="text-[#273951] text-[15px] leading-relaxed italic mb-5">"{t}"</blockquote>
              <figcaption className="text-sm font-medium text-[#061b31]">— {n}</figcaption>
            </figure>
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
    <section className="py-24 bg-[#f6f9fc]">
      <div className="max-w-[720px] mx-auto px-5">
        <div className="text-center mb-10">
          <p className="caption-code text-[#533afd] mb-3">VALOR TOTAL</p>
          <h2 className="display-large">Tudo o que você ganha ao se matricular</h2>
        </div>
        <div className="card card-elevated">
          <ul className="divide-y divide-[#e5edf5]">
            {itens.map(([n, v]) => (
              <li key={n} className="flex justify-between items-center py-3 text-sm">
                <span className="text-[#273951]">✓ {n}</span>
                <span className="font-medium text-[#061b31] font-mono">R$ {v}</span>
              </li>
            ))}
            <li className="flex justify-between items-center pt-5 mt-2 text-base">
              <span className="text-[#061b31] font-medium">Total somado</span>
              <span className="font-medium text-[#533afd] text-2xl font-mono tracking-tight">R$ {total.toLocaleString('pt-BR')}</span>
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
          <p className="caption-code text-[#f96bee] mb-3">CONDIÇÃO EXCLUSIVA</p>
          <h2 className="display-large text-white mb-3">Escolha seu plano e comece hoje</h2>
          <p className="body-large text-white/70">Essa condição vale apenas enquanto o contador ao final estiver ativo.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* VITALÍCIO */}
          <div className="relative rounded-[8px] bg-white text-[#061b31] p-8 card-elevated">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 pill gradient-cta text-white border-0 font-medium">MELHOR OPÇÃO</span>
            <h3 className="heading-sub mt-3 font-medium">Acesso Vitalício</h3>
            <p className="text-[#64748d] text-sm mb-6">Pague uma vez, estude pra sempre.</p>
            <div className="mb-6">
              <div className="text-xs text-[#64748d] caption-code">À VISTA NO PIX</div>
              <div className="text-5xl font-light tracking-tight mt-1">R$ 497</div>
              <div className="text-sm text-[#64748d]">ou 12× de R$ 51</div>
            </div>
            <ul className="space-y-2 text-sm mb-8 text-[#273951]">
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
          <p className="caption-code text-[#533afd] mb-3">COMPARATIVO</p>
          <h2 className="display-large">Método Prof. Carrijo vs. cursos tradicionais</h2>
        </div>
        {/* Desktop: 3-col grid table */}
        <div className="hidden md:block card overflow-hidden p-0">
          <div className="grid grid-cols-3 text-sm">
            <div className="p-4 border-b border-[#e5edf5] font-medium text-[#64748d] caption-code">CRITÉRIO</div>
            <div className="p-4 border-b border-[#e5edf5] font-medium text-[#533afd] caption-code">PROF. CARRIJO</div>
            <div className="p-4 border-b border-[#e5edf5] font-medium text-[#64748d] caption-code">TRADICIONAIS</div>
            {rows.map(([k, a, b], i) => (
              <div key={k} className="contents">
                <div className={`p-4 text-[#273951] font-medium ${i < rows.length - 1 ? 'border-b border-[#e5edf5]' : ''}`}>{k}</div>
                <div className={`p-4 text-[#061b31] ${i < rows.length - 1 ? 'border-b border-[#e5edf5]' : ''}`}>✓ {a}</div>
                <div className={`p-4 text-[#64748d] ${i < rows.length - 1 ? 'border-b border-[#e5edf5]' : ''}`}>✗ {b}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile: stacked cards per criterion */}
        <div className="md:hidden space-y-3">
          {rows.map(([k, a, b]) => (
            <div key={k} className="card p-5">
              <p className="caption-code text-[#64748d] mb-3">{k}</p>
              <div className="mb-2 flex gap-2"><span className="text-[#533afd]">✓</span><span className="text-[#061b31] text-sm">{a}</span></div>
              <div className="flex gap-2"><span className="text-[#64748d]">✗</span><span className="text-[#64748d] text-sm">{b}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Garantia() {
  return (
    <section className="py-24 bg-[#f6f9fc]">
      <div className="max-w-[720px] mx-auto px-5 text-center">
        <div className="inline-flex items-center gap-2 pill pill-success mb-6">🛡 GARANTIA INCONDICIONAL</div>
        <h2 className="display-large mb-5">7 dias para testar sem risco</h2>
        <p className="body-large mb-10">Entre, assista as aulas, faça os exercícios. Se não for pra você, é só mandar um e-mail em até 7 dias e devolvemos 100% do valor. Sem perguntas, sem burocracia.</p>
        <a href="#planos" className="btn btn-primary btn-lg">Quero dominar RLM agora</a>
      </div>
    </section>
  )
}

function SobreProfessor() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[820px] mx-auto px-5">
        <div className="text-center mb-10">
          <p className="caption-code text-[#533afd] mb-3">CONHEÇA O PROFESSOR</p>
          <h2 className="display-large">Professor Carrijo</h2>
        </div>
        <div className="card">
          <ul className="space-y-3 text-[#273951]">
            <li>• Especialista em Raciocínio Lógico-Matemático para concursos públicos</li>
            <li>• Milhares de alunos aprovados em concursos federais, estaduais e municipais</li>
            <li>• Criador do método que destrava exatas para concurseiros de humanas</li>
            <li>• Conteúdo diário no Instagram <a href="https://instagram.com/profcarrijo" className="text-[#533afd] font-medium" target="_blank" rel="noreferrer">@profcarrijo</a></li>
          </ul>
          <p className="text-xs text-[#64748d] italic mt-5">* Substituir por bio, formação e histórico reais do Prof. Carrijo.</p>
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
        <p className="caption-code text-[#f96bee] mb-3">⏱ ATENÇÃO</p>
        <h2 className="display-large text-white mb-8">Essa condição especial acaba em:</h2>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10">
          {[[h, 'horas'], [m, 'min'], [s, 'seg']].map(([v, l]) => (
            <div key={l} className="rounded-[8px] bg-white/[0.06] border border-white/10 p-5">
              <div className="text-5xl font-light tracking-tight font-mono">{v}</div>
              <div className="caption-code text-white/60 mt-2">{l}</div>
            </div>
          ))}
        </div>
        <a href="#planos" className="btn btn-on-dark btn-lg">Quero garantir minha vaga</a>
      </div>
    </section>
  )
}

function FAQ() {
  const qa = [
    ['Como funciona o acesso?', 'Após a confirmação do pagamento, você recebe um e-mail com login e senha. Acesso liberado em minutos.'],
    ['Por quanto tempo terei acesso?', 'Depende do plano: Vitalício (para sempre) ou 1 Ano (12 meses).'],
    ['As aulas são ao vivo ou gravadas?', 'Núcleo gravado (assista no seu ritmo). Aulas ao vivo mensais de resolução e plantão.'],
    ['Funciona no celular?', 'Sim. Plataforma 100% responsiva — celular, tablet, notebook e desktop.'],
    ['Preciso de conhecimento prévio?', 'Não. O método começa do zero absoluto.'],
    ['Como tiro minhas dúvidas?', 'Comunidade fechada + aulas ao vivo mensais comigo.'],
    ['Posso baixar as aulas?', 'PDFs e mapas mentais sim. Vídeos apenas online.'],
    ['Quais formas de pagamento?', 'PIX (à vista com desconto) ou cartão em até 12×. Ambiente 100% seguro.'],
    ['Serve para qualquer concurso?', 'Fiscais, policiais, tribunais, legislativos, bancários — principais bancas (FGV, CEBRASPE, FCC, VUNESP).'],
    ['E se não for pra mim?', '7 dias de garantia incondicional. Um e-mail e devolvemos 100%.'],
  ]
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-[720px] mx-auto px-5">
        <div className="text-center mb-12">
          <p className="caption-code text-[#533afd] mb-3">FAQ</p>
          <h2 className="display-large">Perguntas frequentes</h2>
        </div>
        <div className="space-y-2">
          {qa.map(([q, a], i) => (
            <details key={i} className="group card py-5 px-5">
              <summary className="flex justify-between items-center text-[#061b31] font-medium">
                <span>{q}</span>
                <span className="w-6 h-6 rounded-[4px] border border-[#d6d9fc] text-[#533afd] flex items-center justify-center transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-[#64748d] mt-3 text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTAFinal() {
  return (
    <section className="py-28 gradient-cta text-white">
      <div className="max-w-[820px] mx-auto px-5 text-center">
        <h2 className="display-hero text-white mb-8">Chegou a hora de transformar RLM no seu diferencial.</h2>
        <a href="#planos" className="btn btn-on-dark btn-lg">Sim, quero dominar RLM agora</a>
        <p className="text-sm text-white/80 mt-6">7 dias de garantia · Acesso imediato · Pagamento seguro</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#0d253d] text-white/60 py-12">
      <div className="max-w-[1080px] mx-auto px-5 text-sm grid md:grid-cols-3 gap-8">
        <div>
          <div className="text-white font-medium mb-2 flex items-center gap-2">
            <span className="inline-block w-6 h-6 rounded-[4px] gradient-cta" />
            Prof. Carrijo
          </div>
          <p>RLM para concursos públicos.</p>
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
      {showBanner && <BBBanner onClose={onBannerClose} />}
      <Nav />
      <Hero />
      <SocialProof />
      <Dor />
      <ParaQuem />
      <Professor />
      <Metodologia />
      <CustoDeErrar />
      <Trilhas />
      <Bonus />
      <ComoFunciona />
      <Depoimentos />
      <TabelaValor />
      <Planos />
      <Comparativo />
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
          <a href="#/"        className="text-[#64748d] hover:text-[#fa520f]">← Voltar</a>
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
