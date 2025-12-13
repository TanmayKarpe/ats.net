import React, { useEffect, useState } from 'react'
import { listEnquiries, updateEnquiryStatus, deleteEnquiry } from '@/services/consultancyEnquiries'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'

export default function EnquiriesList() {
  const [loading, setLoading] = useState(false)
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    listEnquiries()
      .then((d) => setEnquiries(d))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setUpdatingId(id)
      await updateEnquiryStatus(id, status)
      setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e))
    } catch (e) {
      alert('Failed to update status')
    } finally { setUpdatingId(null) }
  }

  if (loading) return <div className="flex items-center justify-center p-6"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Consultancy Enquiries</h1>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Created</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries.map((q) => (
            <TableRow key={q.id}>
              <TableCell>{new Date(q.created_at).toLocaleString()}</TableCell>
              <TableCell>{q.department?.name || q.department_id}</TableCell>
              <TableCell>{q.user_name}</TableCell>
              <TableCell>{q.user_email}</TableCell>
              <TableCell className="max-w-xs line-clamp-3">{q.message}</TableCell>
              <TableCell>
                <Select onValueChange={(v) => handleStatusChange(q.id, v)}>
                  <SelectTrigger className="w-36">
                    {q.status}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">new</SelectItem>
                    <SelectItem value="in_review">in_review</SelectItem>
                    <SelectItem value="closed">closed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => navigate(`/admin/enquiries/${q.id}`)}>View</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
