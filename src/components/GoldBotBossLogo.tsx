/**
 * GoldBotBoss — Logo / Mascot SVG
 * Un personaggio mascotte: re dell'oro con volto da bot
 * Usato in tutto il sito al posto del semplice "BB"
 */

interface Props {
  size?: number
  className?: string
  /** mostra solo l'icona senza ombra esterna */
  bare?: boolean
}

export default function GoldBotBossLogo({ size = 40, className = '', bare = false }: Props) {
  const id = `gbb-grad-${size}` // ID unico per evitare conflitti

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={bare ? {} : { filter: 'drop-shadow(0 0 8px rgba(240,180,41,0.5))' }}
    >
      <defs>
        {/* Gradiente corpo */}
        <radialGradient id={`${id}-body`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="40%" stopColor="#F0B429" />
          <stop offset="100%" stopColor="#A87000" />
        </radialGradient>

        {/* Gradiente corona */}
        <linearGradient id={`${id}-crown`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE980" />
          <stop offset="100%" stopColor="#C8931A" />
        </linearGradient>

        {/* Gradiente visor occhi */}
        <linearGradient id={`${id}-visor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A2A4A" />
          <stop offset="100%" stopColor="#0D1A30" />
        </linearGradient>

        {/* Glow esterno */}
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── CORONA ───────────────────────────────────── */}
      {/* Base corona */}
      <rect x="18" y="18" width="44" height="14" rx="3"
        fill={`url(#${id}-crown)`} />
      {/* Punte corona */}
      <polygon points="22,18 26,6 30,18"   fill={`url(#${id}-crown)`} />
      <polygon points="36,18 40,4 44,18"   fill="#FFE980" />
      <polygon points="50,18 54,6 58,18"   fill={`url(#${id}-crown)`} />
      {/* Gemme corona */}
      <circle cx="40" cy="9"  r="3.5" fill="#FF4466" />
      <circle cx="26" cy="13" r="2"   fill="#00DDAA" />
      <circle cx="54" cy="13" r="2"   fill="#00DDAA" />
      {/* Brillantini gemma centrale */}
      <circle cx="40" cy="9" r="1.5" fill="rgba(255,255,255,0.6)" />

      {/* ── TESTA (cerchio principale) ────────────────── */}
      <circle cx="40" cy="48" r="28" fill={`url(#${id}-body)`} />
      {/* Bordo scuro */}
      <circle cx="40" cy="48" r="28" stroke="#8A5C00" strokeWidth="1.5" fill="none" />
      {/* Riflesso luce (highlight) */}
      <ellipse cx="30" cy="33" rx="8" ry="5" fill="rgba(255,255,255,0.25)" transform="rotate(-20,30,33)" />

      {/* ── VISOR / BANDA OCCHI ───────────────────────── */}
      <rect x="15" y="41" width="50" height="18" rx="9"
        fill={`url(#${id}-visor)`} />
      <rect x="15" y="41" width="50" height="18" rx="9"
        stroke="#0A1525" strokeWidth="1" fill="none" />

      {/* Occhi (LED verdi che brillano) */}
      <circle cx="28" cy="50" r="6" fill="#00FF88" />
      <circle cx="52" cy="50" r="6" fill="#00FF88" />
      {/* Pupille */}
      <circle cx="29" cy="51" r="3" fill="#003322" />
      <circle cx="53" cy="51" r="3" fill="#003322" />
      {/* Riflesso occhi */}
      <circle cx="27" cy="48" r="1.5" fill="rgba(255,255,255,0.8)" />
      <circle cx="51" cy="48" r="1.5" fill="rgba(255,255,255,0.8)" />
      {/* Glow occhi */}
      <circle cx="28" cy="50" r="8" fill="rgba(0,255,136,0.12)" />
      <circle cx="52" cy="50" r="8" fill="rgba(0,255,136,0.12)" />

      {/* ── BOCCA / SORRISO ───────────────────────────── */}
      <path d="M 28 66 Q 40 74 52 66"
        stroke="#8A5C00" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* ── GUANCE (blush dorato) ────────────────────── */}
      <circle cx="17" cy="58" r="5" fill="rgba(255,140,0,0.2)" />
      <circle cx="63" cy="58" r="5" fill="rgba(255,140,0,0.2)" />

      {/* ── DETTAGLI MONETA ───────────────────────────── */}
      {/* Bordo esterno ornamentale */}
      <circle cx="40" cy="48" r="27" stroke="rgba(255,220,60,0.3)" strokeWidth="1" strokeDasharray="4 3" fill="none" />
    </svg>
  )
}
