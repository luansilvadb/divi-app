export class DomainError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

export class InfrastructureError extends DomainError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError)
    this.name = 'InfrastructureError'
  }
}
