import { AppError } from './AppError'

export class InfrastructureError extends AppError {
  constructor(message: string, public readonly originalError?: any) {
    super(message, 'INFRASTRUCTURE_ERROR', 500, false)
    this.name = 'InfrastructureError'
  }
}
