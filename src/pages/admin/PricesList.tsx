import React, { useEffect, useState } from 'react'
// AdminLayout is applied at route-level in App.tsx
import { listPrices, deletePrice, Price } from '@/services/prices'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus } from 'lucide-react'

export default function PricesListPage() {
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    listPrices()
      .then(setPrices)
      .catch((err) => setError(err.message || 'Failed to load prices'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete price?')) return
    try {
      await deletePrice(id)
      setPrices((prev) => prev.filter((p) => p.id !== id))
    } catch (e: any) {
      alert(`Delete failed: ${e?.message ?? 'unknown'}`)
    }
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Prices</h1>
          <Button onClick={() => navigate('/admin/prices/new')}><Plus className="w-4 h-4 mr-2" /> Add</Button>
        </div>
        {loading && <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Instrument</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price (INR)</TableHead>
              <TableHead>Duration (days)</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.instrument_id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price_inr}</TableCell>
                <TableCell>{p.duration_days}</TableCell>
                <TableCell>{p.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => navigate(`/admin/prices/${p.id}`)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(p.id!)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  )
}
