import type { Tables } from '@/integrations/supabase/types'
import { supabase } from '@/supabase/client'

export type Instrument = {
  id?: string
  slug: string
  name: string
  short_description?: string | null
  description?: string | null
  category?: string | null
  sample_requirements?: any
  metadata?: any
  is_active?: boolean
  coordinator_email?: string | null
}

export async function listInstruments(): Promise<Instrument[]> {
  const { data, error } = await supabase
    .from('instruments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as unknown) as Instrument[]
}

export async function getInstrument(id: string): Promise<Instrument | null> {
  const { data, error } = await supabase
    .from('instruments')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as unknown) as Instrument | null
}

export async function createInstrument(instr: Instrument): Promise<Instrument> {
  const { data, error } = await supabase.from('instruments').insert(instr).select().single()
  if (error) throw error
  return data as Instrument
}

export async function updateInstrument(id: string, instr: Partial<Instrument>): Promise<Instrument> {
  const { data, error } = await supabase.from('instruments').update(instr).eq('id', id).select().single()
  if (error) throw error
  return data as Instrument
}

export async function deleteInstrument(id: string): Promise<void> {
  const { error } = await supabase.from('instruments').delete().eq('id', id)
  if (error) throw error
}
