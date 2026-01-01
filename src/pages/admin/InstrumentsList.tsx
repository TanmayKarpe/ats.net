import React, { useEffect, useState } from 'react'
import { listInstruments, deleteInstrument, Instrument } from '@/services/instruments'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus } from 'lucide-react'

export default function InstrumentsListPage() {
  const [loading, setLoading] = useState(false)
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    listInstruments()
      .then(setInstruments)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete instrument?')) return
    try {
      await deleteInstrument(id)
      setInstruments((prev) => prev.filter((i) => i.id !== id))
    } catch (e: any) {
      alert(`Delete failed: ${e?.message ?? 'unknown'}`)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Instruments</h1>
        <Button onClick={() => navigate('/admin/instruments/new')}> <Plus className="w-4 h-4 mr-2" /> Add</Button>
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
            <TableHead>Coordinator</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instruments.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.slug}</TableCell>
              <TableCell>{i.coordinator_email}</TableCell>
              <TableCell>{i.is_active ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => navigate(`/admin/instruments/${i.id}`)}>Edit</Button>
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
