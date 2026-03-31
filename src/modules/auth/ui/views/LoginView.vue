<template>
  <div class="login-page">
    <!-- Noise texture overlay -->
    <div class="noise-overlay" aria-hidden="true"></div>

    <!-- Content -->
    <div class="login-content">
      <!-- Glass card -->
      <div class="login-card">
        <!-- Logo -->
        <div class="logo-container">
          <div class="logo-icon">
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
          <h1 class="logo-text">Divi</h1>
        </div>

        <!-- Tagline -->
        <p class="tagline">
          Suas finanças pessoais,<br />
          <span class="tagline-highlight">simplificadas.</span>
        </p>

        <!-- Feature pills -->
        <div class="feature-pills">
          <span class="pill">
            <svg class="pill-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            Controle total
          </span>
          <span class="pill">
            <svg class="pill-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            Seguro
          </span>
          <span class="pill">
            <svg class="pill-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              />
            </svg>
            Rápido
          </span>
        </div>

        <!-- Divider -->
        <div class="divider">
          <div class="divider-line"></div>
          <span class="divider-text">comece agora</span>
          <div class="divider-line"></div>
        </div>

        <!-- Google button -->
        <button id="login-google-btn" @click="handleLogin" :disabled="isLoading" class="google-btn">
          <div class="google-btn-content">
            <svg
              v-if="!isLoading"
              class="google-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            <div v-else class="spinner"></div>
            <span>{{ isLoading ? 'Conectando...' : 'Continuar com Google' }}</span>
          </div>
        </button>

        <!-- Terms -->
        <p class="terms">
          Ao continuar, você concorda com nossos<br />
          <a href="#" class="terms-link">Termos de Uso</a> e
          <a href="#" class="terms-link">Política de Privacidade</a>
        </p>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <span class="footer-text">Divi Finance © {{ currentYear }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAuthService } from '../domain/contracts/IAuthService'

const isLoading = ref(false)
const authService = container.resolve<IAuthService>(DI_TOKENS.AuthService)
const currentYear = new Date().getFullYear()

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
/* Page Layout */
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-bg-main);
}

/* Noise Overlay */
.noise-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.03;
  background-image: url("/assets/noise-overlay.svg");
  background-repeat: repeat;
  pointer-events: none;
}

/* Content Container */
.login-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 480px;
  animation: content-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes content-enter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* Glass Card */
.login-card {
  width: 100%;
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 8px 40px -12px rgba(0, 0, 0, 0.12),
    0 24px 56px -16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

:is(.dark) .login-card {
  background: rgba(22, 27, 34, 0.65);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 8px 40px -12px rgba(0, 0, 0, 0.5),
    0 24px 56px -16px rgba(0, 0, 0, 0.4);
}

/* Logo */
.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: logo-enter 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

@keyframes logo-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-icon {
  flex-shrink: 0;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
}

.logo-text {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(
    135deg,
    var(--color-primary-main) 0%,
    var(--color-secondary-main) 50%,
    var(--color-accent-main) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

/* Tagline */
.tagline {
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
  animation: tag-enter 1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
}

@keyframes tag-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tagline-highlight {
  font-weight: 700;
  color: var(--color-text-primary);
}

/* Feature Pills */
.feature-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: pills-enter 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
}

@keyframes pills-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.375rem 0.875rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

:is(.dark) .pill {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}

.pill:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

:is(.dark) .pill:hover {
  background: rgba(255, 255, 255, 0.1);
}

.pill-icon {
  width: 14px;
  height: 14px;
  color: var(--color-secondary-main);
  flex-shrink: 0;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  animation: divider-enter 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
}

@keyframes divider-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-main), transparent);
}

.divider-text {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-disabled);
  white-space: nowrap;
}

/* Google Button */
.google-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 0.875rem;
  border: 1px solid var(--color-border-main);
  background: var(--color-surface-main);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  animation: btn-enter 1s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
}

@keyframes btn-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.google-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary-main);
}

:is(.dark) .google-btn:hover:not(:disabled) {
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.5);
}

.google-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px -4px rgba(0, 0, 0, 0.1);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-btn-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.google-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid var(--color-border-main);
  border-top-color: var(--color-primary-main);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Terms */
.terms {
  font-size: 0.72rem;
  color: var(--color-text-disabled);
  text-align: center;
  line-height: 1.6;
  margin: 0;
  animation: terms-enter 1s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both;
}

@keyframes terms-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.terms-link {
  color: var(--color-text-secondary) !important;
  text-decoration: underline !important;
  text-decoration-color: rgba(0, 0, 0, 0.15) !important;
  text-underline-offset: 2px;
  transition:
    color 0.2s ease,
    text-decoration-color 0.2s ease;
}

:is(.dark) .terms-link {
  text-decoration-color: rgba(255, 255, 255, 0.15) !important;
}

.terms-link:hover {
  color: var(--color-primary-main) !important;
  text-decoration-color: var(--color-primary-main) !important;
}

/* Footer */
.login-footer {
  animation: footer-enter 1s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both;
}

@keyframes footer-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.footer-text {
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  letter-spacing: 0.02em;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
    border-radius: 1.25rem;
  }

  .logo-text {
    font-size: 1.875rem;
  }

  .tagline {
    font-size: 1rem;
  }

  .pill {
    font-size: 0.75rem;
    padding: 0.3rem 0.7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-content,
  .logo-container,
  .tagline,
  .feature-pills,
  .divider,
  .google-btn,
  .terms,
  .login-footer {
    animation: none !important;
  }
}
</style>
