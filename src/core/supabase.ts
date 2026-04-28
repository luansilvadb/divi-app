import { createClient } from '@supabase/supabase-js'
import { ApiError, AuthError } from './errors'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials are missing or invalid in your .env file.')
}

/**
 * Handles Supabase errors and converts to AppError
 */
export function handleSupabaseError(error: unknown): never {
  if (error instanceof Error) {
    if (error.message.includes('auth')) {
      throw new AuthError(error.message)
    }
    throw new ApiError(error.message, 500)
  }
  throw new ApiError('Unknown Supabase error', 500)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})
