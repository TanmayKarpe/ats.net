import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDepartments } from '@/services/departments'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function ConsultancyPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getDepartments()
      .then((d) => setDepartments(d))
      .catch((err) => setError(err.message || 'Failed to load departments'))
      .finally(() => setLoading(false))
  }, [])

  const dept = departments.find((d) => d.slug === selected)

  const handleContact = (dept: any) => {
    if (!dept) return
    const subject = `Consultancy Inquiry - ${dept.name}`
    const body = `Hello ${dept.name} team,%0D%0A%0D%0AMy name is %5BYour%20Name%5D from %5BOrganization%5D. I would like to inquire about consultancy services regarding %5Bbrief%20description%5D.%0D%0A%0D%0AProposed timeline: %5Btimeline%5D%0D%0ABudget (optional): %5Bbudget%5D%0D%0A%0D%0APlease let me know the next steps and availability.%0D%0A%0D%0ABest regards,%0D%0A%5BYour%20Name%5D%0D%0A%5BContact%20Information%5D`
    const mailto = `mailto:${dept.coordinator_email}?subject=${encodeURIComponent(subject)}&body=${body}`
    window.location.href = mailto
  }

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Consultancy</h1>
        <p className="mt-2 text-sm text-muted-foreground">We provide consultancy services across our departments. Select a department to read details and contact the coordinator directly for consultancy requests.</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Select onValueChange={(v) => setSelected(v)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">Or browse the departments below</div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">Loading departments…</div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!loading && departments.length === 0 && (
        <div className="py-12">
          <Card>
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold">No consultancy departments available</h2>
              <p className="mt-2 text-sm text-muted-foreground">There are currently no departments listed for consultancy. Please check back later or contact our office for more information.</p>
              <div className="mt-4 flex items-center justify-center">
                <Button asChild>
                  <a href="/contact">Contact Us</a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((d) => (
          <Card key={d.id} className="p-4">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{d.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{d.description}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium">Coordinator</div>
                  <div>{d.coordinator_email}</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleContact(d)}>
                    <Mail className="w-4 h-4 mr-2" /> Contact
                  </Button>
                  <Button variant="ghost" onClick={() => navigate(`/departments/${d.slug}`)}>View</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
