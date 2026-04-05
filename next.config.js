/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['*.replit.dev', '*.kirk.replit.dev', '*.repl.co'],
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return [
      // Solo auth verso il backend; NON usare /api/* globale o `/api/webhook` (App Router) non verrebbe mai eseguito.
      { source: '/api/auth/:path*', destination: `${api.replace(/\/$/, '')}/auth/:path*` },
    ]
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
