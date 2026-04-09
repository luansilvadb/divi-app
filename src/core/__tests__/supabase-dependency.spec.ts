import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Dependency', () => {
    it('should be able to import createClient from @supabase/supabase-js', () => {
        expect(createClient).toBeDefined();
        expect(typeof createClient).toBe('function');
    });
});
