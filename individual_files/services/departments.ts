import { supabase } from '@/supabase/client'

export type Department = {
  id?: string
  slug: string
  name: string
  description?: string | null
  coordinator_email: string
  active?: boolean
}

export async function listDepartments() {
  const { data, error } = await supabase.from('departments').select('*').eq('active', true).order('name', { ascending: true })
  if (error) throw error
  return data as Department[]
}

export async function getDepartments() {
  return listDepartments()
}

export async function getDepartmentBySlug(slug: string) {
  const { data, error } = await supabase.from('departments').select('*').eq('slug', slug).single()
  if (error && error.code !== 'PGRST116') throw error
  return data as Department | null
}

export async function listAllDepartments() {
  const { data, error } = await supabase.from('departments').select('*').order('name', { ascending: true })
  if (error) throw error
  return data as Department[]
}

export async function createDepartment(d: Department) {
  const { data, error } = await supabase.from('departments').insert(d).select().single()
  if (error) throw error
  return data as Department
}

export async function updateDepartment(id: string, d: Partial<Department>) {
  const { data, error } = await supabase.from('departments').update(d).eq('id', id).select().single()
  if (error) throw error
  return data as Department
}

export async function deleteDepartment(id: string) {
  const { error } = await supabase.from('departments').delete().eq('id', id)
  if (error) throw error
}
