import { describe, it, expect, vi, beforeEach } from 'vitest'
import { container } from '../../di'
import type { IAuthService } from '../../../modules/auth/domain/contracts/IAuthService'
import type { User } from '../../../modules/auth/domain/entities/User'
import router from '../index'

// Mock the router's internal components to avoid import errors in tests
vi.mock('../../../modules/dashboard/ui/views/DashboardView.vue', () => ({ default: {} }))
vi.mock('../../../modules/auth/ui/views/LoginView.vue', () => ({ default: {} }))

vi.mock('../../di', () => ({
  container: {
    resolve: vi.fn(),
  },
}))

describe('Router Auth Guards', () => {
  let mockAuthService: IAuthService

  beforeEach(() => {
    vi.clearAllMocks()

    mockAuthService = {
      getCurrentUser: vi.fn(),
    } as unknown as IAuthService

    vi.mocked(container.resolve).mockReturnValue(mockAuthService)
  })

  it('should redirect to login if route requires auth and no user is present', async () => {
    vi.mocked(mockAuthService.getCurrentUser).mockResolvedValue(null)

    await router.push('/') // '/' requires auth (dashboard)
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('should redirect to dashboard if route is guestOnly and user is logged in', async () => {
    vi.mocked(mockAuthService.getCurrentUser).mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      name: 'Test',
    } as User)

    await router.push({ path: '/login', query: { redirect: 'true' } }) // '/login' is guestOnly
    expect(router.currentRoute.value.name).toBe('dashboard')
  })
})
