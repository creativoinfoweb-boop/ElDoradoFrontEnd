import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy webhook Stripe → backend FastAPI.
 *
 * Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`
 * La firma viene verificata su `/subscriptions/webhook/stripe` (raw body invariato).
 *
 * Opzionale: `STRIPE_WEBHOOK_FORWARD_URL` = URL completo del webhook backend
 * (es. http://127.0.0.1:8000/subscriptions/webhook/stripe).
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function backendWebhookUrl(): string {
  const explicit = process.env.STRIPE_WEBHOOK_FORWARD_URL?.trim()
  if (explicit) return explicit
  const api = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  return `${api}/subscriptions/webhook/stripe`
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ detail: 'Missing stripe-signature header' }, { status: 400 })
  }

  const target = backendWebhookUrl()
  const contentType = req.headers.get('content-type') || 'application/json'

  const res = await fetch(target, {
    method: 'POST',
    headers: {
      'stripe-signature': sig,
      'content-type': contentType,
    },
    body: rawBody,
  })

  const text = await res.text()
  return new NextResponse(text, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  })
}
