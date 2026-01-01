import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// Admin layout and auth are applied via App.tsx route
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { upsertContentBlock, getContentBlock } from '@/services/contentBlocks'
import { Loader2 } from 'lucide-react'

export default function InfoBlockFormPage() {
  const { key } = useParams<{ key?: string }>()
  const isNew = !key
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [block, setBlock] = useState({ key: '', title: '', content: '', is_public: false })
  const navigate = useNavigate()

  useEffect(() => {
    if (!isNew && key) {
      setLoading(true)
      getContentBlock(key)
        .then((b) => { if (b) setBlock(b as any) })
        .catch((err) => setError(err.message || 'Failed to load'))
        .finally(() => setLoading(false))
    }
  }, [key])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await upsertContentBlock(block as any)
      navigate('/admin/info-blocks')
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="space-y-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{isNew ? 'Create' : 'Edit'} Info Block</h1>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <Label htmlFor="key">Key</Label>
            <Input id="key" value={block.key} onChange={(e) => setBlock({ ...block, key: e.target.value })} disabled={!isNew} />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={block.title} onChange={(e) => setBlock({ ...block, title: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" value={block.content} onChange={(e) => setBlock({ ...block, content: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/info-blocks')}>Cancel</Button>
          </div>
        </div>
    </div>
  )
}
