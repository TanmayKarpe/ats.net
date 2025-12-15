import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getComponentBySlug } from '@/services/components'
import { Card } from '@/components/ui/card'

export default function ComponentDetailPage() {
  const { slug } = useParams<{ slug?: string }>()
  const [component, setComponent] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getComponentBySlug(slug)
      .then((c) => setComponent(c))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="p-8">Loading…</div>
  if (error) return <div className="p-8 text-sm text-red-600">{error}</div>
  if (!component) return <div className="p-8">Not Found</div>

  return (
    <div className="py-12 container mx-auto px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-2">{component.name}</h1>
      <p className="text-muted-foreground mb-6">{component.short_description}</p>

      <Card>
        <div className="p-6">
          <div className="prose">
            <div dangerouslySetInnerHTML={{ __html: component.description || '' }} />
          </div>
        </div>
      </Card>
    </div>
  )
}
