import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      obsidian: '#020617',
      navy: '#0A192F',
      gold: '#B45309',
      amber: '#F59E0B',
      slate: '#1E293B',
      war: '#991B1B',
      'war-hover': '#7F1D1D',
    },
    fontFamily: {
      inter: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
  },
  shortcuts: {
    // Buttons
    'btn-sovereign': 'px-4 py-2 bg-gold text-white font-semibold rounded-2px transition-all hover:bg-amber active:scale-95 disabled:opacity-50',
    'btn-tactical': 'px-4 py-2 bg-transparent border-1 border-slate text-slate font-medium rounded-2px hover:bg-slate/10 transition-colors',
    'btn-war': 'px-4 py-2 bg-war text-white font-bold rounded-2px uppercase tracking-wider hover:bg-war-hover transition-shadow',
    
    // Layout
    'cockpit-card': 'bg-navy border-1 border-slate p-4 shadow-lg rounded-2px',
    'grid-rigid': 'grid gap-1', // 1 unit = 4px in UnoCSS/Tailwind by default (0.25rem)
  },
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
