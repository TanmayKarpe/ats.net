import { supabase } from '../supabase/client'

type UploadResult = {
  path: string
  url?: string
}

type SignedUrlResult = {
  signedUrl: string
}

const INSTRUMENT_BUCKET = 'instrument-images'
const DOCUMENTS_BUCKET = 'documents'

export async function uploadInstrumentImage(file: File, path: string): Promise<UploadResult> {
  const { data, error } = await supabase.storage
    .from(INSTRUMENT_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error || !data) {
    throw new Error(`Failed to upload instrument image: ${error?.message ?? 'unknown error'}`)
  }

  const { publicURL } = supabase.storage.from(INSTRUMENT_BUCKET).getPublicUrl(data.path)
  return { path: data.path, url: publicURL }
}

export function getPublicImageUrl(path: string): string {
  const { publicURL } = supabase.storage.from(INSTRUMENT_BUCKET).getPublicUrl(path)
  return publicURL
}

export async function getSignedDocumentUrl(path: string, expiresIn: number = 60): Promise<SignedUrlResult> {
  // documents bucket is private; generate signed URL for access
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(path, expiresIn)

  if (error || !data) {
    throw new Error(`Failed to create signed document URL: ${error?.message ?? 'unknown error'}`)
  }

  return { signedUrl: data.signedUrl }
}
