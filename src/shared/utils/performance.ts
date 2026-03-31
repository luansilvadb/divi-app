/**
 * Utilitário para detecção de performance e recursos do sistema.
 */

export async function checkIsLowPowerMode(): Promise<boolean> {
  // 1. Verificação via Battery Status API (Principalmente Chromium)
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as unknown).getBattery()
      // Se não estiver carregando e a bateria estiver abaixo de 20%
      if (battery.charging === false && battery.level <= 0.2) {
        return true
      }
    } catch {
      // Ignora erro se a API falhar por permissão ou outro motivo
    }
  }

  // 2. Verificação de Preferência do Usuário (Reduced Motion)
  // Quase sempre indica economia de recursos ou necessidade de acessibilidade.
  if (isReducedMotionDetected()) {
    return true
  }

  // 3. Heurística de FPS (Detecta se o hardware está sofrendo ou em economia de energia)
  // Mede o tempo de resposta do requestAnimationFrame em uma janela curta de 100ms.
  return new Promise((resolve) => {
    let frameCount = 0
    const start = performance.now()

    const check = (now: number) => {
      frameCount++
      const elapsed = now - start

      if (elapsed >= 100) {
        const fps = (frameCount * 1000) / elapsed
        // Se o FPS for menor que 40 em uma janela de 100ms sem carga pesada aparente,
        // inferimos que o dispositivo está em modo de economia ou é hardware limitado.
        resolve(fps < 40)
      } else {
        requestAnimationFrame(check)
      }
    }

    requestAnimationFrame(check)
  })
}

/**
 * Detecta se o usuário prefere movimentos reduzidos (Configuração do SO).
 */
export function isReducedMotionDetected(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
