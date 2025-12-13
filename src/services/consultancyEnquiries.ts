import { supabase } from '@/supabase/client'
import { Department } from './departments'

export type Enquiry = {
  id?: string
  department_id?: string | null
  department?: Department | null
  user_name: string
  user_email: string
  message?: string | null
  status?: string
  created_at?: string
  updated_at?: string
}

export async function createEnquiry(e: Enquiry) {
  const { data, error } = await supabase.from('consultancy_enquiries').insert(e).select().single()
  if (error) throw error
  return data as Enquiry
}

export async function listEnquiries() {
  const { data, error } = await supabase.from('consultancy_enquiries').select('*, department:department_id(id, slug, name)').order('created_at', { ascending: false })
  if (error) throw error
  return data as Enquiry[]
}

export async function getEnquiryById(id: string) {
  const { data, error } = await supabase.from('consultancy_enquiries').select('*').eq('id', id).single()
  if (error) throw error
  return data as Enquiry
}

export async function updateEnquiryStatus(id: string, status: string) {
  const { data, error } = await supabase.from('consultancy_enquiries').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data as Enquiry
}

export async function deleteEnquiry(id: string) {
  const { error } = await supabase.from('consultancy_enquiries').delete().eq('id', id)
  if (error) throw error
}
