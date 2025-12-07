import { facilities } from '@/data/facilities';
import { FacilityCard } from '@/components/facilities/FacilityCard';

export default function FacilitiesPage() {
  return (
    <>
      <div className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Facilities</h1>
          <p className="text-xl text-muted-foreground">SAIF at KBCNMU Jalgaon is equipped with world-class analytical instrumentation, providing state-of-the-art facilities for research and industrial analysis.</p>
        </div>
      </div>

      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
