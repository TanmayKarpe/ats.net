import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// AdminLayout and RequireAdmin are applied at the route level in App.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listPrices, createPrice, updatePrice, getPrice, Price } from '@/services/prices'
import { listInstruments } from '@/services/instruments'
import { Loader2 } from 'lucide-react'

export default function PriceFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isNew = id === 'new' || !id
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [instruments, setInstruments] = useState<any[]>([])
  const [price, setPrice] = useState<Price>({ instrument_id: '', name: '', price_inr: 0, duration_days: 1, is_active: true })
  const [existingPrices, setExistingPrices] = useState<Price[]>([])
  const [formErrors, setFormErrors] = useState<{ instrument_id?: string; name?: string; price_inr?: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    listInstruments()
      .then((data) => setInstruments(data))
      .catch((err) => setError(err.message || 'Failed to load instruments'))
      .finally(() => setLoading(false))

    if (!isNew && id) {
      setLoading(true)
      getPrice(id)
        .then((d) => { if (d) setPrice(d) })
        .catch((err) => setError(err.message || 'Failed to load price'))
        .finally(() => setLoading(false))
    }
  }, [id])

  useEffect(() => {
    async function fetchForInstrument() {
      if (!price.instrument_id) return setExistingPrices([])
      try {
        const data = await listPrices(price.instrument_id)
        setExistingPrices(data)
      } catch (err) {
        setExistingPrices([])
      }
    }
    fetchForInstrument()
  }, [price.instrument_id])

  const validate = () => {
    const errs: any = {}
    if (!price.instrument_id) errs.instrument_id = 'Instrument is required'
    if (!price.name?.trim()) errs.name = 'Name is required'
    if (!price.price_inr || price.price_inr <= 0) errs.price_inr = 'Price must be greater than zero'
    const duplicate = existingPrices.find((p) => p.name?.toLowerCase() === price.name?.toLowerCase() && p.id !== price.id)
    if (duplicate) errs.name = 'A price with this name already exists for the selected instrument'
    setFormErrors(Object.keys(errs).length ? errs : null)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    setError(null)
    try {
      if (isNew) await createPrice(price)
      else if (id) await updatePrice(id, price)
      navigate('/admin/prices')
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="space-y-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{isNew ? 'Create' : 'Edit'} Price</h1>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <Label htmlFor="instrument">Instrument</Label>
            <Select value={price.instrument_id} onValueChange={(v) => setPrice({ ...price, instrument_id: v })}>
              <SelectTrigger id="instrument">
                <SelectValue placeholder="Select instrument" />
              </SelectTrigger>
              <SelectContent>
                {instruments.map((i: any) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {formErrors?.instrument_id && <div className="text-sm text-red-600">{formErrors.instrument_id}</div>}
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={price.name} onChange={(e) => setPrice({ ...price, name: e.target.value })} />
            {formErrors?.name && <div className="text-sm text-red-600">{formErrors.name}</div>}
          </div>
          <div>
            <Label htmlFor="price">Price (INR)</Label>
            <Input id="price" type="number" value={price.price_inr?.toString() ?? '0'} onChange={(e) => setPrice({ ...price, price_inr: Number(e.target.value) })} />
            {formErrors?.price_inr && <div className="text-sm text-red-600">{formErrors.price_inr}</div>}
          </div>
          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input id="duration" type="number" value={String(price.duration_days ?? 1)} onChange={(e) => setPrice({ ...price, duration_days: Number(e.target.value) })} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={!!price.is_active} onCheckedChange={(c) => setPrice({ ...price, is_active: !!c })} />
            <Label>Active</Label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving || !price.instrument_id || !price.name || !price.price_inr}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/prices')}>Cancel</Button>
          </div>
        </div>
    </div>
  )
}
