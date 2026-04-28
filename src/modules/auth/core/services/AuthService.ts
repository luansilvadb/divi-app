import type { IAuthService } from '../../core/ports/IAuthService'
import type { IUser } from '../../core/entities/IUser'
import type { Credentials } from '../../core/ports/Credentials'

export class AuthService implements IAuthService {
  constructor(private readonly authPort: IAuthService) {}

  async signInWithGoogle(): Promise<void> {
    return this.authPort.signInWithGoogle()
  }

  async signInWithEmail(credentials: Credentials): Promise<void> {
    // Add application-level validation if needed
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required')
    }
    return this.authPort.signInWithEmail(credentials)
  }

  async registerWithEmail(credentials: Credentials): Promise<void> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required')
    }
    return this.authPort.registerWithEmail(credentials)
  }

  async signOut(): Promise<void> {
    return this.authPort.signOut()
  }

  async getCurrentUser(): Promise<IUser | null> {
    const user = await this.authPort.getCurrentUser()
    
    // Application logic: Clear URL hash (moved from adapter)
    if (user && typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    return user
  }

  onAuthStateChange(callback: (user: IUser | null) => void): void {
    this.authPort.onAuthStateChange(callback)
  }

  async deleteAccountData(): Promise<void> {
    return this.authPort.deleteAccountData()
  }
}
