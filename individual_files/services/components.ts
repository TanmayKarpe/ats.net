import { supabase } from '@/supabase/client'

export type ComponentItem = {
  id?: string
  slug: string
  name: string
  short_description?: string | null
  description?: string | null
  is_public?: boolean
  is_active?: boolean
}

export async function listComponents(): Promise<ComponentItem[]> {
  const { data, error } = await supabase.from('components').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as ComponentItem[]
}

export async function listPublicComponents(): Promise<ComponentItem[]> {
  const { data, error } = await supabase.from('components').select('*').eq('is_public', true).eq('is_active', true).order('created_at', { ascending: false })
  if (error) throw error
  return data as ComponentItem[]
}

export async function getComponent(id: string): Promise<ComponentItem | null> {
  const { data, error } = await supabase.from('components').select('*').eq('id', id).single()
  if (error && error.code !== 'PGRST116') throw error
  return data as ComponentItem | null
}

export async function getComponentBySlug(slug: string): Promise<ComponentItem | null> {
  const { data, error } = await supabase.from('components').select('*').eq('slug', slug).single()
  if (error && error.code !== 'PGRST116') throw error
  return data as ComponentItem | null
}

export async function createComponent(c: ComponentItem): Promise<ComponentItem> {
  // Sanitize payload to avoid sending admin-only fields accidentally
  const payload: Partial<ComponentItem> = {
    slug: c.slug?.trim(),
    name: c.name?.trim(),
    short_description: c.short_description?.trim() || null,
    description: c.description || null,
    is_public: !!c.is_public,
    is_active: c.is_active === undefined ? true : !!c.is_active,
  }

  const { data, error } = await supabase.from('components').insert(payload).select().single()
  if (error) throw error
  return data as ComponentItem
}

export async function updateComponent(id: string, c: Partial<ComponentItem>): Promise<ComponentItem> {
  const payload: Partial<ComponentItem> = {
    slug: c.slug?.trim(),
    name: c.name?.trim(),
    short_description: c.short_description?.trim() || null,
    description: c.description || null,
    is_public: c.is_public === undefined ? undefined : !!c.is_public,
    is_active: c.is_active === undefined ? undefined : !!c.is_active,
  }

  const { data, error } = await supabase.from('components').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as ComponentItem
}

export async function deleteComponent(id: string) {
  const { error } = await supabase.from('components').delete().eq('id', id)
  if (error) throw error
}
