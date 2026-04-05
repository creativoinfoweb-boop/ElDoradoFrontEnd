/**
 * Frontend types for Gold Boss Bot Copy Trading SaaS
 */

// ─────────────────────────────────────────────────────────────────────────
// Authentication
// ─────────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface User {
  id: string
  email: string
  username?: string
  full_name: string
  is_active: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

// ─────────────────────────────────────────────────────────────────────────
// Trading / bots / MT5 (dashboard + WebSocket)
// ─────────────────────────────────────────────────────────────────────────

export interface Trade {
  id: string
  botId: string
  accountId: string
  ticket: number | string
  symbol: string
  tradeType: 'buy' | 'sell'
  entryPrice: number
  entryTime: string
  quantity: number
  stopLoss: number
  takeProfit: number
  status: string
  closedAt?: string
  pnl?: number
  pnlPercent?: number
}

export type BotRunState = 'running' | 'paused' | 'stopped' | 'error'

export interface BotInstance {
  id: string
  name: string
  accountId: string
  status: BotRunState
  last_heartbeat?: string
  started_at?: string
  error_message?: string
}

/** Stato bot nel trading store / WebSocket (non confondere con `BotInstance.status`). */
export interface BotStatus {
  botId: string
  status: string
  uptime?: number
  lastSignalAt?: string
  processedSignals?: number
}

export interface TradeOpenedEvent {
  data: {
    tradeId: string
    ticket: number
    symbol: string
    tradeType: 'buy' | 'sell'
    entryPrice: number
    quantity: number
    stopLoss: number
    takeProfit: number
  }
}

export interface TradeClosedEvent {
  data: {
    tradeId: string
    closePrice: number
    pnl: number
    pnlPercent: number
  }
}

export interface BalanceUpdateEvent {
  data: {
    accountId: string
    balance: number
    equity: number
    freeMargin: number
    marginUsed: number
  }
}

export interface BotStatusEvent {
  data: {
    botId: string
    status: string
    uptime?: number
    lastSignalAt?: string
  }
}

export interface MT5Account {
  id: string
  user_id: string
  name: string
  mt5_login: string
  mt5_server: string
  account_type: string
  is_active: boolean
  is_primary: boolean
  last_check_at?: string | null
  last_check_ok?: boolean | null
  last_check_error?: string | null
  created_at: string
  updated_at: string
}

// ─────────────────────────────────────────────────────────────────────────
// API Keys
// ─────────────────────────────────────────────────────────────────────────

export interface ApiKey {
  id: string
  label?: string
  is_active: boolean
  last_used_at?: string
  created_at: string
}

export interface ApiKeyWithSecret extends ApiKey {
  key: string  // Only shown at creation
}

// ─────────────────────────────────────────────────────────────────────────
// Subscriptions
// ─────────────────────────────────────────────────────────────────────────

export interface Subscription {
  id: string
  user_id: string
  plan_name: string  // gold_boss_monthly
  trial_ends_at?: string
  is_active: boolean
  started_at?: string
  coupon_code?: string
  discount_percent?: number
  created_at: string
}

export interface SubscriptionStatus {
  status: 'none' | 'trialing' | 'trial_expired' | 'active' | 'inactive'
  message: string
  days_remaining?: number
  trial_ends_at?: string
  started_at?: string
  plan?: string
  cancel_at_period_end?: boolean
  stripe_subscription_status?: string
}

export interface CouponValidation {
  valid: boolean
  discount_type?: 'PERCENT' | 'FIXED'
  discount_value?: number
  discount_amount?: number
  final_price?: number
}

// ─────────────────────────────────────────────────────────────────────────
// Signals (Copy Trading)
// ─────────────────────────────────────────────────────────────────────────

export interface MasterSignal {
  id: string
  symbol: string
  direction: 'BUY' | 'SELL'
  entry_price: number
  sl: number
  tp: number
  lot_size: number
  status: 'OPEN' | 'CLOSED' | 'CANCELLED'
  opened_at: string
  closed_at?: string
  profit_pips?: number
  profit_usd?: number
  comment?: string
}

export interface PendingSignal {
  id: string
  signal_id: string
  symbol: string
  direction: 'BUY' | 'SELL'
  entry_price: number
  sl: number
  tp: number
}

export interface SignalExecution {
  id: string
  signal_id: string
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'SKIPPED'
  executed_at?: string
  error_msg?: string
  lot_size?: number
}

// ─────────────────────────────────────────────────────────────────────────
// Performance Stats
// ─────────────────────────────────────────────────────────────────────────

export interface PublicPerformance {
  trades_total: number
  trades_win: number
  trades_loss: number
  win_rate_percent: number
  profit_factor: number
  avg_trade_duration_hours: number
  best_trade_pips?: number
  worst_trade_pips?: number
  total_profit_pips: number
  total_profit_usd: number
}

export interface UserStats {
  trades_copied: number
  trades_executed: number
  trades_failed: number
  win_rate_percent: number
  avg_profit_per_trade: number
  total_profit_pips: number
}

// ─────────────────────────────────────────────────────────────────────────
// Coupons (Admin)
// ─────────────────────────────────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  discount_type: 'PERCENT' | 'FIXED'
  discount_value: number
  max_uses?: number
  uses_count: number
  valid_until?: string
  is_active: boolean
  created_at: string
}

// ─────────────────────────────────────────────────────────────────────────
// Admin
// ─────────────────────────────────────────────────────────────────────────

export interface AdminStats {
  users_total: number
  subscriptions_active: number
  trials_active: number
  signals_today: number
}

export interface AdminUser {
  id: string
  email: string
  username: string
  is_active: boolean
  subscription_status: boolean
  created_at: string
}
