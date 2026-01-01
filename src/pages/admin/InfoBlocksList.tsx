import React, { useEffect, useState } from 'react'
// Admin layout and auth handled at route-level
import { listContentBlocks, deleteContentBlock, ContentBlock } from '@/services/contentBlocks'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus } from 'lucide-react'

export default function InfoBlocksListPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    listContentBlocks()
      .then(setBlocks)
      .catch((err) => setError(err.message || 'Failed to load content blocks'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete content block?')) return
    try {
      await deleteContentBlock(id)
      setBlocks((prev) => prev.filter((b) => b.id !== id))
    } catch (e: any) {
      alert(`Delete failed: ${e?.message ?? 'unknown'}`)
    }
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Content Blocks</h1>
          <Button onClick={() => navigate('/admin/info-blocks/new')}><Plus className="w-4 h-4 mr-2" /> Add</Button>
        </div>
        {loading && <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Locale</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.key}</TableCell>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.locale}</TableCell>
                <TableCell>{b.is_public ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => navigate(`/admin/info-blocks/${b.key}`)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(b.id!)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  )
}
