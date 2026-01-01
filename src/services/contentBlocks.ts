import { supabase } from '@/supabase/client'

export type ContentBlock = {
  id?: string
  key: string
  title?: string | null
  type?: string | null
  content?: string | null
  locale?: string | null
  metadata?: any
  is_public?: boolean
}

export async function listContentBlocks() {
  const { data, error } = await supabase.from('content_blocks').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as ContentBlock[]
}

export async function getContentBlock(key: string) {
  const { data, error } = await supabase.from('content_blocks').select('*').eq('key', key).single()
  if (error) throw error
  return data as ContentBlock
}

export async function upsertContentBlock(b: ContentBlock) {
  // If key exists, update; otherwise insert
  const existing = await supabase.from('content_blocks').select('id').eq('key', b.key).single()
  if ((existing.data as any)?.id) {
    const { data, error } = await supabase.from('content_blocks').update(b).eq('key', b.key).select().single()
    if (error) throw error
    return data as ContentBlock
  }
  const { data, error } = await supabase.from('content_blocks').insert(b).select().single()
  if (error) throw error
  return data as ContentBlock
}

export async function deleteContentBlock(id: string) {
  const { error } = await supabase.from('content_blocks').delete().eq('id', id)
  if (error) throw error
}
