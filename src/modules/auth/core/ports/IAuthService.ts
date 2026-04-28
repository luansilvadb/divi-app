import type { IUser } from '../entities/IUser'
import type { Credentials } from './Credentials'

export interface IAuthService {
  signInWithGoogle(): Promise<void>
  signInWithEmail(credentials: Credentials): Promise<void>
  registerWithEmail(credentials: Credentials): Promise<void>
  signOut(): Promise<void>
  getCurrentUser(): Promise<IUser | null>
  onAuthStateChange(callback: (user: IUser | null) => void): void
  deleteAccountData(): Promise<void>
}
