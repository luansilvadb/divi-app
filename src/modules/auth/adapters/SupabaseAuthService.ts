import type { IAuthService } from '../core/ports/IAuthService'
import type { IUser } from '../core/entities/IUser'
import type { ICredentials } from '../core/ports/ICredentials'
import type { SupabaseClient } from '@supabase/supabase-js'

export class SupabaseAuthService implements IAuthService {
  constructor(private readonly supabase: SupabaseClient) {}

  async signInWithGoogle(): Promise<void> {
    const redirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) throw error
  }

  async getCurrentUser(): Promise<IUser | null> {
    // 1. Get local session (fast, works offline)
    const {
      data: { session },
      error: sessionError,
    } = await this.supabase.auth.getSession()

    if (sessionError || !session) return null

    // 2. If online, validate user with server for better security
    // If offline, trust local session to prevent app from freezing
    let user = session.user

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const {
          data: { user: verifiedUser },
          error: userError,
        } = await this.supabase.auth.getUser()
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

  async signInWithEmail(credentials: ICredentials): Promise<void> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error
  }

  async registerWithEmail(credentials: ICredentials): Promise<void> {
    const { error } = await this.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error
  }

  onAuthStateChange(callback: (user: IUser | null) => void): void {
    this.supabase.auth.onAuthStateChange((_event, session) => {
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
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async deleteAccountData(): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) return

    const USER_DATA_TABLES = [
      'transactions', 'wallets', 'categories', 'budgets', 'goals', 'subscriptions', 'loans'
    ] as const

    const failedTables: string[] = []
    for (const table of USER_DATA_TABLES) {
      const { error } = await this.supabase.from(table).delete().eq('user_id', user.id)
      if (error) {
        console.error(`[AuthService] Failed to delete data from ${table}:`, error)
        failedTables.push(table)
      }
    }

    if (failedTables.length > 0) {
      throw new Error(`Purge parcialmente falhou em: ${failedTables.join(', ')}`)
    }
  }
}
