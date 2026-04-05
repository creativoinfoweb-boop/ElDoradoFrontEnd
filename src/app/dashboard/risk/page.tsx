'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function RiskCalculatorPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [balance, setBalance] = useState(1000)
  const [riskPercent, setRiskPercent] = useState(2)

  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  const riskAmount        = (balance * riskPercent) / 100
  const avgPipsPerTrade   = 20
  const usdPerPip         = 10
  const estProfitPerTrade = (avgPipsPerTrade * usdPerPip * riskPercent) / 100
  const tradesPerMonth    = 20
  const estMonthlyProfit  = estProfitPerTrade * tradesPerMonth
  const estWeeklyProfit   = estMonthlyProfit / 4.33
  const est3MonthsProfit  = estMonthlyProfit * 3

  const projections = [
    { label: 'Stima 1 Settimana', value: estWeeklyProfit,   roi: estWeeklyProfit   / balance * 100 },
    { label: 'Stima 1 Mese',      value: estMonthlyProfit,  roi: estMonthlyProfit  / balance * 100 },
    { label: 'Stima 3 Mesi',      value: est3MonthsProfit,  roi: est3MonthsProfit  / balance * 100 },
  ]

  return (
    <div className="space-y-8 max-w-[1000px]">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Risk Calculator</h1>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Calcola il tuo rischio di trading</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="card-premium p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Balance Conto (€)
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
              className="input-premium w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Risk per Trade</label>
              <span className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>{riskPercent.toFixed(1)}%</span>
            </div>
            <input
              type="range" min="0.5" max="5" step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
              className="w-full accent-[var(--gold)]"
            />
            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Consigliato: 1–3%</p>
          </div>

          <div className="rounded-lg p-4 space-y-2" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
            {[
              { label: 'Amount at Risk',       value: `€${riskAmount.toFixed(2)}`,        color: 'var(--gold)'  },
              { label: 'Profit per Trade (est)',value: `€${estProfitPerTrade.toFixed(2)}`, color: 'var(--green)' },
              { label: 'Trades per Month (avg)',value: String(tradesPerMonth),              color: 'var(--text-primary)' },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}:</span>
                <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projections */}
        <div className="space-y-4">
          {projections.map(p => (
            <div key={p.label} className="card-premium p-6">
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{p.label}</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--green)' }}>€{p.value.toFixed(2)}</p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>~{p.roi.toFixed(2)}% ROI</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg p-4 text-xs" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        <p>
          <span className="font-semibold" style={{ color: 'var(--gold)' }}>Avviso:</span>{' '}
          Queste stime si basano su dati storici e assunzioni. Le performance passate non garantiscono risultati futuri. Il trading comporta rischi. Consulta sempre un professionista prima di investire.
        </p>
      </div>
    </div>
  )
}
