import { AppError } from '@/core/errors/AppError'

/**
 * Infrastructure error - for infrastructure-related failures (database, network, etc.)
 * @deprecated Use AppError directly or a more specific error subclass from '@/core/errors/AppError'
 */
export class InfrastructureError extends AppError {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message, 'INFRASTRUCTURE_ERROR', 500, true)
    this.name = 'InfrastructureError'
  }
}
