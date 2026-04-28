import { vi } from 'vitest'

export const useRegisterSW = () => ({
  needRefresh: { value: false },
  offlineReady: { value: false },
  updateServiceWorker: vi.fn(),
})
