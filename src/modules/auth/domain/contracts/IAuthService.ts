import type { User } from '../entities/User'

export interface IAuthService {
  signInWithGoogle(): Promise<void>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>
  onAuthStateChange(callback: (user: User | null) => void): void
}
