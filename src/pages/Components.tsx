import React, { useEffect, useState } from 'react'
import { listPublicComponents, ComponentItem } from '@/services/components'
import { ComponentCard } from '@/components/components/ComponentCard'
import { Card } from '@/components/ui/card'

export default function ComponentsPage() {
  const [components, setComponents] = useState<ComponentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    listPublicComponents()
      .then(setComponents)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Capabilities</h1>
          <p className="text-xl text-muted-foreground">Explore our capabilities and services available for research and consultancy.</p>
        </div>
      </div>
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {loading && <div className="p-8">Loading…</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {components.map((c) => (
              <ComponentCard key={c.id} component={c} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
