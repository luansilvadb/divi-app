/**
 * Centralized formatting utilities for the application.
 * All functions follow Brazilian (pt-BR) standards.
 */

/**
 * Formats a number as BRL currency (R$ 1.000,00)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formats a number as BRL currency with sign always displayed (+R$ 1,00 or -R$ 1,00)
 */
export function formatCurrencySign(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    signDisplay: 'always',
  }).format(value)
}

/**
 * Formats an ISO date string to pt-BR date (DD/MM/YYYY)
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

/**
 * Formats a date string to a short representation (e.g., "12 MAR")
 */
export function formatDateShort(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'))
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
  return `${day} ${month}`
}

/**
 * Get human-friendly relative date day (Hoje, Ontem, or DD)
 */
export function getRelativeDayLabel(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'))
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)

  if (checkDate.getTime() === today.getTime()) return 'Hoje'
  if (checkDate.getTime() === yesterday.getTime()) return 'Ontem'

  return date.getDate().toString().padStart(2, '0')
}
