<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

import { SupabaseAuth } from '../../infrastructure/SupabaseAuth'

const authService = new SupabaseAuth()
const router = useRouter()

const isLoginMode = ref(true)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  errorMessage.value = ''
  successMessage.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    if (isLoginMode.value) {
      await authService.signInWithEmail({ email: email.value, password: password.value })
      // Typically we'd redirect or fetch user, but AuthStore might handle it on auth state change
      router.push('/') // Example redirect
    } else {
      await authService.registerWithEmail({ email: email.value, password: password.value })
      successMessage.value = 'Registration successful! You can now log in.'
      isLoginMode.value = true
    }
  } catch (err: Error | unknown) {
    errorMessage.value = (err instanceof Error ? err.message : 'An error occurred')
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    await authService.signInWithGoogle()
  } catch (err: Error | unknown) {
    errorMessage.value = (err instanceof Error ? err.message : 'Google login failed')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface-50 p-4 dark:bg-surface-900">
    <div class="w-full max-w-md rounded-lg bg-surface-0 p-8 shadow-md dark:bg-surface-800">
      <h2 class="mb-6 text-center text-3xl font-bold text-surface-900 dark:text-surface-0">
        {{ isLoginMode ? 'Login' : 'Register' }}
      </h2>

      <Message v-if="errorMessage" severity="error" :closable="false" class="mb-4">
        {{ errorMessage }}
      </Message>
      
      <Message v-if="successMessage" severity="success" :closable="false" class="mb-4">
        {{ successMessage }}
      </Message>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="email" class="text-sm font-medium text-surface-700 dark:text-surface-100">Email</label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="password" class="text-sm font-medium text-surface-700 dark:text-surface-100">Password</label>
          <Password
            id="password"
            v-model="password"
            :feedback="!isLoginMode"
            toggleMask
            placeholder="Enter your password"
            required
            class="w-full"
            inputClass="w-full"
          />
          <!-- The primevue Password component requires inputClass="w-full" to stretch the input inside its container -->
        </div>

        <Button
          type="submit"
          :label="isLoginMode ? 'Login' : 'Register'"
          :loading="loading"
          class="mt-2 w-full"
        />
      </form>

      <div class="my-6 flex items-center justify-between">
        <hr class="w-full border-surface-200 dark:border-surface-700" />
        <span class="px-2 text-sm text-surface-500 dark:text-surface-400">or</span>
        <hr class="w-full border-surface-200 dark:border-surface-700" />
      </div>

      <Button
        type="button"
        label="Sign in with Google"
        icon="pi pi-google"
        severity="secondary"
        outlined
        class="google-btn w-full"
        @click="handleGoogleLogin"
      />

      <div class="mt-6 text-center text-sm">
        <a
          href="#"
          class="toggle-mode text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          @click.prevent="toggleMode"
        >
          {{ isLoginMode ? 'Need an account? Register' : 'Already have an account? Login' }}
        </a>
      </div>
    </div>
  </div>
</template>
