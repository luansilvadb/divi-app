import { DomainError } from './DomainError';

/**
 * Error thrown when authentication or authorization fails.
 * Strictly adheres to Constitution Rule XII.
 */
export class AuthError extends DomainError {
  constructor(message: string, details?: unknown) {
    super('ERR_A001', message, details);
    this.name = 'AuthError';
  }
}
