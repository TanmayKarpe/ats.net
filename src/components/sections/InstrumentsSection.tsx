import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { instruments as staticInstruments, type Instrument } from '@/data/instruments';
import { InstrumentCard } from '@/components/instruments/InstrumentCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export function InstrumentsSection() {
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
        const { data, error } = await supabase
          .from('instruments')
          .select('*');
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
            State-of-the-Art Equipment
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our comprehensive range of advanced analytical instruments designed to meet diverse research needs.
          </p>
        </div>

        {/* Instruments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-muted-foreground">Loading instruments…</div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-muted-foreground">No instruments available.</div>
          )}
          {!loading && !error && items.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} />
          ))}
          {error && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-destructive">{error}</div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Instruments
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
