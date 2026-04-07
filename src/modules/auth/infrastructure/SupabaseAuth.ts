import { supabase } from '@/core/supabase'
import type { IAuthService } from '../domain/contracts/IAuthService'
import type { User } from '../domain/entities/User'

export class SupabaseAuth implements IAuthService {
  async signInWithGoogle(): Promise<void> {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
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
}
