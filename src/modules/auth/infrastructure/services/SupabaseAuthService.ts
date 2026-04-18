import type { IAuthService } from '../../domain/contracts/IAuthService'
import type { User } from '../../domain/entities/User'
import type { Credentials } from '../../domain/contracts/Credentials'
import { supabase } from '@/core/supabase'

export class SupabaseAuthService implements IAuthService {
  async signInWithGoogle(): Promise<void> {
    const redirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) throw error
  }

  async getCurrentUser(): Promise<User | null> {
    // 1. Get local session (fast, works offline)
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) return null

    // 2. Clear URL hash (token leak protection)
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    // 3. If online, validate user with server for better security
    // If offline, trust local session to prevent app from freezing
    let user = session.user

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const {
          data: { user: verifiedUser },
          error: userError,
        } = await supabase.auth.getUser()
        if (!userError && verifiedUser) {
          user = verifiedUser
        }
      } catch {
        console.warn(
          '[AuthService] Failed to verify user on server (offline?), using local session.',
        )
      }
    }

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
    }
  }

  async signInWithEmail(credentials: Credentials): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error
  }

  async registerWithEmail(credentials: Credentials): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error
  }

  onAuthStateChange(callback: (user: User | null) => void): void {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        callback(null)
        return
      }

      const user = session.user
      callback({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      })
    })
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async deleteAccountData(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const USER_DATA_TABLES = [
      'transactions', 'wallets', 'categories', 'budgets', 'goals', 'subscriptions', 'loans'
    ] as const

    for (const table of USER_DATA_TABLES) {
      const { error } = await supabase.from(table).delete().eq('user_id', user.id)
      if (error) console.error(`[AuthService] Failed to delete data from ${table}:`, error)
    }
  }
}
