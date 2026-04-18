import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * Divi Finance – Naive UI Theme System
 * Premium design tokens with AI-native aesthetics.
 */

const fontFamily = 'Inter, SF Pro, system-ui, -apple-system, sans-serif'
const borderRadius = '2px'
const borderRadiusLg = '4px'

export const commonTheme: GlobalThemeOverrides['common'] = {
  fontFamily,
  fontFamilyMono: 'JetBrains Mono, monospace',
  borderRadius,
  primaryColor: '#B45309', // Muted Gold
  primaryColorHover: '#D97706',
  primaryColorPressed: '#92400E',
  primaryColorSuppl: '#B45309',
  infoColor: '#0A192F', // Deep Navy
  infoColorHover: '#1E293B',
  infoColorPressed: '#020617',
  successColor: '#10b981',
  successColorHover: '#34d399',
  successColorPressed: '#059669',
  warningColor: '#F59E0B', // Tactical Amber
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
    bodyColor: '#020617', // Obsidian Black
    cardColor: '#0A192F', // Deep Navy
    modalColor: '#0A192F',
    popoverColor: '#0A192F',
    tableColor: '#0A192F',
    borderColor: '#1E293B', // Slate Gray
    dividerColor: '#1E293B',
    inputColor: '#020617',
    hoverColor: '#1E293B',
    textColorBase: '#fafafa',
    textColor1: '#f4f4f5',
    textColor2: '#e4e4e7',
    textColor3: '#a1a1aa',
    placeholderColor: '#475569',
  },
  Card: {
    borderRadius: borderRadiusLg,
    paddingMedium: '16px 20px',
    paddingLarge: '20px 24px',
    titleFontSizeMedium: '16px',
    titleFontWeight: '600',
    color: '#0A192F',
    colorModal: '#0A192F',
    borderColor: '#1E293B',
  },
  Button: {
    borderRadiusMedium: borderRadius,
    borderRadiusSmall: '2px',
    borderRadiusLarge: '4px',
    fontWeight: '600',
    fontSizeMedium: '14px',
    paddingMedium: '0 16px',
  },
  DataTable: {
    fontSizeMedium: '13px',
    tdColor: '#0A192F',
    thColor: '#020617',
    thFontWeight: '700',
    borderColor: '#1E293B',
  },
  Input: {
    borderRadius,
    heightMedium: '36px',
    heightLarge: '44px',
    color: '#020617',
    colorFocus: '#0A192F',
    border: '1px solid #1E293B',
    borderFocus: '1px solid #B45309',
    boxShadowFocus: 'none',
  },
  Statistic: {
    valueFontSize: '24px',
    labelFontSize: '12px',
    valueFontWeight: '700',
  },
  Tag: {
    borderRadius: '2px',
    fontSizeSmall: '11px',
    fontSizeMedium: '12px',
    heightSmall: '20px',
    heightMedium: '24px',
  },
  Progress: {
    railHeight: '4px',
    borderRadius: '0px',
  },
  Empty: {
    iconSizeMedium: '48px',
    textColor: '#475569',
    iconColor: '#1E293B',
  },
  Tabs: {
    tabFontWeightActive: '700',
    tabFontSizeMedium: '13px',
    tabGapMediumSegment: '0px',
    colorSegment: '#1E293B',
    tabBorderRadius: '2px',
  },
  Menu: {
    borderRadius: '2px',
    itemHeight: '40px',
    fontSize: '14px',
    itemColorActive: 'rgba(180, 83, 9, 0.15)',
    itemTextColorActive: '#B45309',
    itemIconColorActive: '#B45309',
    itemColorHover: 'rgba(30, 41, 59, 0.5)',
  },
  Divider: {
    color: '#1E293B',
  },
  List: {
    borderRadius,
    fontSize: '14px',
  },
  Spin: {
    sizeMedium: '24px',
  },
  Dialog: {
    borderRadius: borderRadiusLg,
    padding: '24px',
  },
  Drawer: {
    borderRadius: '0px',
  },
  Pagination: {
    itemBorderRadius: '2px',
  },
}
