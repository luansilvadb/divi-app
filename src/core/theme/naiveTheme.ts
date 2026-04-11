import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * LobeHub Inspired Theme for Naive UI
 * Focuses on AI-Native aesthetics, vibrant colors, and modern shadows.
 */

export const commonTheme: GlobalThemeOverrides['common'] = {
  fontFamily: 'SF Pro, Inter, system-ui, sans-serif',
  borderRadius: '12px',
  primaryColor: '#8b5cf6', // Violet 500
  primaryColorHover: '#a78bfa',
  primaryColorPressed: '#7c3aed',
  primaryColorSuppl: '#8b5cf6',
  infoColor: '#0ea5e9', // Sky 500
  successColor: '#10b981', // Emerald 500
  warningColor: '#f59e0b', // Amber 500
  errorColor: '#ef4444', // Red 500
}

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    ...commonTheme,
    bodyColor: '#f9fafb',
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    borderColor: '#e5e7eb',
  },
  Card: {
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  Button: {
    borderRadiusMedium: '12px',
    fontWeight: '600',
  },
}

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    ...commonTheme,
    bodyColor: '#09090b', // Deep Dark
    cardColor: '#18181b', // Zinc 900
    modalColor: '#18181b',
    popoverColor: '#18181b',
    borderColor: '#27272a', // Zinc 800
    textColorBase: '#fafafa',
    textColor1: '#f4f4f5',
    textColor2: '#e4e4e7',
  },
  Card: {
    borderRadius: '16px',
    color: 'rgba(24, 24, 27, 0.8)', // Glass effect
    borderColor: 'rgba(39, 39, 42, 0.5)',
  },
  Button: {
    borderRadiusMedium: '12px',
    fontWeight: '600',
  },
  Input: {
    borderRadius: '12px',
    color: '#09090b',
  },
}
