import React, { useEffect, useState } from 'react'
import { listComponents, deleteComponent, ComponentItem } from '@/services/components'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus } from 'lucide-react'

export default function ComponentsListPage() {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ComponentItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    listComponents()
      .then(setItems)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete component?')) return
    try {
      await deleteComponent(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (e: any) {
      alert(`Delete failed: ${e?.message ?? 'unknown'}`)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Components</h1>
        <Button onClick={() => navigate('/admin/components/new')}> <Plus className="w-4 h-4 mr-2" /> Add</Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Short Description</TableHead>
            <TableHead>Public</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.slug}</TableCell>
              <TableCell>{i.short_description}</TableCell>
              <TableCell>{i.is_public ? 'Yes' : 'No'}</TableCell>
              <TableCell>{i.is_active ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => navigate(`/admin/components/${i.id}`)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(i.id!)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
