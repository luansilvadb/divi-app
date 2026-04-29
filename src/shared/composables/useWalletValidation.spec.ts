import { describe, it, expect } from 'vitest'
import { useWalletValidation } from './useWalletValidation'

describe('useWalletValidation', () => {
  it('initializes with default values', () => {
    const { form } = useWalletValidation()
    expect(form.name).toBe('')
    expect(form.balance).toBeNull()
    expect(form.currency).toBe('BRL')
  })

  it('initializes with provided data', () => {
    const initialData = { name: 'Test Wallet', balance: 100, currency: 'USD' }
    const { form } = useWalletValidation(initialData)
    expect(form.name).toBe('Test Wallet')
    expect(form.balance).toBe(100)
    expect(form.currency).toBe('USD')
  })

  it('resets form correctly', () => {
    const { form, resetForm } = useWalletValidation({ name: 'Test', balance: 10, currency: 'EUR' })
    resetForm()
    expect(form.name).toBe('')
    expect(form.balance).toBeNull()
    expect(form.currency).toBe('BRL')
  })

  it('sets form data correctly', () => {
    const { form, setForm } = useWalletValidation()
    setForm({ name: 'New Name', balance: 50, currency: 'USD' })
    expect(form.name).toBe('New Name')
    expect(form.balance).toBe(50)
    expect(form.currency).toBe('USD')
  })
})
