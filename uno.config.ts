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
      // ── Apple System Colors ─────────────────────────────────────────
      'system-blue':         '#007AFF',
      'system-blue-dark':    '#0A84FF',
      'system-green':        '#34C759',
      'system-green-dark':   '#30D158',
      'system-red':          '#FF3B30',
      'system-red-dark':     '#FF453A',
      'system-orange':       '#FF9500',
      'system-orange-dark':  '#FF9F0A',
      'system-indigo':       '#5856D6',
      'system-indigo-dark':  '#5E5CE6',
      'system-purple':       '#AF52DE',
      'system-purple-dark':  '#BF5AF2',

      // ── App Surfaces — Light / Dark ──────────────────────────────────
      'app-bg':              '#F2F2F7',   // grouped background
      'app-bg-dark':         '#000000',   // iOS dark system bg
      'card-bg':             '#FFFFFF',   // primary card
      'card-bg-dark':        '#1C1C1E',   // secondary system bg
      'card-nested':         '#F2F2F7',   // nested inside card
      'card-nested-dark':    '#2C2C2E',   // tertiary system bg
      'card-deeper':         '#FFFFFF',
      'card-deeper-dark':    '#3A3A3C',

      // ── Separators ──────────────────────────────────────────────────
      'separator':           'rgba(60,60,67,0.12)',
      'separator-dark':      'rgba(84,84,88,0.65)',
      'separator-opaque':    '#C6C6C8',
      'separator-opaque-dark':'#38383A',

      // ── Neutral Text (alpha-based hierarchy) ─────────────────────────
      'label-1':             '#000000',
      'label-1-dark':        '#FFFFFF',
      'label-2':             'rgba(60,60,67,0.6)',
      'label-2-dark':        'rgba(235,235,245,0.6)',
      'label-3':             'rgba(60,60,67,0.3)',
      'label-3-dark':        'rgba(235,235,245,0.3)',
      'label-4':             'rgba(60,60,67,0.18)',
      'label-4-dark':        'rgba(235,235,245,0.18)',

      // ── Feedback — Error ─────────────────────────────────────────────
      'error-main':          '#FF3B30',
      'error-main-dark':     '#FF453A',
      'error-subtle':        'rgba(255,59,48,0.08)',
      'error-subtle-dark':   'rgba(255,69,58,0.12)',

      // ── Feedback — Success ───────────────────────────────────────────
      'success-main':        '#34C759',
      'success-main-dark':   '#30D158',
      'success-subtle':      'rgba(52,199,89,0.08)',
      'success-subtle-dark': 'rgba(48,209,88,0.12)',

      // ── Feedback — Info (Blue) ────────────────────────────────────────
      'info-main':           '#007AFF',
      'info-main-dark':      '#0A84FF',
      'info-subtle':         'rgba(0,122,255,0.08)',
      'info-subtle-dark':    'rgba(10,132,255,0.12)',

      // ── Feedback — Warning ───────────────────────────────────────────
      'warning-main':        '#FF9500',
      'warning-main-dark':   '#FF9F0A',
      'warning-subtle':      'rgba(255,149,0,0.08)',
      'warning-subtle-dark': 'rgba(255,159,10,0.12)',

      // ── Apple Design System Colors ───────────────────────────────────
      'apple-action':        '#0071e3',
      'apple-action-hover':  '#0066cc',
      'apple-link':          '#0066cc',
      'apple-link-bright':   '#2997ff',
      'apple-ink':           '#1d1d1f',
      'apple-secondary':     '#6e6e73',
      'apple-pale-gray':     '#f5f5f7',
      'apple-soft-border':   '#d2d2d7',
      'apple-mid-border':    '#86868b',
      'apple-graphite-a':    '#272729',
      'apple-graphite-b':    '#262629',
      'apple-graphite-c':    '#28282b',
      'apple-graphite-d':    '#2a2a2c',
    },
    fontFamily: {
      inter: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
      'sf-display': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'sf-text': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
  shortcuts: {
    // ── Surface Cards ─────────────────────────────────────────────────
    'bg-app':       'bg-app-bg dark:bg-app-bg-dark',
    'bg-card':      'bg-card-bg dark:bg-card-bg-dark',
    'bg-nested':    'bg-card-nested dark:bg-card-nested-dark',
    'card-surface': 'bg-card rounded-xl border border-separator dark:border-separator-dark',
    'card-grouped': 'bg-nested rounded-xl',
    'card-elevated':'bg-card rounded-xl shadow-sm dark:shadow-none border border-separator dark:border-separator-dark',

    // ── Semantic Text ─────────────────────────────────────────────────
    'text-primary-label': 'text-label-1 dark:text-label-1-dark',
    'text-muted':         'text-label-2 dark:text-label-2-dark',
    'text-dim':           'text-label-3 dark:text-label-3-dark',
    'text-faint':         'text-label-4 dark:text-label-4-dark',

    // ── Typography Scale ──────────────────────────────────────────────
    'text-caption':  'text-[11px] leading-[1.4]',
    'text-body-sm':  'text-[13px] leading-[1.5]',
    'text-body':     'text-[15px] leading-[1.6]',
    'text-heading':  'text-[17px] leading-[1.4]',
    'text-title':    'text-[20px] leading-[1.3]',
    'text-display':  'text-[24px] leading-[1.2]',

    // ── Typography Combos ─────────────────────────────────────────────
    'label-micro':   'text-[10px] font-bold uppercase tracking-widest text-label-3 dark:text-label-3-dark',
    'value-display': 'text-display font-bold tracking-tight tabular-nums text-label-1 dark:text-label-1-dark',
    'card-title':    'text-[15px] font-semibold tracking-tight text-label-1 dark:text-label-1-dark',

    // ── Separators ────────────────────────────────────────────────────
    'border-separator': 'border border-separator dark:border-separator-dark',
    'divide-apple':     'divide-y divide-separator dark:divide-separator-dark',

    // ── Animation Tokens — Apple Standard Easing ─────────────────────
    'duration-fast':   'duration-150',
    'duration-normal': 'duration-200',
    'duration-slow':   'duration-300',
    'ease-smooth':     'ease-out',
    'ease-bounce':     'ease-[cubic-bezier(0.16,1,0.3,1)]',

    // ── Transition Presets ────────────────────────────────────────────
    'transition-fast':   'transition-all duration-150 ease-out',
    'transition-normal': 'transition-all duration-200 ease-out',
    'hover-lift':        'transition-normal hover:-translate-y-0.5',
    'hover-scale':       'transition-fast hover:scale-105 active:scale-95',

    // ── Apple-style Buttons ───────────────────────────────────────────
    'btn-primary':   'px-4 py-2 bg-system-blue dark:bg-system-blue-dark text-white font-medium rounded-lg transition-fast hover:opacity-90 active:scale-95 disabled:opacity-40',
    'btn-secondary': 'px-4 py-2 bg-info-subtle dark:bg-info-subtle-dark text-system-blue dark:text-system-blue-dark font-medium rounded-lg transition-fast hover:bg-separator dark:hover:bg-separator-dark active:scale-95',
    'btn-ghost':     'px-4 py-2 bg-transparent text-system-blue dark:text-system-blue-dark font-medium rounded-lg transition-fast hover:bg-card-nested dark:hover:bg-card-nested-dark active:scale-95',
    'btn-danger':    'px-4 py-2 bg-error-subtle dark:bg-error-subtle-dark text-error-main dark:text-error-main-dark font-medium rounded-lg transition-fast hover:bg-[rgba(255,59,48,0.14)] active:scale-95',
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
