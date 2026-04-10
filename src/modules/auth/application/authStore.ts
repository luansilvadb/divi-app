import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../domain/entities/User'
import type { IAuthService } from '../domain/contracts/IAuthService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  function setUser(newUser: User) {
    user.value = newUser
  }

  function clearUser() {
    user.value = null
  }

  async function initialize(authService: IAuthService) {
    // Set initial user
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      user.value = currentUser
    }

    // Listen for auth changes
    authService.onAuthStateChange((newUser: User | null) => {
      user.value = newUser
    })
  }

  return {
    user,
    isAuthenticated,
    setUser,
    clearUser,
    initialize
  }
})

