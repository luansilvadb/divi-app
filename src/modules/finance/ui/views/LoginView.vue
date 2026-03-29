<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Welcome to Divi</h1>
      <p>Manage your personal finances with ease.</p>
      <button @click="handleLogin" :disabled="isLoading" class="google-btn">
        <span v-if="isLoading">Connecting...</span>
        <span v-else>Continue with Google</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { container } from '../../../../core/di'
import type { IAuthService } from '../../domain/services/IAuthService'

const isLoading = ref(false)
const authService = container.resolve<IAuthService>('IAuthService')

async function handleLogin() {
  isLoading.value = true
  try {
    await authService.signInWithGoogle()
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
}
.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 90%;
}
.google-btn {
  margin-top: 2rem;
  width: 100%;
  padding: 0.75rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}
.google-btn:hover {
  background: #4338ca;
}
</style>
