export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

export function parseDate(value: string | number | Date | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

export function parseNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const num = typeof value === 'number' ? value : parseFloat(value)
  return isNaN(num) ? null : num
}

export function parseBoolean(value: string | number | boolean | null | undefined): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1'
  }
  return false
}

export function extractInitials(name: string, maxInitials = 2): string {
  if (!name) return ''
  return (name.match(/\b\w/g) || []).slice(0, maxInitials).join('').toUpperCase()
}

export function normalizeString(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
