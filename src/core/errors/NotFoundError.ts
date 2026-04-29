import { DomainError } from './DomainError';

/**
 * Error thrown when a resource is not found.
 * Strictly adheres to Constitution Rule XII.
 */
export class NotFoundError extends DomainError {
  constructor(message: string, details?: unknown) {
    super('ERR_N001', message, details);
    this.name = 'NotFoundError';
  }
}
