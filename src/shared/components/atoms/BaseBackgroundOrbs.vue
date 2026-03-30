<template>
  <div class="base-background-orbs" aria-hidden="true">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
</template>

<style scoped>
.base-background-orbs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: -2;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  will-change: transform;
}

:is(.dark) .orb {
  opacity: 0.10;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--color-primary-main);
  top: -10%;
  right: -10%;
  animation: float-1 20s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--color-secondary-main);
  bottom: -20%;
  left: -5%;
  animation: float-2 25s ease-in-out infinite;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: var(--color-accent-main);
  top: 40%;
  left: 30%;
  animation: float-3 22s ease-in-out infinite;
  opacity: 0.08;
}

@keyframes float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.05); }
  66% { transform: translate(20px, -40px) scale(0.95); }
}

@keyframes float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.9); }
}

@keyframes float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, 20px) scale(1.1); }
}

@media (prefers-reduced-motion: reduce) {
  .orb {
    animation: none !important;
    transform: none !important;
  }
}
</style>
