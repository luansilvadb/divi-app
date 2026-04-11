import type { User } from '../entities/User'
import type { Credentials } from './Credentials'

export interface IAuthService {
  signInWithGoogle(): Promise<void>
  signInWithEmail(credentials: Credentials): Promise<void>
  registerWithEmail(credentials: Credentials): Promise<void>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>
  onAuthStateChange(callback: (user: User | null) => void): void
}
