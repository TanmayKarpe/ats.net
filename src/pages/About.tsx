import { AboutSection } from '@/components/sections/AboutSection';
import { LeadershipSection } from '@/components/sections/LeadershipSection';

export default function AboutPage() {
  return (
    <>
      <div className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About ATS</h1>
          <p className="text-xl text-muted-foreground">Learn more about our facility, mission, and the team behind it.</p>
        </div>
      </div>
      <LeadershipSection />
      <AboutSection />
    </>
  );
}
