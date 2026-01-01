import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { createDepartment, getDepartmentBySlug, updateDepartment, Department } from '@/services/departments'

export default function DepartmentForm() {
  const { slug } = useParams<{ slug?: string }>()
  const isNew = slug === 'new' || !slug
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [department, setDepartment] = useState<Department>({ slug: '', name: '', description: '', coordinator_email: '', active: true })
  const [formErrors, setFormErrors] = useState<{ name?: string; slug?: string; coordinator_email?: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isNew && slug) {
      setLoading(true)
      getDepartmentBySlug(slug)
        .then((d) => { if (d) setDepartment(d) })
        .catch((err) => setError(err.message || 'Failed to load'))
        .finally(() => setLoading(false))
    }
  }, [slug])

  const validate = () => {
    const errs: any = {}
    if (!department.name?.trim()) errs.name = 'Name is required'
    if (!department.slug?.trim()) errs.slug = 'Slug is required'
    if (!department.coordinator_email?.trim()) errs.coordinator_email = 'Coordinator email is required'
    setFormErrors(Object.keys(errs).length ? errs : null)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    setError(null)
    try {
      if (isNew) {
        await createDepartment(department)
      } else if (!isNew && department.id) {
        await updateDepartment(department.id, department)
      }
      navigate('/admin/departments')
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{isNew ? 'Create' : 'Edit'} Department</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={department.name} onChange={(e) => setDepartment({ ...department, name: e.target.value })} />
        {formErrors?.name && <div className="text-sm text-red-600">{formErrors.name}</div>}
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={department.slug} onChange={(e) => setDepartment({ ...department, slug: e.target.value })} />
        {formErrors?.slug && <div className="text-sm text-red-600">{formErrors.slug}</div>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={department.description || ''} onChange={(e) => setDepartment({ ...department, description: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="coordinator_email">Coordinator Email</Label>
        <Input id="coordinator_email" value={department.coordinator_email} onChange={(e) => setDepartment({ ...department, coordinator_email: e.target.value })} />
        {formErrors?.coordinator_email && <div className="text-sm text-red-600">{formErrors.coordinator_email}</div>}
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving || !department.name || !department.slug || !department.coordinator_email}>{saving ? 'Saving...' : 'Save'}</Button>
        <Button variant="ghost" onClick={() => navigate('/admin/departments')}>Cancel</Button>
      </div>
    </div>
  )
}
