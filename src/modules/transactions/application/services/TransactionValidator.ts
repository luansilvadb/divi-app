import { ValidationError } from '@/core/errors'

export interface ValidationContext {
  field: string
  value: unknown
  params: Record<string, unknown>
}

export interface ValidationRule {
  name: string
  validate: (context: ValidationContext) => boolean | string
}

/**
 * Extensible transaction validator supporting custom rules (OCP).
 * New validation rules can be added without modifying core code.
 */
export class TransactionValidator {
  private _rules: Map<string, ValidationRule> = new Map()

  constructor() {
    // Register default required field validator
    this.registerRule({
      name: 'required',
      validate: (context) => {
        const value = context.value
        if (value === undefined || value === null || value === '') {
          return `Missing required field: ${context.field}`
        }
        return true
      },
    })

    // Register default type validator for transactions
    this.registerRule({
      name: 'transactionType',
      validate: (context) => {
        const validTypes = ['income', 'expense', 'transfer']
        if (!validTypes.includes(context.value as string)) {
          return `Invalid transaction type: ${context.value}`
        }
        return true
      },
    })

    // Register positive amount validator
    this.registerRule({
      name: 'positiveAmount',
      validate: (context) => {
        const amount = context.value
        if (typeof amount === 'number' && amount <= 0) {
          return 'Amount must be positive'
        }
        if (typeof amount === 'string' && parseFloat(amount) <= 0) {
          return 'Amount must be positive'
        }
        return true
      },
    })
  }

  /**
   * Register a custom validation rule.
   * Extension point for OCP - new rules can be added without modifying this class.
   */
  registerRule(rule: ValidationRule): void {
    this._rules.set(rule.name, rule)
  }

  /**
   * Validate a field against a registered rule.
   */
  validate(ruleName: string, context: ValidationContext): void {
    const rule = this._rules.get(ruleName)
    if (!rule) {
      throw new ValidationError(`Unknown validation rule: ${ruleName}`)
    }

    const result = rule.validate(context)
    if (result !== true) {
      throw new ValidationError(typeof result === 'string' ? result : `Validation failed for ${context.field}`)
    }
  }

  /**
   * Check if a rule is registered.
   */
  hasRule(name: string): boolean {
    return this._rules.has(name)
  }

  /**
   * Get all registered rule names.
   */
  getRegisteredRules(): string[] {
    return Array.from(this._rules.keys())
  }
}

// Global validator instance
export const transactionValidator = new TransactionValidator()
