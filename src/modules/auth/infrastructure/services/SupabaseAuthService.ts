import type { IAuthService } from '../domain/contracts/IAuthService'
import type { User } from '../domain/entities/User'
import { supabase } from '@/core/supabase'

export class SupabaseAuthService implements IAuthService {
  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) throw error
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
    }
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
        name: user.user_metadata.full_name,
        avatar_url: user.user_metadata.avatar_url,
      })
    })
  }
}
