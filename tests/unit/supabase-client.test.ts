import { describe, it, expect } from 'vitest'

describe('supabase client', () => {
  it('exports a named supabase client', async () => {
    // Mock localStorage to avoid errors in Node env
    ;(globalThis as any).localStorage = {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    }

    const { supabase } = await import('../../src/supabase/client')
    expect(supabase).toBeDefined()
    // ensure common client methods exist
    expect(typeof (supabase as any).from).toBe('function')
  })
})
