/**
 * Centralized formatting utilities for the application.
 * All functions follow Brazilian (pt-BR) standards.
 */

/** Number of cents per monetary unit (e.g., 100 cents = R$ 1,00) */
const CENTS_PER_UNIT = 100

function fromCents(value: bigint): number {
  return Number(value) / CENTS_PER_UNIT
}

export function formatCurrency(value: number | bigint): string {
  const num = typeof value === 'bigint' ? fromCents(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

export function formatCurrencySign(value: number | bigint): string {
  const num = typeof value === 'bigint' ? fromCents(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    signDisplay: 'always',
  }).format(num)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'))
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
  return `${day} ${month}`
}

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
