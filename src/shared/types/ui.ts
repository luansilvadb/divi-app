/**
 * Common UI-related types and interfaces.
 */

export type UIStatus = 'normal' | 'success' | 'error' | 'warning' | 'info'

export interface SummaryItemProps {
  label: string
  value: string | number
  color?: string
  status?: UIStatus
}

