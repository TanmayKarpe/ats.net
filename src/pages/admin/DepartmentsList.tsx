import React, { useEffect, useState } from 'react'
import { getDepartments, deleteDepartment, Department } from '@/services/departments'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus } from 'lucide-react'

export default function DepartmentsList() {
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getDepartments()
      .then((d) => setDepartments(d))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this department?')) return
    try {
      setDeleting(id)
      await deleteDepartment(id)
      setDepartments((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      alert('Failed to delete')
    } finally { setDeleting(null) }
  }

  if (loading) return <div className="flex items-center justify-center p-6"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Departments</h1>
        <Button onClick={() => navigate('/admin/departments/new')}> <Plus className="w-4 h-4 mr-2" /> Add</Button>
      </div>

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
          {departments.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.slug}</TableCell>
              <TableCell>{d.coordinator_email}</TableCell>
              <TableCell>{d.active ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => navigate(`/admin/departments/${d.slug}`)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(d.id!)} disabled={deleting === d.id}>{deleting === d.id ? 'Deleting...' : 'Delete'}</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
