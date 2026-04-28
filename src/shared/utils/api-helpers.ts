import { toAppError } from '@/core/errors'

/**
 * Creates a user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const appError = toAppError(error)

  if (!appError.isOperational) {
    return 'An unexpected error occurred. Please try again later.'
  }

  return appError.message
}
