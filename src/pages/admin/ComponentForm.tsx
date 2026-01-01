import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { createComponent, getComponent, updateComponent, getComponentBySlug } from '@/services/components'

export default function ComponentFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isNew = id === 'new' || !id
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{ name?: string; slug?: string } | null>(null)
  const [comp, setComp] = useState({ slug: '', name: '', short_description: '', description: '', is_public: false, is_active: true })
  const navigate = useNavigate()

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true)
      getComponent(id)
        .then((data) => { if (data) setComp(data as any) })
        .catch((err) => setError(err.message || 'Failed to load component'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const validate = async () => {
    const errs: any = {}
    if (!comp.name?.trim()) errs.name = 'Name is required'
    if (!comp.slug?.trim()) errs.slug = 'Slug is required'

    // Check uniqueness of slug
    try {
      const existing = await getComponentBySlug(comp.slug)
      if (existing && (isNew || existing.id !== id)) {
        errs.slug = 'Slug already exists'
      }
    } catch (err: any) {
      // ignore not found
    }

    setFormErrors(Object.keys(errs).length ? errs : null)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!(await validate())) return
    setSaving(true)
    setError(null)
    try {
      if (isNew) {
        await createComponent(comp as any)
      } else if (id) {
        await updateComponent(id, comp as any)
      }
      navigate('/admin/components')
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">{isNew ? 'Create' : 'Edit'} Component</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={comp.name} onChange={(e) => setComp({ ...comp, name: e.target.value })} />
          {formErrors?.name && <div className="text-sm text-red-600">{formErrors.name}</div>}
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={comp.slug} onChange={(e) => setComp({ ...comp, slug: e.target.value })} disabled={!isNew} />
          {formErrors?.slug && <div className="text-sm text-red-600">{formErrors.slug}</div>}
        </div>
        <div>
          <Label htmlFor="short_desc">Short description</Label>
          <Textarea id="short_desc" value={comp.short_description || ''} onChange={(e) => setComp({ ...comp, short_description: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="description">Detailed description</Label>
          <Textarea id="description" value={comp.description || ''} onChange={(e) => setComp({ ...comp, description: e.target.value })} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Public</Label>
            <Switch checked={!!comp.is_public} onCheckedChange={(v) => setComp({ ...comp, is_public: v as boolean })} />
          </div>
          <div className="flex items-center gap-2">
            <Label>Active</Label>
            <Switch checked={!!comp.is_active} onCheckedChange={(v) => setComp({ ...comp, is_active: v as boolean })} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving || !comp.name || !comp.slug}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button variant="ghost" onClick={() => navigate('/admin/components')}>Cancel</Button>
        </div>
    </div>
  )
}
