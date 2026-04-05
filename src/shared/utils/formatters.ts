/**
 * Centralized formatting utilities for the application.
 * All functions follow Brazilian (pt-BR) standards.
 */

// Reusable formatters for better performance
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const currencySignFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  signDisplay: 'always',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR')

const monthShortFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' })

const monthLongFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' })

const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

/**
 * Formats a date to long month name (e.g., "Janeiro")
 */
export function formatMonthLong(date: Date): string {
  return monthLongFormatter.format(date).replace(/^\w/, (c) => c.toUpperCase())
}

/**
 * Formats a date string to time (HH:MM)
 */
export function formatTime(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return timeFormatter.format(date)
}

/**
 * Formats a date to short month name (e.g., "JAN")
 */
export function formatMonthShort(date: Date): string {
  return monthShortFormatter.format(date).replace('.', '').toUpperCase()
}

/**
 * Formats a number as BRL currency (R$ 1.000,00)
 */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/**
 * Formats a number as BRL currency with sign always displayed (+R$ 1,00 or -R$ 1,00)
 */
export function formatCurrencySign(value: number): string {
  return currencySignFormatter.format(value)
}

/**
 * Formats an ISO date string to pt-BR date (DD/MM/YYYY)
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return dateFormatter.format(date)
}

/**
 * Formats a date string to a short representation (e.g., "12 MAR")
 */
export function formatDateShort(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'))
  const day = date.getDate().toString().padStart(2, '0')
  const month = monthShortFormatter.format(date).replace('.', '').toUpperCase()
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
