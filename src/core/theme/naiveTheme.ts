import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * Divi Finance – Naive UI Theme System
 * Premium design tokens with AI-native aesthetics.
 */

const fontFamily = 'Inter, SF Pro, system-ui, -apple-system, sans-serif'
const borderRadius = '12px'
const borderRadiusLg = '16px'

export const commonTheme: GlobalThemeOverrides['common'] = {
  fontFamily,
  fontFamilyMono: 'JetBrains Mono, monospace',
  borderRadius,
  primaryColor: '#8b5cf6',
  primaryColorHover: '#a78bfa',
  primaryColorPressed: '#7c3aed',
  primaryColorSuppl: '#8b5cf6',
  infoColor: '#0ea5e9',
  infoColorHover: '#38bdf8',
  infoColorPressed: '#0284c7',
  successColor: '#10b981',
  successColorHover: '#34d399',
  successColorPressed: '#059669',
  warningColor: '#f59e0b',
  warningColorHover: '#fbbf24',
  warningColorPressed: '#d97706',
  errorColor: '#ef4444',
  errorColorHover: '#f87171',
  errorColorPressed: '#dc2626',
  fontSizeSmall: '13px',
  fontSizeMedium: '14px',
  fontSizeLarge: '15px',
  heightSmall: '32px',
  heightMedium: '40px',
  heightLarge: '48px',
}

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    ...commonTheme,
    bodyColor: '#f9fafb',
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    tableColor: '#ffffff',
    borderColor: '#e5e7eb',
    dividerColor: '#e5e7eb',
    inputColor: '#f4f4f5',
    hoverColor: '#f4f4f5',
    textColorBase: '#18181b',
    textColor1: '#27272a',
    textColor2: '#3f3f46',
    textColor3: '#71717a',
    placeholderColor: '#a1a1aa',
  },
  Card: {
    borderRadius: borderRadiusLg,
    paddingMedium: '20px 24px',
    paddingLarge: '24px 28px',
    titleFontSizeMedium: '16px',
    titleFontWeight: '700',
    color: '#ffffff',
    colorModal: '#ffffff',
  },
  Button: {
    borderRadiusMedium: borderRadius,
    borderRadiusSmall: '10px',
    borderRadiusLarge: '14px',
    fontWeight: '600',
    fontSizeMedium: '14px',
    paddingMedium: '0 20px',
  },
  Input: {
    borderRadius,
    heightMedium: '40px',
    heightLarge: '48px',
    color: '#f4f4f5',
    colorFocus: '#ffffff',
    border: '1px solid #e5e7eb',
    borderFocus: '1px solid #8b5cf6',
    boxShadowFocus: '0 0 0 2px rgba(139, 92, 246, 0.15)',
  },
  Statistic: {
    valueFontSize: '28px',
    labelFontSize: '12px',
  },
  Tag: {
    borderRadius: '8px',
    fontSizeSmall: '11px',
    fontSizeMedium: '12px',
    heightSmall: '22px',
    heightMedium: '28px',
  },
  Progress: {
    railHeight: '8px',
    borderRadius: '999px',
  },
  Empty: {
    iconSizeMedium: '48px',
    textColor: '#a1a1aa',
    iconColor: '#d4d4d8',
  },
  Tabs: {
    tabFontWeightActive: '700',
    tabFontSizeMedium: '13px',
    tabGapMediumSegment: '0px',
    colorSegment: '#f4f4f5',
    tabBorderRadius: '10px',
  },
  Menu: {
    borderRadius: '12px',
    itemHeight: '44px',
    fontSize: '14px',
    itemColorActive: 'rgba(139, 92, 246, 0.1)',
    itemTextColorActive: '#8b5cf6',
    itemIconColorActive: '#8b5cf6',
    itemColorHover: 'rgba(228, 228, 231, 0.5)',
  },
  Divider: {
    color: '#e5e7eb',
  },
  List: {
    borderRadius,
    fontSize: '14px',
  },
  Spin: {
    sizeMedium: '28px',
  },
  Dialog: {
    borderRadius: borderRadiusLg,
    padding: '28px',
  },
  Drawer: {
    borderRadius: '0px',
  },
  Pagination: {
    itemBorderRadius: '10px',
  },
}

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    ...commonTheme,
    bodyColor: '#09090b',
    cardColor: '#18181b',
    modalColor: '#18181b',
    popoverColor: '#18181b',
    tableColor: '#18181b',
    borderColor: '#27272a',
    dividerColor: '#27272a',
    inputColor: '#09090b',
    hoverColor: '#27272a',
    textColorBase: '#fafafa',
    textColor1: '#f4f4f5',
    textColor2: '#e4e4e7',
    textColor3: '#a1a1aa',
    placeholderColor: '#52525b',
  },
  Card: {
    borderRadius: borderRadiusLg,
    paddingMedium: '20px 24px',
    paddingLarge: '24px 28px',
    titleFontSizeMedium: '16px',
    titleFontWeight: '700',
    color: 'rgba(24, 24, 27, 0.8)',
    colorModal: '#18181b',
    borderColor: 'rgba(39, 39, 42, 0.5)',
  },
  Button: {
    borderRadiusMedium: borderRadius,
    borderRadiusSmall: '10px',
    borderRadiusLarge: '14px',
    fontWeight: '600',
    fontSizeMedium: '14px',
    paddingMedium: '0 20px',
  },
  Input: {
    borderRadius,
    heightMedium: '40px',
    heightLarge: '48px',
    color: '#09090b',
    colorFocus: '#18181b',
    border: '1px solid #27272a',
    borderFocus: '1px solid #8b5cf6',
    boxShadowFocus: '0 0 0 2px rgba(139, 92, 246, 0.2)',
  },
  Statistic: {
    valueFontSize: '28px',
    labelFontSize: '12px',
  },
  Tag: {
    borderRadius: '8px',
    fontSizeSmall: '11px',
    fontSizeMedium: '12px',
    heightSmall: '22px',
    heightMedium: '28px',
  },
  Progress: {
    railHeight: '8px',
    borderRadius: '999px',
  },
  Empty: {
    iconSizeMedium: '48px',
    textColor: '#71717a',
    iconColor: '#3f3f46',
  },
  Tabs: {
    tabFontWeightActive: '700',
    tabFontSizeMedium: '13px',
    tabGapMediumSegment: '0px',
    colorSegment: '#27272a',
    tabBorderRadius: '10px',
  },
  Menu: {
    borderRadius: '12px',
    itemHeight: '44px',
    fontSize: '14px',
    itemColorActive: 'rgba(139, 92, 246, 0.15)',
    itemTextColorActive: '#8b5cf6',
    itemIconColorActive: '#8b5cf6',
    itemColorHover: 'rgba(39, 39, 42, 0.5)',
  },
  Divider: {
    color: '#27272a',
  },
  List: {
    borderRadius,
    fontSize: '14px',
  },
  Spin: {
    sizeMedium: '28px',
  },
  Dialog: {
    borderRadius: borderRadiusLg,
    padding: '28px',
  },
  Drawer: {
    borderRadius: '0px',
  },
  Pagination: {
    itemBorderRadius: '10px',
  },
}
