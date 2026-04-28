/**
 * Base class for all domain-specific errors.
 * Strictly adheres to Constitution Rule XII.
 */
export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  /**
   * @param code A semantic error code (e.g., ERR_E001)
   * @param message A human-readable message (internal use or fallback)
   * @param details Additional context for debugging or UI display
   */
  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    
    // Ensure the prototype is set correctly for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
