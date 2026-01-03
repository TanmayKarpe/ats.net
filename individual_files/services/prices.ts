import { supabase } from '@/supabase/client'

export type Price = {
  id?: string
  instrument_id: string
  name: string
  price_inr: number
  duration_days?: number | null
  is_active?: boolean
}

export async function listPrices(instrumentId?: string) {
  let q = supabase.from('instrument_prices').select('*')
  if (instrumentId) q = q.eq('instrument_id', instrumentId)
  const { data, error } = await q
  if (error) throw error
  return data as Price[]
}

export async function getPrice(id: string) {
  const { data, error } = await supabase.from('instrument_prices').select('*').eq('id', id).single()
  if (error && error.code !== 'PGRST116') throw error
  return (data as unknown) as Price | null
}

export async function createPrice(p: Price) {
  const { data, error } = await supabase.from('instrument_prices').insert(p).select().single()
  if (error) throw error
  return data as Price
}

export async function updatePrice(id: string, p: Partial<Price>) {
  const { data, error } = await supabase.from('instrument_prices').update(p).eq('id', id).select().single()
  if (error) throw error
  return data as Price
}

export async function deletePrice(id: string) {
  const { error } = await supabase.from('instrument_prices').delete().eq('id', id)
  if (error) throw error
}
