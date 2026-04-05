import type { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth'

/** Logout app: pulisce React Query, Zustand persist e JWT; poi sessione Clerk. */
export async function performAppLogout(
  queryClient: QueryClient,
  signOut: (opts?: { redirectUrl?: string }) => Promise<unknown>
): Promise<void> {
  await queryClient.cancelQueries()
  queryClient.clear()
  useAuthStore.getState().logout()
  const p = useAuthStore.persist
  if (p && typeof p.clearStorage === 'function') {
    p.clearStorage()
  }
  await signOut({ redirectUrl: '/' })
}
