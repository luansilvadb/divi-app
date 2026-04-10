import { describe, it, expect } from 'vitest';
import { supabase } from '../supabase';

describe('Supabase Singleton', () => {
    it('should export a initialized supabase client', () => {
        expect(supabase).toBeDefined();
        expect(supabase.auth).toBeDefined();
    });

    it('should use the environment variables for initialization', () => {
        // This is a bit hard to test directly without spying on createClient 
        // before it's called in the module, but we can check if it's functional
        expect(supabase['supabaseUrl']).toBe(import.meta.env.VITE_SUPABASE_URL);
    });
});

