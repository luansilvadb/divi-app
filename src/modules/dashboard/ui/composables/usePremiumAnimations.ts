import { useMediaQuery } from '@vueuse/core'

/**
 * Composable para animações premium do dashboard
 * Fornece variants de animação com respeito automático a prefers-reduced-motion
 */
export function usePremiumAnimations() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  /**
   * Helper para criar transition object
   */
  const createTransition = (duration: number, ease: number[] | string = [0.16, 1, 0.3, 1], delay = 0) => ({
    type: 'spring' as const,
    stiffness: prefersReducedMotion.value ? 1000 : 100,
    damping: prefersReducedMotion.value ? 1000 : 15,
    delay: prefersReducedMotion.value ? 0 : delay,
  })

  /**
   * Animação de fade in simples
   */
  const fadeIn = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: createTransition(500),
    },
    leave: {
      opacity: 0,
      transition: { duration: 0 },
    },
  }

  /**
   * Animação de slide up com fade
   */
  const slideUp = {
    initial: { opacity: 0, y: 20 },
    enter: {
      opacity: 1,
      y: 0,
      transition: createTransition(500),
    },
    leave: {
      opacity: 0,
      y: -10,
      transition: { duration: 0 },
    },
  }

  /**
   * Animação de slide from left
   */
  const slideFromLeft = {
    initial: { opacity: 0, x: -20 },
    enter: {
      opacity: 1,
      x: 0,
      transition: createTransition(500),
    },
    leave: {
      opacity: 0,
      x: -10,
      transition: { duration: 0 },
    },
  }

  /**
   * Animação de scale in (para modais, popovers)
   */
  const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: createTransition(300),
    },
    leave: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0 },
    },
  }

  /**
   * Configuração de stagger para animações em cascata
   */
  function createStaggerVariants(baseDelay = 0, staggerDelay = 50) {
    return {
      initial: { opacity: 0, y: 20 },
      enter: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: createTransition(500, [0.16, 1, 0.3, 1], baseDelay + i * staggerDelay),
      }),
      leave: {
        opacity: 0,
        y: -10,
        transition: { duration: 0 },
      },
    }
  }

  /**
   * Variants específicos para cards do dashboard
   */
  const cardStagger = createStaggerVariants(100, 50)

  /**
   * Transição entre estados (loading -> data -> empty)
   */
  const crossFade = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: createTransition(300, [0.4, 0, 0.2, 1]),
    },
    leave: {
      opacity: 0,
      transition: { duration: 0 },
    },
  }

  /**
   * Animação de contador (para estatísticas)
   */
  const countUp = {
    initial: { opacity: 0, scale: 0.8 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: createTransition(600),
    },
  }

  /**
   * Animação para tooltips
   */
  const tooltip = {
    initial: { opacity: 0, scale: 0.95, y: 5 },
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: createTransition(200),
    },
    leave: {
      opacity: 0,
      scale: 0.95,
      y: 5,
      transition: { duration: 0 },
    },
  }

  /**
   * Animação de pulse sutil (para indicadores ativos)
   */
  const pulse = {
    initial: { scale: 1 },
    enter: {
      scale: prefersReducedMotion.value ? 1 : [1, 1.02, 1],
      transition: {
        duration: prefersReducedMotion.value ? 0 : 2000,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return {
    // Variants individuais
    fadeIn,
    slideUp,
    slideFromLeft,
    scaleIn,
    crossFade,
    countUp,
    tooltip,
    pulse,

    // Funções utilitárias
    createStaggerVariants,
    cardStagger,

    // Estado
    prefersReducedMotion,
  }
}

export type UsePremiumAnimationsReturn = ReturnType<typeof usePremiumAnimations>
