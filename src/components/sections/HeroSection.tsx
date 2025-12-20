import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

export function HeroSection() {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/50" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
          <Sparkles size={16} className="text-secondary" />
          <span className="text-sm font-medium">Open Access • Advanced Analytics • Research Excellence</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-slide-up">
          ATS
        </h1>
        <p className="text-2xl md:text-3xl text-white/90 font-semibold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-emerald-300 to-teal-300">
            Analytical Testing Services Cell
          </span>
        </p>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          From Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon – Empowering Innovation Through Precision Analysis. Access state-of-the-art instrumentation and expert characterization services at KBCNMU, Jalgaon. We bridge the gap between advanced research and actionable data.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link to="/instruments">
            <Button variant="hero" size="xl" className="group">
              View Instruments
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="heroOutline" size="xl">
            Submit Sample Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {[
            { value: '15+', label: 'Instruments' },
            { value: '500+', label: 'Samples/Month' },
            { value: '100+', label: 'Research Papers' },
            { value: '50+', label: 'Partner Institutions' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors">
              <p className="text-3xl md:text-4xl font-bold text-secondary">{stat.value}</p>
              <p className="text-sm text-white/70 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
