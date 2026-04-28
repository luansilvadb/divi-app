/**
 * API error handling utilities
 * Provides standardized error handling for API calls
 */
import { AppError, ApiError, toAppError } from '@/core/errors'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

/**
 * Standardizes API error responses
 */
export function handleApiError(error: unknown): ApiResponse<never> {
  const appError = toAppError(error)

  console.error('[API Error]', {
    code: appError.code,
    message: appError.message,
    stack: appError.stack,
  })

  return {
    success: false,
    error: appError.isOperational ? appError.message : 'An unexpected error occurred',
    code: appError.code,
  }
}

/**
 * Wraps async API calls with standardized error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage = 'Operation failed'
): Promise<ApiResponse<T>> {
  try {
    const data = await operation()
    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof AppError) {
      return handleApiError(error)
    }
    return handleApiError(new ApiError(errorMessage))
  }
}

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
