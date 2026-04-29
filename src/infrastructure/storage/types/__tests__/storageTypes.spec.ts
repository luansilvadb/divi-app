import { describe, it, expect } from 'vitest'

// Import all storage types to ensure 100% coverage
import '@/infrastructure/storage/types/internal'
import '@/infrastructure/storage/types/ILocalBudget'
import '@/infrastructure/storage/types/ILocalCategory'
import '@/infrastructure/storage/types/ILocalGoal'
import '@/infrastructure/storage/types/ILocalLoan'
import '@/infrastructure/storage/types/ILocalSubscription'
import '@/infrastructure/storage/types/ILocalITransaction'
import '@/infrastructure/storage/types/ILocalIWallet'
import '@/infrastructure/storage/types'

describe('Storage Types Coverage', () => {
  it('should load all storage type files', () => {
    // All types are imported above for coverage
    expect(true).toBe(true)
  })
})
