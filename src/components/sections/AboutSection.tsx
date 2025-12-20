import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, Beaker, Users, Rocket } from 'lucide-react';

const aboutCards = [
  {
    icon: Target,
    title: 'Who We Are',
    description: 'We are a state-of-the-art analytical facility operating under KBCNMU, committed to delivering high-precision instrumentation and characterization services. Our facility serves researchers, academicians, and industry professionals across India, enabling reliable data generation, advanced analysis, and impactful scientific outcomes through world-class infrastructure and technical expertise.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Beaker,
    title: 'What We Do',
    description: 'We provide high-precision analytical and characterization solutions across a broad spectrum of scientific disciplines. Our facility supports advanced research in materials science, chemistry, biology, and physics, delivering the critical data and insights needed to drive innovation and technical breakthroughs.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Users,
    title: 'Who Can Use ATS',
    description: 'ATS is accessible to university researchers, external academic institutions, R&D laboratories, and industry collaborators. We actively support interdisciplinary research and industrial problem-solving, with subsidized access and special provisions available for students and academic collaborations to promote inclusive and high-quality research.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Rocket,
    title: 'Our Vision',
    description: 'To lead as a center of excellence in analytical characterization, providing seamless access to advanced instrumentation for both academic researchers and industrial partners. We are committed to supporting local industry through specialized sample analysis, fostering transformative research, and nurturing the scientific talent of tomorrow.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-tr from-accent/5 to-transparent rounded-tr-full" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Discover ATS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A premier analytical testing facility empowering breakthrough research through advanced instrumentation and expert support.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {aboutCards.map((card, index) => (
            <Card 
              key={card.title}
              className="group relative overflow-hidden border-0 bg-card shadow-lg hover:shadow-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative">
                <div className={`w-14 h-14 rounded-xl ${card.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon size={28} className={card.color} />
                </div>
                <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base leading-relaxed">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
