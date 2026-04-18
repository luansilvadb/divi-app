import { supabase } from '@/core/supabase'
import type { IAuthService } from '../domain/contracts/IAuthService'
import type { User } from '../domain/entities/User'
import type { Credentials } from '../domain/contracts/Credentials'
import { SYNCABLE_TABLES } from '@/core/sync/syncConfig'

export class SupabaseAuth implements IAuthService {
  async signInWithGoogle(): Promise<void> {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
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

  async signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): void {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
        })
      } else {
        callback(null)
      }
    })
  }

  /**
   * Deletes all data belonging to the current user from all syncable Supabase tables.
   * Relies on RLS policies to scope the delete to the authenticated user.
   * Note: The auth account itself remains — this purges data only.
   * For full account deletion, a Supabase Edge Function with admin rights would be required.
   */
  async deleteAccountData(): Promise<void> {
    const errors: string[] = []

    for (const table of SYNCABLE_TABLES) {
      // RLS ensures only the user's own rows are deleted (no explicit user_id filter needed)
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) {
        console.error(`[AccountPurge] Failed to delete from ${table}:`, error.message)
        errors.push(`${table}: ${error.message}`)
      }
    }

    if (errors.length > 0) {
      throw new Error(`Purge parcialmente falhou em: ${errors.join(', ')}`)
    }
  }
}
