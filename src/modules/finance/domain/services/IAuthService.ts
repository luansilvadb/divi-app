export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export interface IAuthService {
  signInWithGoogle(): Promise<void>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>
  onAuthStateChange(callback: (user: User | null) => void): void
}
