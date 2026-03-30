export class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'DomainError'
  }
}

export class InfrastructureError extends Error {
  constructor(message: string, public readonly originalError: unknown) {
    super(message)
    this.name = 'InfrastructureError'
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}
