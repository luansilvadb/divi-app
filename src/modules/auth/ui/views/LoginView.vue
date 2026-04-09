<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-main">
    <!-- Noise texture overlay -->
    <div
      class="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('/assets/noise-overlay.svg')] bg-repeat"
      aria-hidden="true"
    ></div>

    <!-- Content -->
    <div
      class="relative z-20 flex flex-col items-center gap-8 p-6 w-full max-w-[480px] animate-fade-in"
    >
      <!-- Glass card -->
      <div class="glass-card flex flex-col items-center gap-6 w-full p-10 sm:p-12 hover-glow">
        <!-- Logo -->
        <div class="flex items-center gap-3 animate-fade-in [animation-delay:150ms]">
          <div class="shrink-0 drop-shadow-md">
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="44" height="44" rx="12" fill="url(#logoGradient)" />
              <path
                d="M14 16C14 14.8954 14.8954 14 16 14H22C25.866 14 29 17.134 29 21C29 24.866 25.866 28 22 28H18V30C18 31.1046 17.1046 32 16 32C14.8954 32 14 31.1046 14 30V16Z"
                fill="white"
                fill-opacity="0.95"
              />
              <circle cx="30" cy="28" r="4" fill="white" fill-opacity="0.6" />
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="44" y2="44">
                  <stop stop-color="var(--color-primary-main)" />
                  <stop offset="0.5" stop-color="var(--color-secondary-main)" />
                  <stop offset="1" stop-color="var(--color-accent-main)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1
            class="text-[2.25rem] sm:text-[2.5rem] font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary-main via-secondary-main to-accent-main"
          >
            Divi
          </h1>
        </div>

        <!-- Tagline -->
        <p
          class="text-center text-[1.1rem] leading-relaxed text-text-secondary m-0 animate-fade-in [animation-delay:250ms]"
        >
          Suas finanças pessoais,<br />
          <span class="font-bold text-text-primary">simplificadas.</span>
        </p>

        <!-- Auth Form -->
        <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-4 animate-fade-in [animation-delay:350ms]">
          <div class="flex flex-col gap-2">
            <label for="email" class="text-xs font-semibold uppercase tracking-wider text-text-disabled ml-1">E-mail</label>
            <InputText 
              id="email" 
              v-model="email" 
              type="email" 
              placeholder="seu@email.com" 
              class="w-full"
              required 
            />
          </div>
          
          <div class="flex flex-col gap-2">
            <label for="password" class="text-xs font-semibold uppercase tracking-wider text-text-disabled ml-1">Senha</label>
            <Password 
              v-model="password" 
              toggleMask 
              :feedback="isRegister"
              placeholder="••••••••"
              class="w-full"
              inputClass="w-full"
              required
            >
              <template v-if="isRegister" #header>
                <div class="font-semibold text-sm mb-4">Escolha uma senha</div>
              </template>
              <template v-if="isRegister" #footer>
                <Divider />
                <ul class="pl-2 ml-2 mt-0 line-height-3">
                  <li>Ao menos uma letra minúscula</li>
                  <li>Ao menos uma letra maiúscula</li>
                  <li>Ao menos um número</li>
                  <li>Mínimo de 8 caracteres</li>
                </ul>
              </template>
            </Password>
          </div>

          <BaseButton 
            type="submit" 
            variant="primary" 
            class="w-full mt-2" 
            :loading="isLoading" 
            :disabled="isLoading"
          >
            {{ isRegister ? 'Criar conta' : 'Entrar' }}
          </BaseButton>

          <button 
            type="button"
            id="toggle-auth-mode"
            @click="isRegister = !isRegister" 
            class="text-xs font-medium text-text-secondary hover:text-primary-main transition-colors duration-200 text-center"
          >
            {{ isRegister ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Criar conta' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-4 w-full animate-fade-in [animation-delay:450ms]">
          <div
            class="flex-1 h-px bg-gradient-to-r from-transparent via-border-main to-transparent"
          ></div>
          <span
            class="text-xs font-semibold uppercase tracking-widest text-text-disabled whitespace-nowrap"
            >ou use</span
          >
          <div
            class="flex-1 h-px bg-gradient-to-r from-transparent via-border-main to-transparent"
          ></div>
        </div>

        <!-- Google button -->
        <BaseButton variant="outline" id="login-google-btn" :aria-busy="isLoading" :pt="{ root: { class: 'w-full relative overflow-hidden px-6 py-3.5 rounded-[0.875rem] border border-border-main bg-surface-main cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] hover:border-primary-main active:translate-y-0 active:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main disabled:opacity-60 disabled:cursor-not-allowed animate-fade-in [animation-delay:550ms] border-none' } }" @click="handleGoogleLogin" :disabled="isLoading" :loading="isLoading">
          <div
            class="relative z-10 flex items-center justify-center gap-3 text-[0.95rem] font-semibold text-text-primary"
          >
            <svg
              v-if="!isLoading"
              class="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <div
              v-else
              aria-hidden="true"
              class="w-5 h-5 border-[2.5px] border-border-main border-t-primary-main rounded-full animate-spin shrink-0"
            ></div>
            <span>{{ isLoading ? 'Conectando...' : 'Continuar com Google' }}</span>
          </div>
        </BaseButton>

        <!-- Terms -->
        <p
          class="text-center text-[0.72rem] leading-relaxed text-text-disabled m-0 animate-fade-in [animation-delay:650ms]"
        >
          Ao continuar, você concorda com nossos<br />
          <a
            href="#"
            aria-label="Termos de Uso"
            class="text-text-secondary underline decoration-black/15 dark:decoration-white/15 underline-offset-2 transition-colors duration-200 hover:text-primary-main hover:decoration-primary-main"
            >Termos de Uso</a
          >
          e
          <a
            href="#"
            aria-label="Política de Privacidade"
            class="text-text-secondary underline decoration-black/15 dark:decoration-white/15 underline-offset-2 transition-colors duration-200 hover:text-primary-main hover:decoration-primary-main"
            >Política de Privacidade</a
          >
        </p>
      </div>

      <!-- Footer -->
      <div class="animate-fade-in [animation-delay:750ms]">
        <span class="text-xs text-text-disabled tracking-[0.02em]"
          >Divi Finance © {{ currentYear }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import { useToast } from 'primevue/usetoast'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAuthService } from '../../domain/contracts/IAuthService'

const isLoading = ref(false)
const isRegister = ref(false)
const email = ref('')
const password = ref('')
const toast = useToast()

const authService = container.resolve<IAuthService>(DI_TOKENS.AuthService)
const currentYear = new Date().getFullYear()

async function handleSubmit() {
  isLoading.value = true
  try {
    if (isRegister.value) {
      await authService.registerWithEmail({ email: email.value, password: password.value })
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta criada com sucesso!', life: 3000 })
    } else {
      await authService.signInWithEmail({ email: email.value, password: password.value })
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado com sucesso!', life: 3000 })
    }
  } catch (error: Error | unknown) {
    toast.add({ severity: 'error', summary: 'Erro', detail: (error instanceof Error ? error.message : 'Ocorreu um erro na autenticação.'), life: 5000 })
  } finally {
    isLoading.value = false
  }
}

async function handleGoogleLogin() {
  isLoading.value = true
  try {
    await authService.signInWithGoogle()
  } catch (error: Error | unknown) {
    toast.add({ severity: 'error', summary: 'Erro', detail: (error instanceof Error ? error.message : 'Ocorreu um erro ao conectar com Google.'), life: 5000 })
  } finally {
    isLoading.value = false
  }
}
</script>
