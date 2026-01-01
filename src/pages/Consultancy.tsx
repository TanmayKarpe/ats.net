import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDepartments } from '@/services/departments'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createEnquiry } from '@/services/consultancyEnquiries'
import { supabase } from '@/supabase/client'

export default function ConsultancyPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getDepartments()
      .then((d) => setDepartments(d))
      .catch((err) => setError(err.message || 'Failed to load departments'))
      .finally(() => setLoading(false))
  }, [])

  const dept = departments.find((d) => d.slug === selected)

  const [pendingDept, setPendingDept] = useState<any | null>(null)
  const handleContact = (dept: any) => {
    setPendingDept(dept)
    setFormName('')
    setFormEmail('')
    setFormMessage(`I would like to inquire about consultancy services for ${dept.name}.`)
    setIsDialogOpen(true)
  }

  const submitEnquiryAndOpenMailto = async () => {
    if (!pendingDept) return
    setSubmitting(true)
    setError(null)

    // Normalise input values: trim and convert empty strings to null
    const nameTrim = (formName || '').trim()
    const emailTrim = (formEmail || '').trim()
    const messageTrim = (formMessage || '').trim()

    try {
      // Inspect the auth/session state before attempting the insert (temporary debug)
      try {
        const sessionResp = await supabase.auth.getSession()
        const userResp = await supabase.auth.getUser()
        // Avoid printing complete session (access_token). Print presence and safe user fields only.
        console.debug('[Consultancy] sessionPresent:', !!sessionResp?.data?.session)
        console.debug('[Consultancy] userId:', userResp?.data?.user?.id ?? null, 'email:', userResp?.data?.user?.email ?? null)
        const roleContext = userResp?.data?.user ? 'authenticated' : 'anon'
        console.debug('[Consultancy] roleContext', roleContext)
      } catch (err) {
        console.debug('[Consultancy] failed to read auth state', err)
      }

      // Build a minimal, sanitized payload for the insert.
      // Only allowed fields, convert empty strings -> null, and never send undefined values.
      await createEnquiry({
        department_id: pendingDept.id,
        user_name: nameTrim || 'Anonymous',
        user_email: emailTrim || '',
        message: messageTrim || null,
      })

      const subject = `Consultancy Inquiry - ${pendingDept.name}`
      const body = `Hello ${pendingDept.name} team,%0D%0A%0D%0AMy name is ${encodeURIComponent(nameTrim || '[Your Name]')}%20from%20${encodeURIComponent('[Organization]')}. %0D%0A%0D%0A${encodeURIComponent(messageTrim || '')}%0D%0A%0D%0APlease let me know the next steps and availability.%0D%0A%0D%0ABest regards,%0D%0A${encodeURIComponent(nameTrim || '')}`
      const mailto = `mailto:${pendingDept.coordinator_email}?subject=${encodeURIComponent(subject)}&body=${body}`
      setIsDialogOpen(false)
      window.location.href = mailto
    } catch (err: any) {
      // Surface detailed error messages returned by Supabase, so users know why RLS failed
      setError(err?.message || JSON.stringify(err) || 'Failed to create enquiry')
    } finally { setSubmitting(false) }
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
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleContact(d)}>
                        <Mail className="w-4 h-4 mr-2" /> Contact
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Consultancy Enquiry</DialogTitle>
                        <DialogDescription>Please provide your details so the department can get back to you.</DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-2">
                        {error && <div className="text-sm text-red-600">{error}</div>}
                        <div>
                          <Label htmlFor="enquiry-name">Name</Label>
                          <Input id="enquiry-name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Your full name" />
                        </div>
                        <div>
                          <Label htmlFor="enquiry-email">Email</Label>
                          <Input id="enquiry-email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="you@example.com" />
                        </div>
                        <div>
                          <Label htmlFor="enquiry-message">Message</Label>
                          <Textarea id="enquiry-message" value={formMessage} onChange={(e) => setFormMessage(e.target.value)} rows={4} />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button onClick={submitEnquiryAndOpenMailto} disabled={submitting}>{submitting ? 'Submitting…' : 'Send Enquiry & Open Mail'}</Button>
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
