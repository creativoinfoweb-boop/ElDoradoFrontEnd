/**
 * Chiave pubblica Clerk: in Vercel va sempre impostata `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
 * Se manca durante `next build`, usiamo un placeholder con formato accettato da Clerk
 * così il deploy non fallisce prima di aver salvato le env nel progetto.
 */
export function clerkPublishableKey(): string {
  const k = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  if (k) return k
  return 'pk_test_bW9jay1wdWJsaXNoYWJsZS1rZXktZm9yLWJ1aWxkLmNscmsk'
}
