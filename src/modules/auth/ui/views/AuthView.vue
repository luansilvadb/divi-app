<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton, NDivider, useMessage } from 'naive-ui'
import { SupabaseAuth } from '../../infrastructure/SupabaseAuth'

const authService = new SupabaseAuth()
const router = useRouter()
const message = useMessage()

const isLoginMode = ref(true)
const email = ref('')
const password = ref('')
const loading = ref(false)

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isLoginMode.value) {
      await authService.signInWithEmail({ email: email.value, password: password.value })
      router.push('/')
    } else {
      await authService.registerWithEmail({ email: email.value, password: password.value })
      message.success('Registro realizado com sucesso! Faça login.')
      isLoginMode.value = true
    }
  } catch (err: any) {
    message.error(err.message || 'Ocorreu um erro')
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    await authService.signInWithGoogle()
  } catch (err: any) {
    message.error('Erro ao entrar com Google')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
    <div class="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 p-10 shadow-2xl border border-zinc-200 dark:border-zinc-800">
      <h2 class="mb-8 text-center text-3xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight">
        {{ isLoginMode ? 'Entrar' : 'Criar Conta' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <label for="email" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">E-mail</label>
          <NInput
            id="email"
            v-model:value="email"
            type="text"
            placeholder="seu@email.com"
            required
            class="!rounded-xl"
            size="large"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="password" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Senha</label>
          <NInput
            id="password"
            v-model:value="password"
            type="password"
            show-password-on="mousedown"
            placeholder="Sua senha"
            required
            class="!rounded-xl"
            size="large"
          />
        </div>

        <NButton
          attr-type="submit"
          type="primary"
          :loading="loading"
          class="mt-4 w-full !h-12 !rounded-xl font-bold shadow-lg shadow-violet-500/20"
        >
          {{ isLoginMode ? 'Entrar' : 'Registrar' }}
        </NButton>
      </form>

      <NDivider title-placement="center">
        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">ou</span>
      </NDivider>

      <NButton
        type="default"
        ghost
        class="w-full !h-12 !rounded-xl font-bold"
        @click="handleGoogleLogin"
      >
        <template #icon><i class="i-lucide-chrome"></i></template>
        Continuar com Google
      </NButton>

      <div class="mt-8 text-center text-sm">
        <button
          class="text-zinc-500 hover:text-violet-500 font-bold border-none bg-transparent cursor-pointer transition-colors"
          @click.prevent="toggleMode"
        >
          {{ isLoginMode ? 'Não tem conta? Registre-se' : 'Já tem conta? Faça login' }}
        </button>
      </div>
    </div>
  </div>
</template>
