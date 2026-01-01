import { supabase } from '@/supabase/client'

export type Announcement = {
  id?: string
  title: string
  body?: string | null
  start_at?: string | null
  end_at?: string | null
  pinned?: boolean
  is_published?: boolean
}

export async function listAnnouncements() {
  const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Announcement[]
}

export async function getAnnouncement(id: string) {
  const { data, error } = await supabase.from('announcements').select('*').eq('id', id).single()
  if (error) throw error
  return data as Announcement
}

export async function createAnnouncement(a: Announcement) {
  const { data, error } = await supabase.from('announcements').insert(a).select().single()
  if (error) throw error
  return data as Announcement
}

export async function updateAnnouncement(id: string, a: Partial<Announcement>) {
  const { data, error } = await supabase.from('announcements').update(a).eq('id', id).select().single()
  if (error) throw error
  return data as Announcement
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw error
}
