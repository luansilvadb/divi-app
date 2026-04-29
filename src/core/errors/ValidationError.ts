import { DomainError } from './DomainError';

/**
 * Error thrown when validation fails.
 * Strictly adheres to Constitution Rule XII.
 */
export class ValidationError extends DomainError {
  constructor(message: string, details?: unknown) {
    super('ERR_V001', message, details);
    this.name = 'ValidationError';
  }
}
