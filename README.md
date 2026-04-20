# Prof. Carrijo — Landing Page

Site institucional de vendas do Prof. Carrijo (RLM para concursos) com página dedicada ao curso de Matemática Financeira para o Concurso BB 2026.

- **Stack:** Vite + React 19 + Tailwind CSS v4
- **Home:** tema Stripe (roxo `#533afd` / navy `#061b31`)
- **Curso BB:** tema Mistral (amber/orange) + paleta oficial BB (amarelo `#FAE100` / navy `#002A75`)
- **Roteamento:** hash-based (sem dependências extras)

## Dev local

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173/`.

## Build

```bash
npm run build      # gera dist/
npm run preview    # serve o build
```

## Rotas

- `/` — Home (landing geral)
- `/#/bb` — Página dedicada Curso BB 2026

## Deploy

Deploy automático na Vercel via push no `main`.
