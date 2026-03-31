export class DomainError extends Error {
  constructor(
    message: string,
    public readonly originalError?: any,
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

export class InfrastructureError extends DomainError {
  constructor(message: string, originalError?: any) {
    super(message, originalError)
    this.name = 'InfrastructureError'
  }
}
