import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { uploadInstrumentImage } from '@/services/storage'
import { createInstrument, getInstrument, updateInstrument, Instrument } from '@/services/instruments'
import { Loader2 } from 'lucide-react'

export default function InstrumentFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isNew = id === 'new' || !id
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{ name?: string; slug?: string; coordinator_email?: string } | null>(null)
  const [instrument, setInstrument] = useState<Instrument>({ slug: '', name: '', short_description: '', description: '', is_active: true, coordinator_email: '' })
  const navigate = useNavigate()

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true)
      getInstrument(id)
        .then((data) => {
          if (data) setInstrument(data)
        })
        .catch((err) => setError(err.message || 'Failed to load instrument'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await uploadInstrumentImage(file, `${instrument.slug || 'unslugged'}/${file.name}`)
      setInstrument({ ...instrument, metadata: { ...instrument.metadata, image_path: result.path }, })
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    }
  }

  const validate = () => {
    const errs: any = {}
    if (!instrument.name?.trim()) errs.name = 'Name is required'
    if (!instrument.slug?.trim()) errs.slug = 'Slug is required'
    if (!instrument.coordinator_email?.trim()) errs.coordinator_email = 'Coordinator email is required'
    setFormErrors(Object.keys(errs).length ? errs : null)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    setError(null)
    try {
      if (isNew) {
        await createInstrument(instrument)
      } else if (id) {
        await updateInstrument(id, instrument)
      }
      navigate('/admin/instruments')
    } catch (err: any) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="space-y-6">
          <h1 className="text-2xl font-bold">{isNew ? 'Create' : 'Edit'} Instrument</h1>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={instrument.name} onChange={(e) => setInstrument({ ...instrument, name: e.target.value })} />
            {formErrors?.name && <div className="text-sm text-red-600">{formErrors.name}</div>}
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={instrument.slug} onChange={(e) => setInstrument({ ...instrument, slug: e.target.value })} />
            {formErrors?.slug && <div className="text-sm text-red-600">{formErrors.slug}</div>}
          </div>
          <div>
            <Label htmlFor="short_desc">Short description</Label>
            <Textarea id="short_desc" value={instrument.short_description || ''} onChange={(e) => setInstrument({ ...instrument, short_description: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="description">Detailed description</Label>
            <Textarea id="description" value={instrument.description || ''} onChange={(e) => setInstrument({ ...instrument, description: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="coordinator_email">Coordinator Email</Label>
            <Input id="coordinator_email" value={instrument.coordinator_email || ''} onChange={(e) => setInstrument({ ...instrument, coordinator_email: e.target.value })} />
            {formErrors?.coordinator_email && <div className="text-sm text-red-600">{formErrors.coordinator_email}</div>}
          </div>
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input type="file" id="image" onChange={handleFile} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving || !instrument.name || !instrument.slug || !instrument.coordinator_email}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/instruments')}>Cancel</Button>
          </div>
        </div>
  )
}
