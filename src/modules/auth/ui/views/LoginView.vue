<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Content -->
    <div class="relative z-20 flex flex-col items-center gap-8 p-6 w-full max-w-[480px] animate-fade-in">
      <!-- Glass card -->
      <NCard class="w-full" size="large">
        <NSpace vertical align="center" :size="24">
          <!-- Logo -->
          <NSpace align="center" :size="12">
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
                    <stop stop-color="#8b5cf6" />
                    <stop offset="1" stop-color="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <NText
              class="text-[2.5rem] sm:text-[3rem] font-black tracking-tighter leading-none !bg-clip-text !text-transparent"
              style="background-image: linear-gradient(to bottom right, var(--color-primary), var(--color-info));"
            >
              Divi
            </NText>
          </NSpace>

          <!-- Tagline -->
          <NText class="text-center text-lg leading-relaxed">
            Suas finanças pessoais,<br />
            <NText strong>simplificadas.</NText>
          </NText>

          <!-- Auth Form -->
          <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-4">
            <NSpace vertical :size="4">
              <NText depth="3" class="text-[10px] font-bold uppercase tracking-widest ml-1">E-mail</NText>
              <NInput
                id="email"
                v-model:value="email"
                type="text"
                placeholder="seu@email.com"
                required
                size="large"
              >
                <template #prefix>
                  <i class="i-lucide-mail text-zinc-400"></i>
                </template>
              </NInput>
            </NSpace>

            <NSpace vertical :size="4">
              <NText depth="3" class="text-[10px] font-bold uppercase tracking-widest ml-1">Senha</NText>
              <NInput
                id="password"
                v-model:value="password"
                type="password"
                show-password-on="mousedown"
                placeholder="••••••••"
                required
                size="large"
              >
                <template #prefix>
                  <i class="i-lucide-lock text-zinc-400"></i>
                </template>
              </NInput>
            </NSpace>

            <NButton
              type="primary"
              attr-type="submit"
              block
              size="large"
              round
              :loading="isLoading"
              :disabled="isLoading"
              class="mt-2"
            >
              {{ isRegister ? 'Criar conta' : 'Entrar' }}
            </NButton>

            <NButton
              id="toggle-auth-mode"
              quaternary
              size="small"
              block
              @click="isRegister = !isRegister"
            >
              {{ isRegister ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Criar conta' }}
            </NButton>
          </form>

          <!-- Divider -->
          <NDivider title-placement="center" class="w-full !my-0">
            <NText depth="3" class="text-[10px] uppercase tracking-widest font-bold">ou use</NText>
          </NDivider>

          <!-- Google button -->
          <NButton
            id="login-google-btn"
            block
            size="large"
            round
            :disabled="isLoading"
            :loading="isLoading"
            @click="handleGoogleLogin"
          >
            <template #icon>
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
            </template>
            {{ isLoading ? 'Conectando...' : 'Continuar com Google' }}
          </NButton>

          <!-- Terms -->
          <NText depth="3" class="text-center text-[10px] leading-relaxed">
            Ao continuar, você concorda com nossos<br />
            <a href="#" class="underline underline-offset-2 hover:text-[#007AFF] transition-colors">Termos de Uso</a>
            e
            <a href="#" class="underline underline-offset-2 hover:text-[#007AFF] transition-colors">Política de Privacidade</a>
          </NText>
        </NSpace>
      </NCard>

      <!-- Footer -->
      <NText depth="3" class="text-[10px] uppercase tracking-widest font-bold">
        Divi Finance © {{ currentYear }}
      </NText>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NInput,
  NDivider,
  NButton,
  NCard,
  NSpace,
  NText,
  useMessage,
} from 'naive-ui'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAuthService } from '../../core/ports/IAuthService'
import { useAuthStore } from '../../application/authStore'

const authStore = useAuthStore()
const isLoading = ref(false)
const isRegister = ref(false)
const email = ref('')
const password = ref('')
const message = useMessage()

const authService = container.resolve<IAuthService>(DI_TOKENS.IAuthService)
const currentYear = new Date().getFullYear()

async function handleSubmit() {
  isLoading.value = true
  try {
    if (isRegister.value) {
      await authService.registerWithEmail({ email: email.value, password: password.value })
      // Initialize vault with same password
      await authStore.initializeVault(password.value)
      message.success('Conta criada com sucesso!')
    } else {
      await authService.signInWithEmail({ email: email.value, password: password.value })
      // Initialize vault with same password
      await authStore.initializeVault(password.value)
      message.success('Login realizado com sucesso!')
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ocorreu um erro na autenticação.'
    message.error(msg)
  } finally {
    isLoading.value = false
  }
}

async function handleGoogleLogin() {
  isLoading.value = true
  try {
    await authService.signInWithGoogle()
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ocorreu um erro ao conectar com Google.'
    message.error(msg)
  } finally {
    isLoading.value = false
  }
}
</script>
