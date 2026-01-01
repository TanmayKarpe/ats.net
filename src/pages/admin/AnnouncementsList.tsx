import React, { useEffect, useState } from 'react'
// Layout and RequireAdmin applied at route level by App.tsx
import { listAnnouncements, deleteAnnouncement, Announcement } from '@/services/announcements'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus } from 'lucide-react'

export default function AnnouncementsListPage() {
  const [list, setList] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    listAnnouncements()
      .then(setList)
      .catch((err) => setError(err.message || 'Failed to load announcements'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete announcement?')) return
    try {
      await deleteAnnouncement(id)
      setList((prev) => prev.filter((a) => a.id !== id))
    } catch (e: any) {
      alert(`Delete failed: ${e?.message ?? 'unknown'}`)
    }
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Announcements</h1>
          <Button onClick={() => navigate('/admin/announcements/new')}><Plus className="w-4 h-4 mr-2" /> Add</Button>
        </div>
        {loading && <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Pinned</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.title}</TableCell>
                <TableCell>{a.start_at}</TableCell>
                <TableCell>{a.end_at}</TableCell>
                <TableCell>{a.pinned ? 'Yes' : 'No'}</TableCell>
                <TableCell>{a.is_published ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => navigate(`/admin/announcements/${a.id}`)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(a.id!)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  )
}
