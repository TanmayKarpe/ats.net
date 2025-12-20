import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { InstrumentsSection } from '@/components/sections/InstrumentsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { LeadershipSection } from '@/components/sections/LeadershipSection';
import { AIAssistantSection } from '@/components/sections/AIAssistantSection';
import { NewsSection } from '@/components/sections/NewsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LeadershipSection />
      <AboutSection />
      <InstrumentsSection featuredOnly />
      <ServicesSection />
      <AIAssistantSection />
      <NewsSection />
    </>
  );
}
