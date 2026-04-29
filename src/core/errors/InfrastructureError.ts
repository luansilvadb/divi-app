import { DomainError } from './DomainError';

/**
 * Error thrown when an infrastructure operation fails (e.g., database, network).
 * Strictly adheres to Constitution Rule XII.
 */
export class InfrastructureError extends DomainError {
  constructor(message: string, details?: unknown) {
    super('ERR_I001', message, details);
    this.name = 'InfrastructureError';
  }
}
