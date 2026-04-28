/**
 * Base application error class
 * Provides standardized error handling across the application
 */
export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    code: string = 'APP_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * Validation error - for invalid input data
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 'VALIDATION_ERROR', 400, true)
    this.name = 'ValidationError'
  }
}

/**
 * Not found error - for missing resources
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404, true)
    this.name = 'NotFoundError'
  }
}

/**
 * Authentication error - for auth-related failures
 */
export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401, true)
    this.name = 'AuthError'
  }
}

/**
 * API error - for external API failures
 */
export class ApiError extends AppError {
  constructor(message: string = 'API request failed', statusCode: number = 500) {
    super(message, 'API_ERROR', statusCode, true)
    this.name = 'ApiError'
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Convert unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500, false)
  }

  return new AppError(String(error), 'UNKNOWN_ERROR', 500, false)
}
