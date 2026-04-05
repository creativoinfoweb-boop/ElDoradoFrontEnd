'use client'

import { useState } from 'react'
import { BotInstance } from '@/types'
import { formatUptime, formatTimeAgo } from '@/lib/utils'
import { StatusBadge } from '../ui/StatusBadge'
import { Play, Pause, Square, AlertTriangle } from 'lucide-react'

interface BotStatusCardProps {
  bot: BotInstance
  onStart?: (botId: string) => void
  onPause?: (botId: string) => void
  onResume?: (botId: string) => void
  onStop?: (botId: string) => void
  isLoading?: boolean
}

export function BotStatusCard({
  bot,
  onStart,
  onPause,
  onResume,
  onStop,
  isLoading = false,
}: BotStatusCardProps) {
  const [showConfirm, setShowConfirm] = useState<string | null>(null)

  const handleAction = async (
    action: 'start' | 'pause' | 'resume' | 'stop',
    callback?: (botId: string) => void
  ) => {
    void action
    if (callback) {
      callback(bot.id)
    }
    setShowConfirm(null)
  }

  const uptime = bot.last_heartbeat ? new Date(bot.last_heartbeat).getTime() - new Date(bot.started_at || new Date()).getTime() : 0

  return (
    <div className="card-premium">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-primary-text">{bot.name}</h3>
          <p className="text-xs text-secondary-text">{bot.accountId}</p>
        </div>
        <StatusBadge status={bot.status} showPulse={true} />
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-secondary-text">Uptime</span>
          <span className="font-mono font-semibold text-primary-text">{formatUptime(uptime)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary-text">Ultimo segnale</span>
          <span className="font-mono text-xs text-primary-text">
            {bot.last_heartbeat ? formatTimeAgo(bot.last_heartbeat) : 'N/A'}
          </span>
        </div>
        {bot.error_message && (
          <div className="flex items-start gap-2 rounded-md bg-loss-red/10 p-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-loss-red" />
            <p className="text-xs text-loss-red">{bot.error_message}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {bot.status === 'stopped' && (
          <button
            onClick={() => handleAction('start', onStart)}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent-indigo/20 px-3 py-2 text-sm font-medium text-accent-indigo transition-all hover:bg-accent-indigo/30 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            Start
          </button>
        )}

        {(bot.status === 'running' || bot.status === 'paused') && (
          <>
            {bot.status === 'running' && (
              <button
                onClick={() => {
                  setShowConfirm('pause')
                }}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-warning-yellow/20 px-3 py-2 text-sm font-medium text-warning-yellow transition-all hover:bg-warning-yellow/30 disabled:opacity-50"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
            )}

            {bot.status === 'paused' && (
              <button
                onClick={() => handleAction('resume', onResume)}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-profit-green/20 px-3 py-2 text-sm font-medium text-profit-green transition-all hover:bg-profit-green/30 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                Resume
              </button>
            )}

            <button
              onClick={() => {
                setShowConfirm('stop')
              }}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-loss-red/20 px-3 py-2 text-sm font-medium text-loss-red transition-all hover:bg-loss-red/30 disabled:opacity-50"
            >
              <Square className="h-4 w-4" />
              Stop
            </button>
          </>
        )}
      </div>

      {showConfirm && (
        <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface/50 p-3">
          <p className="text-sm text-secondary-text">
            {showConfirm === 'pause' && 'Mettere in pausa il bot?'}
            {showConfirm === 'stop' && 'Stoppare il bot? Questa azione non chiuderà i trade aperti.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(null)}
              className="flex-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-all hover:bg-surface/50"
            >
              Annulla
            </button>
            <button
              onClick={() =>
                showConfirm === 'pause'
                  ? handleAction('pause', onPause)
                  : handleAction('stop', onStop)
              }
              className="flex-1 rounded-lg bg-accent-indigo px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-accent-indigo/90"
            >
              Conferma
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
