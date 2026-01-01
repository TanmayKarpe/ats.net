import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// Layout and RequireAdmin are applied at App route level
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { createAnnouncement, updateAnnouncement, getAnnouncement } from '@/services/announcements'
import { Loader2 } from 'lucide-react'

export default function AnnouncementFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isNew = id === 'new' || !id
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState({ title: '', body: '', pinned: false, is_published: false })
  const navigate = useNavigate()

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true)
      getAnnouncement(id)
        .then((a) => { if (a) setAnnouncement(a as any) })
        .catch((err) => setError(err.message || 'Failed to load'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      if (isNew) await createAnnouncement(announcement as any)
      else if (id) await updateAnnouncement(id, announcement as any)
      navigate('/admin/announcements')
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="space-y-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{isNew ? 'Create' : 'Edit'} Announcement</h1>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={announcement.title} onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="body">Body</Label>
            <Textarea id="body" value={announcement.body} onChange={(e) => setAnnouncement({ ...announcement, body: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={!!announcement.pinned} onCheckedChange={(v) => setAnnouncement({ ...announcement, pinned: !!v })} />
            <Label>Pinned</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={!!announcement.is_published} onCheckedChange={(v) => setAnnouncement({ ...announcement, is_published: !!v })} />
            <Label>Published</Label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/announcements')}>Cancel</Button>
          </div>
        </div>
    </div>
  )
}
