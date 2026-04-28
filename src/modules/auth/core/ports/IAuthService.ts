import type { IUser } from '../entities/IUser'
import type { ICredentials } from './ICredentials'

export interface IAuthService {
  signInWithGoogle(): Promise<void>
  signInWithEmail(credentials: ICredentials): Promise<void>
  registerWithEmail(credentials: ICredentials): Promise<void>
  signOut(): Promise<void>
  getCurrentUser(): Promise<IUser | null>
  onAuthStateChange(callback: (user: IUser | null) => void): void
  deleteAccountData(): Promise<void>
}
