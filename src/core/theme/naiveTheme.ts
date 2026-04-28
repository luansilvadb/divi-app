import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * Divi Design System — Naive UI Theme
 * Apple HIG-inspired. Single palette source — no token drift between modes.
 * Reference: openspec/changes/apple-design-system-refactor/
 */

// ─── Single Source of Truth — Apple Design System Colors ──────────────────
// Aligned with src/styles/design-tokens.css
const palette = {
  // Primary Action Blue (Apple HIG)
  blue:       { light: '#0071e3', dark: '#2997ff' }, // --color-apple-action / --color-apple-link-bright
  blueHover:  { light: '#0077ed', dark: '#47a9ff' }, // --color-apple-action-hover

  // Semantic Colors (Apple System) - Aligned with design-tokens.css
  green:      { light: '#34C759', dark: '#30D158' }, // --color-success
  greenHover: { light: '#2DB34E', dark: '#4ADB6C' }, // --color-success-hover
  orange:     { light: '#FF9500', dark: '#FF9F0A' }, // --color-warning
  orangeHover:{ light: '#E08500', dark: '#FFAC2A' }, // --color-warning-hover
  red:        { light: '#FF3B30', dark: '#FF453A' }, // --color-error
  redHover:   { light: '#E03530', dark: '#FF5E54' }, // --color-error-hover
  indigo:     { light: '#5856D6', dark: '#5E5CE6' }, // --color-info

  // Text — Apple HIG Typography Colors (Alpha Hierarchy)
  label:      { light: '#000000',             dark: '#FFFFFF'             }, // --text-label
  secondary:  { light: 'rgba(60,60,67,0.6)',  dark: 'rgba(235,235,245,0.6)' }, // --text-secondary
  tertiary:   { light: 'rgba(60,60,67,0.3)',  dark: 'rgba(235,235,245,0.3)' }, // --text-tertiary
  placeholder:{ light: 'rgba(60,60,67,0.3)',  dark: 'rgba(235,235,245,0.3)' }, // --text-disabled

  // Surfaces — Apple Neutral Canvas Triad + Graphite Scales
  background: { light: '#F2F2F7',  dark: '#000000'  }, // --surface-background (iOS grouped)
  card:       { light: '#FFFFFF',   dark: '#1C1C1E'  }, // --surface-primary
  cardNested: { light: '#F2F2F7',   dark: '#2C2C2E'  }, // --surface-secondary
  modal:      { light: '#FFFFFF',   dark: '#1C1C1E'  }, // --surface-primary
  popover:    { light: '#FFFFFF',   dark: '#2C2C2E'  }, // --surface-secondary

  // Borders / Separators — Apple Minimalist Containment
  separator:  { light: 'rgba(60, 60, 67, 0.12)',  dark: 'rgba(84,84,88,0.65)' }, // --surface-separator
  borderDefault: { light: '#d2d2d7', dark: '#3a3a3c' }, // Soft Border Gray - Apple standard input border
  borderHover: { light: '#6e6e73', dark: '#636366' }, // Secondary Neutral Gray - hover state
  borderFocus: { light: '#0071e3', dark: '#2997ff' }, // Apple Action Blue - focus state
  hover:      { light: 'rgba(0,0,0,0.02)',      dark: 'rgba(255,255,255,0.03)' }, // Subtle hover

  // Inputs — Translucent/White Backgrounds
  inputBg:    { light: '#FFFFFF',   dark: '#1C1C1E'  }, // --surface-primary
  inputFocus: { light: '#FFFFFF',   dark: '#2C2C2E'  }, // --surface-secondary

  // Focus Ring
  focusRing:  { light: 'rgba(0, 122, 255, 0.4)',  dark: 'rgba(10, 132, 255, 0.4)' }, // --surface-focus
} as const

// ─── Shared base (mode-independent) — Apple Typography ────────────────────
const fontFamily = '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

// Apple 8px Grid System Spacing Tokens - Aligned with design-tokens.css
const spacing = {
  xs: '4px',   // --space-1
  sm: '8px',   // --space-2
  md: '12px',  // --space-3
  lg: '16px',  // --space-4
  xl: '20px',  // --space-5
  xxl: '24px', // --space-6
  xxxl: '32px',// --space-8
} as const

const commonBase = {
  fontFamily,
  fontFamilyMono: '"SF Mono", "JetBrains Mono", ui-monospace, monospace',
  borderRadius: '8px', // --radius-md
  fontWeight: '500', // --font-medium
  letterSpacing: '-0.2px', // Tighter tracking for "machined" feel
  successColor: palette.green.light,
  successColorHover: palette.greenHover.light,
  successColorPressed: palette.green.light,
  warningColor: palette.orange.light,
  warningColorHover: palette.orangeHover.light,
  warningColorPressed: palette.orange.light,
  errorColor: palette.red.light,
  errorColorHover: palette.redHover.light,
  errorColorPressed: palette.red.light,
  fontSizeSmall: '13px', // --text-sm
  fontSizeMedium: '15px', // --text-base
  fontSizeLarge: '17px', // --text-lg
  heightSmall: '30px',
  heightMedium: '38px',
  heightLarge: '44px',
}

// ─── Light Theme ───────────────────────────────────────────────────────────
export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    ...commonBase,
    primaryColor: palette.blue.light,
    primaryColorHover: palette.blueHover.light,
    primaryColorPressed: palette.blue.light,
    primaryColorSuppl: palette.blue.light,
    infoColor: palette.indigo.light,
    infoColorHover: palette.indigo.light,
    infoColorPressed: palette.indigo.light,
    bodyColor: palette.background.light,
    cardColor: palette.card.light,
    modalColor: palette.modal.light,
    popoverColor: palette.popover.light,
    tableColor: palette.card.light,
    borderColor: 'transparent', // Rely on tonal contrast and separators
    dividerColor: palette.separator.light,
    inputColor: palette.inputBg.light,
    hoverColor: palette.hover.light,
    textColorBase: palette.label.light,
    textColor1: palette.label.light,
    textColor2: palette.secondary.light,
    textColor3: palette.tertiary.light,
    placeholderColor: palette.placeholder.light,
  },
  Card: {
    borderRadius: '16px', // Apple large card radius
    paddingMedium: `${spacing.xxl} ${spacing.xxxl}`, // 24px 32px
    paddingLarge: `${spacing.xxxl} ${spacing.xxxl}`, // 32px 32px
    titleFontSizeMedium: '15px',
    titleFontWeight: '600',
    color: palette.card.light,
    colorModal: palette.modal.light,
    borderColor: 'transparent', // Rely on tonal contrast
  },
  Button: {
    borderRadiusMedium: '980px', // Apple capsule geometry
    borderRadiusSmall: '8px',
    borderRadiusLarge: '12px',
    fontWeight: '600', // Apple semibold for actions
    fontSizeMedium: '14px',
    paddingMedium: `0 ${spacing.lg}`, // 0 16px
    colorPrimary: palette.blue.light,
    colorHoverPrimary: palette.blueHover.light,
    textColorPrimary: '#ffffff',
    border: 'none', // Remove border for cleaner look
    borderHover: 'none',
    borderFocus: 'none',
    borderPressed: 'none',
  },
  Input: {
    borderRadius: '12px', // --radius-lg
    heightMedium: '40px', // Touch-friendly height
    heightLarge: '48px',
    color: palette.inputBg.light,
    colorFocus: palette.inputFocus.light,
    border: `1px solid ${palette.borderDefault.light}`, // Soft Border Gray
    borderHover: `1px solid ${palette.borderHover.light}`, // Secondary Neutral Gray on hover
    borderFocus: `2px solid ${palette.borderFocus.light}`, // Apple Action Blue 2px on focus
    boxShadowFocus: `0 0 0 3px rgba(0, 113, 227, 0.2)`, // Apple focus ring
    boxShadow: 'none', // No default shadow
    placeholderColor: palette.placeholder.light,
    fontSize: '15px', // --text-base
    fontWeight: '400', // --font-normal
    letterSpacing: '-0.2px',
    transition: 'all 150ms cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth transition
  },
  Select: {
    peers: {
      InternalSelection: {
        borderRadius: '12px', // --radius-lg
        color: palette.inputBg.light,
        border: `1px solid ${palette.borderDefault.light}`, // Soft Border Gray
        borderHover: `1px solid ${palette.borderHover.light}`, // Secondary Neutral Gray on hover
        borderFocus: `2px solid ${palette.borderFocus.light}`, // Apple Action Blue 2px on focus
        boxShadowFocus: `0 0 0 3px rgba(0, 113, 227, 0.2)`, // Apple focus ring
      },
    },
  },
  DataTable: {
    fontSizeMedium: '13px', // --text-sm
    tdColor: palette.card.light,
    thColor: palette.background.light,
    thFontWeight: '600', // --font-semibold
    borderColor: 'transparent', // No borders - use tonal contrast
    borderRadius: '12px', // --radius-lg
  },
  Statistic: {
    valueFontSize: '26px',
    valueFontWeight: '700',
    labelFontSize: '12px',
    labelTextColor: palette.secondary.light,
  },
  Tag: {
    borderRadius: '6px',
    fontSizeSmall: '11px',
    fontSizeMedium: '12px',
    heightSmall: '20px',
    heightMedium: '24px',
  },
  Progress: {
    railHeight: '6px',
    borderRadius: '999px',
    railColor: palette.separator.light,
  },
  Empty: {
    iconSizeMedium: '44px',
    textColor: palette.tertiary.light,
    iconColor: palette.tertiary.light,
  },
  Tabs: {
    tabFontWeightActive: '600',
    tabFontSizeMedium: '13px',
    tabGapMediumSegment: '0px',
    colorSegment: palette.hover.light,
    tabBorderRadius: '8px',
    tabTextColorActive: palette.blue.light,
    tabTextColorActiveLine: palette.blue.light,
  },
  Menu: {
    borderRadius: '10px',
    itemHeight: '44px',
    fontSize: '14px',
    itemColorActive: palette.blue.light + '14',
    itemTextColorActive: palette.blue.light,
    itemIconColorActive: palette.blue.light,
    itemColorHover: palette.hover.light,
    itemTextColorHover: palette.label.light,
    groupTitleFontSize: '10px',
    groupTitleFontWeight: '700',
    groupTitleTextColor: palette.tertiary.light,
  },
  Divider: {
    color: palette.separator.light,
  },
  List: {
    borderRadius: '10px',
    fontSize: '14px',
    color: palette.card.light,
    borderColor: 'transparent', // No borders - rely on background separation
  },
  Spin: {
    sizeMedium: '24px',
    color: palette.blue.light,
  },
  Dialog: {
    borderRadius: '20px', // Apple large modal radius
    padding: `${spacing.xxxl}`, // 32px
    color: palette.modal.light,
  },
  Drawer: {
    borderRadius: '0px',
    color: palette.card.light,
  },
  Pagination: {
    itemBorderRadius: '8px',
    itemColor: 'transparent',
    itemColorActive: palette.blue.light + '14',
    itemTextColorActive: palette.blue.light,
  },
  Checkbox: {
    borderRadius: '4px',
    color: palette.blue.light,
  },
  Radio: {
    color: palette.blue.light,
  },
  Switch: {
    railColor: palette.separator.light,
    railColorActive: palette.blue.light,
  },
  DatePicker: {
    borderRadius: '12px',
    calendarDividerColor: palette.separator.light,
    peers: {
      Input: {
        border: `1px solid ${palette.borderDefault.light}`,
        borderHover: `1px solid ${palette.borderHover.light}`,
        borderFocus: `2px solid ${palette.borderFocus.light}`,
        boxShadowFocus: `0 0 0 3px rgba(0, 113, 227, 0.2)`,
      },
    },
  },
  Form: {
    labelFontSizeTopMedium: '13px',
    labelFontWeight: '500',
    labelTextColor: palette.secondary.light,
    labelLetterSpacing: '-0.1px',
    feedbackFontSizeMedium: '12px',
  },
  Dropdown: {
    borderRadius: '12px',
    color: palette.popover.light,
    optionColorHover: palette.hover.light,
    optionTextColor: palette.label.light,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)', // Apple shadow for dropdown
    border: 'none', // Remove border - use shadow only
  },
  Notification: {
    borderRadius: '12px',
    color: palette.card.light,
  },
  Message: {
    borderRadius: '10px',
    color: palette.card.light,
  },
}

// ─── Dark Theme ─────────────────────────────────────────────────────────────
export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    ...commonBase,
    primaryColor: palette.blue.dark,
    primaryColorHover: palette.blueHover.dark,
    primaryColorPressed: palette.blue.dark,
    primaryColorSuppl: palette.blue.dark,
    infoColor: palette.indigo.dark,
    infoColorHover: palette.indigo.dark,
    infoColorPressed: palette.indigo.dark,
    successColor: palette.green.dark,
    successColorHover: palette.greenHover.dark,
    successColorPressed: palette.green.dark,
    warningColor: palette.orange.dark,
    warningColorHover: palette.orangeHover.dark,
    warningColorPressed: palette.orange.dark,
    errorColor: palette.red.dark,
    errorColorHover: palette.redHover.dark,
    errorColorPressed: palette.red.dark,
    bodyColor: palette.background.dark,
    cardColor: palette.card.dark,
    modalColor: palette.modal.dark,
    popoverColor: palette.popover.dark,
    tableColor: palette.card.dark,
    borderColor: 'transparent', // Rely on tonal contrast and separators
    dividerColor: palette.separator.dark,
    inputColor: palette.inputBg.dark,
    hoverColor: palette.hover.dark,
    textColorBase: palette.label.dark,
    textColor1: palette.label.dark,
    textColor2: palette.secondary.dark,
    textColor3: palette.tertiary.dark,
    placeholderColor: palette.placeholder.dark,
  },
  Card: {
    borderRadius: '16px', // Apple large card radius (consistent with light mode)
    paddingMedium: `${spacing.xxl} ${spacing.xxxl}`, // 24px 32px - increased vertical spacing
    paddingLarge: `${spacing.xxxl} ${spacing.xxxl}`, // 32px 32px
    titleFontSizeMedium: '15px',
    titleFontWeight: '600',
    color: palette.card.dark,
    colorModal: palette.modal.dark,
    borderColor: 'transparent', // Rely on tonal contrast
  },
  Button: {
    borderRadiusMedium: '980px', // Apple capsule geometry
    borderRadiusSmall: '8px',
    borderRadiusLarge: '12px',
    fontWeight: '600', // Apple semibold for actions
    fontSizeMedium: '14px',
    paddingMedium: `0 ${spacing.lg}`, // 0 16px
    colorPrimary: palette.blue.dark,
    colorHoverPrimary: palette.blueHover.dark,
    border: 'none', // Remove border for cleaner look
    borderHover: 'none',
    borderFocus: 'none',
    borderPressed: 'none',
  },
  Input: {
    borderRadius: '12px', // --radius-lg
    heightMedium: '40px', // Touch-friendly height
    heightLarge: '48px',
    color: palette.inputBg.dark,
    colorFocus: palette.inputFocus.dark,
    border: `1px solid ${palette.borderDefault.dark}`, // Soft Border Gray (dark)
    borderHover: `1px solid ${palette.borderHover.dark}`, // Secondary Neutral Gray on hover
    borderFocus: `2px solid ${palette.borderFocus.dark}`, // Apple Action Blue 2px on focus
    boxShadowFocus: `0 0 0 3px rgba(41, 151, 255, 0.2)`, // Apple focus ring (bright blue for dark mode)
    boxShadowHover: 'none', // No hover shadow
    boxShadow: 'none', // No default shadow
    placeholderColor: palette.placeholder.dark,
    fontSize: '15px', // --text-base
    fontWeight: '400', // --font-normal
    letterSpacing: '-0.2px',
    transition: 'all 150ms cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth transition
  },
  Select: {
    peers: {
      InternalSelection: {
        borderRadius: '12px', // --radius-lg
        color: palette.inputBg.dark,
        border: `1px solid ${palette.borderDefault.dark}`, // Soft Border Gray (dark)
        borderHover: `1px solid ${palette.borderHover.dark}`, // Secondary Neutral Gray on hover
        borderFocus: `2px solid ${palette.borderFocus.dark}`, // Apple Action Blue 2px on focus
        boxShadowFocus: `0 0 0 3px rgba(41, 151, 255, 0.2)`, // Apple focus ring (bright blue for dark mode)
      },
    },
  },
  DataTable: {
    fontSizeMedium: '13px', // --text-sm
    tdColor: palette.card.dark,
    thColor: palette.background.dark,
    thFontWeight: '600', // --font-semibold
    borderColor: 'transparent', // No borders - use tonal contrast
    borderRadius: '12px', // --radius-lg
  },
  Statistic: {
    valueFontSize: '26px',
    valueFontWeight: '700',
    labelFontSize: '12px',
    labelTextColor: palette.secondary.dark,
  },
  Tag: {
    borderRadius: '6px',
    fontSizeSmall: '11px',
    fontSizeMedium: '12px',
    heightSmall: '20px',
    heightMedium: '24px',
  },
  Progress: {
    railHeight: '6px',
    borderRadius: '999px',
    railColor: palette.separator.dark,
  },
  Empty: {
    iconSizeMedium: '44px',
    textColor: palette.tertiary.dark,
    iconColor: palette.tertiary.dark,
  },
  Tabs: {
    tabFontWeightActive: '600',
    tabFontSizeMedium: '13px',
    tabGapMediumSegment: '0px',
    colorSegment: palette.hover.dark,
    tabBorderRadius: '8px',
    tabTextColorActive: palette.blue.dark,
    tabTextColorActiveLine: palette.blue.dark,
  },
  Menu: {
    borderRadius: '10px',
    itemHeight: '44px',
    fontSize: '14px',
    itemColorActive: palette.blue.dark + '20',
    itemTextColorActive: palette.blue.dark,
    itemIconColorActive: palette.blue.dark,
    itemColorHover: palette.hover.dark,
    itemTextColorHover: palette.label.dark,
    groupTitleFontSize: '10px',
    groupTitleFontWeight: '700',
    groupTitleTextColor: palette.tertiary.dark,
  },
  Divider: {
    color: palette.separator.dark,
  },
  List: {
    borderRadius: '10px',
    fontSize: '14px',
    color: palette.card.dark,
    borderColor: 'transparent', // No borders - rely on background separation
  },
  Spin: {
    sizeMedium: '24px',
    color: palette.blue.dark,
  },
  Dialog: {
    borderRadius: '20px', // Apple large modal radius
    padding: `${spacing.xxxl}`, // 32px - increased spacing
    color: palette.modal.dark,
  },
  Drawer: {
    borderRadius: '0px',
    color: palette.card.dark,
  },
  Pagination: {
    itemBorderRadius: '8px',
    itemColor: 'transparent',
    itemColorActive: palette.blue.dark + '20',
    itemTextColorActive: palette.blue.dark,
  },
  Checkbox: {
    borderRadius: '4px',
    color: palette.blue.dark,
  },
  Radio: {
    color: palette.blue.dark,
  },
  Switch: {
    railColor: palette.separator.dark,
    railColorActive: palette.blue.dark,
  },
  DatePicker: {
    borderRadius: '12px',
    calendarDividerColor: palette.separator.dark,
    peers: {
      Input: {
        border: `1px solid ${palette.borderDefault.dark}`,
        borderHover: `1px solid ${palette.borderHover.dark}`,
        borderFocus: `2px solid ${palette.borderFocus.dark}`,
        boxShadowFocus: `0 0 0 3px rgba(41, 151, 255, 0.2)`,
      },
    },
  },
  Form: {
    labelFontSizeTopMedium: '13px',
    labelFontWeight: '500',
    labelTextColor: palette.secondary.dark,
    labelLetterSpacing: '-0.1px',
    feedbackFontSizeMedium: '12px',
  },
  Dropdown: {
    borderRadius: '12px', // Apple large radius
    color: palette.popover.dark,
    optionColorHover: palette.hover.dark,
    optionTextColor: palette.label.dark,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)', // Apple shadow for dropdown (dark)
    border: 'none', // Remove border - use shadow only
  },
  Notification: {
    borderRadius: '12px', // Apple large radius
    color: palette.card.dark,
  },
  Message: {
    borderRadius: '10px', // Apple standard radius
    color: palette.card.dark,
  },
}

// ─── Common Theme (Shared Base) ─────────────────────────────────────────────
/**
 * Shared base theme tokens used across light and dark modes.
 * Exported for testing and external consumption.
 */
export const commonTheme = {
  primaryColor: '#007AFF', // Apple System Blue (HIG standard)
  borderRadius: '6px',     // Apple small radius token (--radius-sm)
  fontFamily: '"Inter", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
} as const

