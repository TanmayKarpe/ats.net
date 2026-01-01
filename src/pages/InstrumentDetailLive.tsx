import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { instruments as staticInstruments } from '@/data/instruments';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function InstrumentDetailLivePage() {
  const [isOpen, setIsOpen] = useState(false)
  const [sampleName, setSampleName] = useState('')
  const [sampleWeight, setSampleWeight] = useState('')
  const [numSamples, setNumSamples] = useState('1')
  const [purpose, setPurpose] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [row, setRow] = useState<any | null>(null)
  const { id } = useParams();

  const imageByName = useMemo(() => {
    const map = new Map<string, string | undefined>();
    staticInstruments.forEach((it) => {
      if (it.name) map.set(it.name.toLowerCase(), it.image);
      if (it.id) map.set(it.id.toLowerCase(), it.image);
    });
    return map;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) {
        setError('Instrument not found');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('instruments')
          .select('*')
          .eq('code', id)
          .maybeSingle();
        if (error) throw error;
        if (!cancelled) setRow(data || null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load instrument');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true };
  }, [id]);

  if (loading) return <div className="container py-12 text-muted-foreground">Loading…</div>;
  if (error) return (
    <div className="container py-12">
      <h2 className="text-2xl font-bold mb-4">Instrument not found</h2>
      <p className="mb-4">{error}</p>
      <div className="flex gap-2">
        <Link to="/instruments">
          <Button variant="outline">Go Back</Button>
        </Link>
        <Link to="/instruments" className="btn btn-ghost">
          Browse Instruments
        </Link>
      </div>
    </div>
  );
  if (!row) return <div className="container py-12">Instrument not found.</div>;

  const name: string = row?.name || String(id);
  const department: string = row?.department || '';
  const makeModel: string = [row?.make, row?.model].filter(Boolean).join(' ');
  const description: string = row?.description || '';
  const applications: string[] = Array.isArray(row?.applications)
    ? row.applications
    : (row?.applications ? String(row.applications).split(/\n|,|;\s*/).filter(Boolean) : []);
  const sampleReq: string = row?.['sample '] ? String(row['sample ']) : '';
  const priceInternal = row?.price_internal ?? null;
  const priceExternal = row?.price_external ?? null;
  const priceIndustry = row?.price_industry ?? null;
  const contactName = row?.contact_name || '';
  const contactEmail = row?.contact_email || '';
  const contactPhone = row?.contact_phone || '';
  const image = imageByName.get((name || id || '').toLowerCase());

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link to="/instruments" className="text-sm text-muted-foreground underline">
          ← Back to instruments
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {image && (
            <img src={image} alt={name} className="w-full h-64 object-cover rounded-md" />
          )}
          <div className="mt-4">
            <h1 className="text-3xl font-bold">{name}</h1>
            {department && <p className="text-sm text-muted-foreground mt-1">Department: {department}</p>}
            {makeModel && <p className="text-sm text-muted-foreground">Make/Model: {makeModel}</p>}
            <div className="h-px bg-border mt-3" />
          </div>
        </div>

        <div className="lg:col-span-2 prose">
          <h2>Overview</h2>
          <p>{description}</p>

          {applications && applications.length > 0 && (
            <>
              <h3>Applications</h3>
              <ul>
                {applications.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </>
          )}

          {sampleReq && (
            <>
              <h3>Sample Requirements</h3>
              <p>{sampleReq}</p>
            </>
          )}

          <h3>Pricing</h3>
          <div className="not-prose mt-2 border rounded-md"> 
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <div className="p-4">
                <p className="text-sm text-muted-foreground">KBCNMU Students / Faculty</p>
                <p className="text-lg font-semibold mt-1">{priceInternal ?? 'Contact for details'}</p>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Other Universities / Institutes</p>
                <p className="text-lg font-semibold mt-1">{priceExternal ?? 'Contact for details'}</p>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Industry / Corporate (with GST)</p>
                <p className="text-lg font-semibold mt-1">{priceIndustry ?? 'Contact for details'}</p>
              </div>
            </div>
          </div>

          {(contactName || contactEmail || contactPhone) && (
            <>
              <h3>Contact</h3>
              <div className="not-prose border rounded-md p-4">
                {contactName && <p><span className="text-sm text-muted-foreground">Contact Person:</span> {contactName}</p>}
                {contactEmail && (
                  <p>
                    <span className="text-sm text-muted-foreground">Email:</span>{' '}
                    <a href={`mailto:${contactEmail}`} className="underline">{contactEmail}</a>
                  </p>
                )}
                {contactPhone && (
                  <p>
                    <span className="text-sm text-muted-foreground">Phone:</span>{' '}
                    <a href={`tel:${contactPhone}`} className="underline">{contactPhone}</a>
                  </p>
                )}
              </div>

              <div className="mt-4">
                <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                  <DialogTrigger asChild>
                    <Button>Book this instrument</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Booking Request</DialogTitle>
                      <DialogDescription>Provide sample details before booking.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sampleName">Sample Name</Label>
                        <Input id="sampleName" value={sampleName} onChange={(e) => setSampleName(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="sampleWeight">Sample Weight (g)</Label>
                        <Input id="sampleWeight" type="number" value={sampleWeight} onChange={(e) => setSampleWeight(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="numSamples">Number of Samples</Label>
                        <Input id="numSamples" type="number" value={numSamples} onChange={(e) => setNumSamples(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="purpose">Purpose</Label>
                        <Textarea id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="userEmail">Your Email</Label>
                        <Input id="userEmail" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                      </div>
                      {bookingError && <div className="text-sm text-red-600">{bookingError}</div>}
                    </div>
                    <DialogFooter>
                      <div className="flex gap-2">
                        <DialogClose asChild>
                          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => {
                          setBookingError(null)
                          if (!userEmail.trim()) return setBookingError('Your email is required')
                          const num = Number(numSamples || 0)
                          if (!Number.isFinite(num) || num <= 0) return setBookingError('Number of samples must be a positive number')
                          if (sampleWeight && (isNaN(Number(sampleWeight)) || Number(sampleWeight) < 0)) return setBookingError('Sample weight must be a non-negative number')
                          const subject = `Booking Request: ${name} (${sampleName || 'sample'})`
                          const body = `Hi,%0A%0AI would like to book the ${name}.%0A%0ASample name: ${sampleName}%0ASample weight (g): ${sampleWeight}%0ANumber of samples: ${numSamples}%0APurpose: ${purpose}%0AContact Email: ${userEmail}%0A%0AThanks,%0A${userEmail}`
                          const mailto = `mailto:${contactEmail || 'ats@nmu.ac.in'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                          setIsOpen(false)
                          window.location.href = mailto
                        }}>Send Email</Button>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}