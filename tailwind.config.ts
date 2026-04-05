import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#04040A',
        surface: '#080812',
        'surface-2': '#0D0D1A',
        'surface-3': '#131325',
        border: '#1A1A2E',
        'border-light': '#252540',
        'primary-text': '#F0F0F5',
        'secondary-text': '#6B6B8A',
        'muted-text': '#3D3D5C',
        // Gold palette
        gold: '#F0B429',
        'gold-light': '#FFD166',
        'gold-dark': '#C8931A',
        'gold-muted': '#F0B42920',
        // Accent
        'accent-blue': '#00C2FF',
        'accent-purple': '#9B5DE5',
        'accent-indigo': '#6366F1',
        // Status
        'profit-green': '#00E676',
        'profit-green-muted': '#00E67615',
        'loss-red': '#FF3D71',
        'loss-red-muted': '#FF3D7115',
        'warning-yellow': '#FFD166',
        'warning-muted': '#FFD16615',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #F0B429 0%, #FFD166 50%, #C8931A 100%)',
        'gradient-gold-h': 'linear-gradient(90deg, #F0B429, #FFD166)',
        'gradient-dark': 'linear-gradient(135deg, #0D0D1A 0%, #080812 100%)',
        'gradient-surface': 'linear-gradient(135deg, #131325 0%, #0D0D1A 100%)',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(240,180,41,0.15), transparent)',
        'card-glow': 'radial-gradient(circle at 50% 0%, rgba(240,180,41,0.08), transparent 70%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(240, 180, 41, 0.3)',
        'gold-sm': '0 0 10px rgba(240, 180, 41, 0.2)',
        'gold-lg': '0 0 40px rgba(240, 180, 41, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-lg': '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'green': '0 0 20px rgba(0, 230, 118, 0.25)',
        'red': '0 0 20px rgba(255, 61, 113, 0.25)',
        'blue': '0 0 20px rgba(0, 194, 255, 0.25)',
      },
      animation: {
        // Entrances
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        // Continuous
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2.5s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ticker': 'ticker 30s linear infinite',
        // Shimmer
        'shimmer': 'shimmer 2.5s infinite',
        'trade-flash': 'tradeFlash 0.8s ease-out',
        // Grid lines
        'grid-lines': 'gridLines 8s linear infinite',
        // Counter
        'count-up': 'countUp 1s ease-out',
        // Gradient border
        'gradient-border': 'gradientBorder 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(240,180,41,0.2)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 25px rgba(240,180,41,0.5)' },
        },
        pulseGold: {
          '0%, 100%': { textShadow: '0 0 8px rgba(240,180,41,0.3)' },
          '50%': { textShadow: '0 0 20px rgba(240,180,41,0.7)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        tradeFlash: {
          '0%': { backgroundColor: 'rgba(0, 230, 118, 0.2)' },
          '100%': { backgroundColor: 'transparent' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        gradientBorder: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gridLines: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(80px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '80px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')(function ({ addUtilities, addComponents }: any) {
      addUtilities({
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#1A1A2E #04040A',
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          width: '4px',
          height: '4px',
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          background: '#04040A',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          background: '#1A1A2E',
          borderRadius: '2px',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
          background: '#252540',
        },
        '.scrollbar-none': {
          scrollbarWidth: 'none',
        },
        '.scrollbar-none::-webkit-scrollbar': {
          display: 'none',
        },
        '.text-gradient-gold': {
          background: 'linear-gradient(135deg, #F0B429 0%, #FFD166 50%, #C8931A 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-white': {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #C0C0D0 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-green': {
          background: 'linear-gradient(135deg, #00E676 0%, #69F0AE 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.border-gradient-gold': {
          border: '1px solid transparent',
          backgroundClip: 'padding-box',
          backgroundImage: 'linear-gradient(#080812, #080812), linear-gradient(135deg, #F0B429, #FFD166)',
          backgroundOrigin: 'border-box',
        },
        '.clip-text': {
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      })
      addComponents({
        '.glass': {
          background: 'rgba(13, 13, 26, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        },
        '.glass-sm': {
          background: 'rgba(8, 8, 18, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        },
        '.glass-gold': {
          background: 'rgba(240, 180, 41, 0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(240, 180, 41, 0.2)',
          boxShadow: '0 0 30px rgba(240, 180, 41, 0.08), inset 0 1px 0 rgba(240,180,41,0.1)',
        },
        '.card-premium': {
          background: 'linear-gradient(135deg, rgba(19,19,37,0.8) 0%, rgba(13,13,26,0.8) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '1rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(240, 180, 41, 0.2)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(240,180,41,0.06)',
            transform: 'translateY(-2px)',
          },
        },
        '.btn-gold': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.625rem',
          background: 'linear-gradient(135deg, #F0B429 0%, #FFD166 100%)',
          padding: '0.625rem 1.5rem',
          fontWeight: '600',
          color: '#08080F',
          fontSize: '0.9375rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 20px rgba(240, 180, 41, 0.3)',
          '&:hover': {
            boxShadow: '0 0 30px rgba(240, 180, 41, 0.5)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.btn-outline': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.625rem',
          border: '1px solid rgba(240, 180, 41, 0.3)',
          background: 'transparent',
          padding: '0.625rem 1.5rem',
          fontWeight: '600',
          color: '#F0B429',
          fontSize: '0.9375rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(240, 180, 41, 0.08)',
            borderColor: 'rgba(240, 180, 41, 0.5)',
          },
        },
        '.btn-ghost': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.625rem',
          background: 'transparent',
          padding: '0.5rem 1rem',
          fontWeight: '500',
          color: '#6B6B8A',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.04)',
            color: '#F0F0F5',
          },
        },
        '.input-premium': {
          borderRadius: '0.625rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(8, 8, 18, 0.8)',
          padding: '0.625rem 0.875rem',
          color: '#F0F0F5',
          fontSize: '0.9375rem',
          transition: 'all 0.2s ease',
          '&::placeholder': { color: '#3D3D5C' },
          '&:focus': {
            outline: 'none',
            border: '1px solid rgba(240, 180, 41, 0.4)',
            boxShadow: '0 0 0 3px rgba(240, 180, 41, 0.08)',
          },
        },
        '.kpi-card': {
          background: 'linear-gradient(135deg, rgba(19,19,37,0.9) 0%, rgba(13,13,26,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '1.25rem',
          padding: '1.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          position: 'relative',
        },
        '.badge-success': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          borderRadius: '9999px',
          background: 'rgba(0, 230, 118, 0.12)',
          border: '1px solid rgba(0, 230, 118, 0.25)',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: '#00E676',
        },
        '.badge-danger': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          borderRadius: '9999px',
          background: 'rgba(255, 61, 113, 0.12)',
          border: '1px solid rgba(255, 61, 113, 0.25)',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: '#FF3D71',
        },
        '.badge-warning': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          borderRadius: '9999px',
          background: 'rgba(240, 180, 41, 0.12)',
          border: '1px solid rgba(240, 180, 41, 0.25)',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: '#F0B429',
        },
        '.badge-neutral': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          borderRadius: '9999px',
          background: 'rgba(107, 107, 138, 0.12)',
          border: '1px solid rgba(107, 107, 138, 0.2)',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: '#6B6B8A',
        },
      })
    }),
  ],
}

export default config
