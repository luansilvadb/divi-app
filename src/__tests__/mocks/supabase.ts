/**
 * Mock factory for Supabase client
 * Provides mock implementations for Supabase auth and database operations
 */

import { vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>

export function createMockSupabaseClient() {
  const mockAuth = {
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  }

  const mockFrom = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    and: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    rpc: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue({ data: [], error: null }),
  })

  const mockRpc = vi.fn().mockResolvedValue({ data: null, error: null })

  const mockSupabase = {
    auth: mockAuth,
    from: mockFrom,
    rpc: mockRpc,
    schema: vi.fn().mockReturnValue({
      from: mockFrom,
    }),
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        download: vi.fn().mockResolvedValue({ data: null, error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
        list: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    },
    realtime: {
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
        unsubscribe: vi.fn(),
      }),
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  } as unknown as SupabaseClient

  return {
    client: mockSupabase,
    mockAuth,
    mockFrom,
    mockRpc,
    resetMocks: () => {
      mockAuth.getSession.mockClear()
      mockAuth.getUser.mockClear()
      mockAuth.signInWithPassword.mockClear()
      mockAuth.signUp.mockClear()
      mockAuth.signOut.mockClear()
      mockAuth.onAuthStateChange.mockClear()
      mockFrom.mockClear()
      mockRpc.mockClear()
    },
  }
}

export function createMockAuthSession(user = null) {
  return {
    data: {
      session: user
        ? {
            user,
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
            expires_at: Date.now() + 3600000,
          }
        : null,
    },
    error: null,
  }
}

export function createMockUser(overrides = {}) {
  return {
    id: 'mock-user-id',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    ...overrides,
  }
}
