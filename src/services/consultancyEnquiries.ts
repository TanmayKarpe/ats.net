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
  if (!supabase) throw new Error('Supabase client missing; environment variables may not be set')

  // Debugging — print session and user for diagnosis (temporary)
  try {
    const sessionResp = await supabase.auth.getSession()
    const userResp = await supabase.auth.getUser()
    // DO NOT log the whole session object (contains access_token). Only log presence and user identity.
    console.debug('[ConsultancyEnquiries] sessionPresent:', !!sessionResp?.data?.session)
    console.debug('[ConsultancyEnquiries] userId:', userResp?.data?.user?.id ?? null, 'email:', userResp?.data?.user?.email ?? null)
    // Infer role context: we treat lack of authenticated user as 'anon'
    const roleContext = userResp?.data?.user ? 'authenticated' : 'anon'
    console.debug('[ConsultancyEnquiries] roleContext:', roleContext)
  } catch (err) {
    console.debug('[ConsultancyEnquiries] auth inspect failed:', err)
  }

  // Build a sanitized payload with only allowed, explicit fields.
  // This avoids sending admin-only columns (status, created_at, id, etc.) and prevents undefined values from being sent.
  const payload: Partial<Enquiry> = {
    user_name: e.user_name?.trim() || 'Anonymous',
    // user_email is NOT NULL in the DB; default to empty string if missing rather than null.
    user_email: e.user_email?.trim() ?? '',
    // message is optional; convert empty string -> null to avoid storing blank messages.
    message: (e.message !== undefined && e.message !== null) ? String(e.message).trim() || null : null,
    department_id: e.department_id || null,
  }

  const { data, error } = await supabase.from('consultancy_enquiries').insert(payload).select().single()
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
