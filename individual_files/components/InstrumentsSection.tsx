import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { instruments as staticInstruments, type Instrument } from '@/data/instruments';
import { InstrumentCard } from '@/components/instruments/InstrumentCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export function InstrumentsSection({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const [items, setItems] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      try {
        if (!supabase) {
          console.error('Supabase client not initialized. Check environment variables.');
          setError('Data service unavailable');
          setLoading(false);
          return;
        }
        let query = supabase
          .from('instruments')
          .select('*');
        if (featuredOnly) {
          query = query.eq('is_featured', true);
        }
        const { data, error } = await query;
        if (error) {
          console.error('Supabase query error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            full: error
          });
          throw error;
        }
        if (cancelled) return;
        const mapped: Instrument[] = (data || []).map((row: any) => {
          const code: string = row?.code || row?.id || '';
          const name: string = row?.name || '';
          const dept: string = row?.category || '';
          const desc: string = row?.description || row?.short_description || '';
          const img = imageByName.get((name || code || '').toLowerCase());
          return {
            id: code || name || crypto.randomUUID(),
            name,
            category: dept,
            summary: desc,
            applications: Array.isArray(row?.metadata?.applications) ? row.metadata.applications : [],
            specs: [],
            sampleRequirements: row?.sample_requirements ? (Array.isArray(row.sample_requirements) ? row.sample_requirements : [String(row.sample_requirements)]) : [],
            pricingNote: '',
            contactEmail: row?.coordinator_email || '',
            image: img,
          } as Instrument;
        });
        setItems(mapped);
        console.log(`Successfully loaded ${mapped.length} instruments from Supabase`);
      } catch (e: any) {
        if (!cancelled) {
          console.error('Failed to load instruments:', e);
          setError(e?.message || 'Failed to load instruments');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [imageByName]);

  return (
    <section id="instruments" className="py-24 bg-muted/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Our Instruments
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Advanced Analytical Equipment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            State-of-the-art instruments for research and analysis across multiple disciplines.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">Error loading instruments: {error}</p>
          </div>
        )}

        {/* Instruments Grid */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {items.map((instrument) => (
              <InstrumentCard key={instrument.id} instrument={instrument} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No instruments available at the moment.</p>
          </div>
        )}

        {/* CTA Button */}
        {!loading && items.length > 0 && (
          <div className="text-center">
            <Button size="lg" variant="outline" className="group">
              View All Instruments
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
