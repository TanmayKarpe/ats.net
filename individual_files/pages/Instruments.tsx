import { InstrumentsSection } from '@/components/sections/InstrumentsSection';

export default function InstrumentsPage() {
  return (
    <>
      <div className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Instruments</h1>
          <p className="text-xl text-muted-foreground">Explore our comprehensive range of advanced analytical instruments.</p>
        </div>
      </div>
      <InstrumentsSection />
    </>
  );
}
