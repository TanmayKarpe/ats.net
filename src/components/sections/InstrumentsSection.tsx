import { ArrowRight } from 'lucide-react';
import { instruments } from '@/data/instruments';
import { InstrumentCard } from '@/components/instruments/InstrumentCard';
import { Button } from '@/components/ui/button';

export function InstrumentsSection() {
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
          {instruments.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} />
          ))}
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
