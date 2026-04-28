import { describe, it, expect } from 'vitest'
import {
  AppError,
  ValidationError,
  NotFoundError,
  AuthError,
  ApiError,
  isAppError,
  toAppError,
} from '../AppError'

describe('AppError', () => {
  describe('AppError base class', () => {
    it('should create error with default values', () => {
      const error = new AppError('Something went wrong')

      expect(error.message).toBe('Something went wrong')
      expect(error.code).toBe('APP_ERROR')
      expect(error.statusCode).toBe(500)
      expect(error.isOperational).toBe(true)
      expect(error.name).toBe('AppError')
    })

    it('should create error with custom values', () => {
      const error = new AppError('Custom error', 'CUSTOM_CODE', 400, false)

      expect(error.message).toBe('Custom error')
      expect(error.code).toBe('CUSTOM_CODE')
      expect(error.statusCode).toBe(400)
      expect(error.isOperational).toBe(false)
    })

    it('should maintain stack trace', () => {
      const error = new AppError('Test error')
      expect(error.stack).toBeDefined()
    })
  })

  describe('ValidationError', () => {
    it('should create with default message', () => {
      const error = new ValidationError()

      expect(error.message).toBe('Validation failed')
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.statusCode).toBe(400)
      expect(error.name).toBe('ValidationError')
    })

    it('should create with custom message', () => {
      const error = new ValidationError('Invalid email format')

      expect(error.message).toBe('Invalid email format')
    })
  })

  describe('NotFoundError', () => {
    it('should create with default resource', () => {
      const error = new NotFoundError()

      expect(error.message).toBe('Resource not found')
      expect(error.code).toBe('NOT_FOUND')
      expect(error.statusCode).toBe(404)
      expect(error.name).toBe('NotFoundError')
    })

    it('should create with custom resource', () => {
      const error = new NotFoundError('User')

      expect(error.message).toBe('User not found')
    })
  })

  describe('AuthError', () => {
    it('should create with default message', () => {
      const error = new AuthError()

      expect(error.message).toBe('Authentication failed')
      expect(error.code).toBe('AUTH_ERROR')
      expect(error.statusCode).toBe(401)
      expect(error.name).toBe('AuthError')
    })

    it('should create with custom message', () => {
      const error = new AuthError('Invalid credentials')

      expect(error.message).toBe('Invalid credentials')
    })
  })

  describe('ApiError', () => {
    it('should create with default values', () => {
      const error = new ApiError()

      expect(error.message).toBe('API request failed')
      expect(error.code).toBe('API_ERROR')
      expect(error.statusCode).toBe(500)
      expect(error.name).toBe('ApiError')
    })

    it('should create with custom values', () => {
      const error = new ApiError('Service unavailable', 503)

      expect(error.message).toBe('Service unavailable')
      expect(error.statusCode).toBe(503)
    })
  })

  describe('isAppError', () => {
    it('should return true for AppError instances', () => {
      expect(isAppError(new AppError('test'))).toBe(true)
      expect(isAppError(new ValidationError())).toBe(true)
      expect(isAppError(new NotFoundError())).toBe(true)
    })

    it('should return false for non-AppError values', () => {
      expect(isAppError(new Error('test'))).toBe(false)
      expect(isAppError('string')).toBe(false)
      expect(isAppError(null)).toBe(false)
      expect(isAppError(undefined)).toBe(false)
      expect(isAppError({})).toBe(false)
    })
  })

  describe('toAppError', () => {
    it('should return AppError as-is', () => {
      const original = new AppError('original')
      const converted = toAppError(original)

      expect(converted).toBe(original)
    })

    it('should convert Error to AppError', () => {
      const original = new Error('test error')
      const converted = toAppError(original)

      expect(converted).toBeInstanceOf(AppError)
      expect(converted.message).toBe('test error')
      expect(converted.code).toBe('UNKNOWN_ERROR')
      expect(converted.isOperational).toBe(false)
    })

    it('should convert string to AppError', () => {
      const converted = toAppError('string error')

      expect(converted).toBeInstanceOf(AppError)
      expect(converted.message).toBe('string error')
    })

    it('should convert other types to AppError', () => {
      const converted = toAppError(12345)

      expect(converted).toBeInstanceOf(AppError)
      expect(converted.message).toBe('12345')
    })
  })
})
