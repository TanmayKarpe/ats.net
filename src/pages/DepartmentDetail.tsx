import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDepartmentBySlug } from '@/services/departments'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function DepartmentDetailPage() {
  const { slug } = useParams<{ slug?: string }>()
  const [loading, setLoading] = useState(false)
  const [department, setDepartment] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getDepartmentBySlug(slug)
      .then((d) => setDepartment(d))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
  if (error) return <div className="text-sm text-red-600">{error}</div>
  if (!department) return <div className="p-8">Department not found.</div>

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold">{department.name}</h1>
      <p className="mt-4 text-muted-foreground">{department.description}</p>
      <div className="mt-6">
        <a href={`mailto:${department.coordinator_email}?subject=Consultancy%20Inquiry%20${encodeURIComponent(department.name)}`}>
          <Button>Contact Coordinator</Button>
        </a>
      </div>
    </div>
  )
}
