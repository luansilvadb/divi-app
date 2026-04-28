export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value > 0
}

export function isValidInteger(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && Number.isInteger(value)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPastDate(date: Date | string | number): boolean {
  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) return false
  return parsedDate <= new Date()
}

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function hasRequiredProperties<T extends Record<string, unknown>>(
  obj: T,
  required: (keyof T)[]
): boolean {
  return required.every((key) => key in obj && obj[key] !== undefined && obj[key] !== null)
}
