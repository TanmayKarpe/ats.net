import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Instruments', href: '#instruments' },
  { label: 'Services', href: '#services' },
  { label: 'Policies', href: '#policies' },
  { label: 'Training', href: '#training' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-card/90 backdrop-blur-lg shadow-lg py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300",
              isScrolled 
                ? "bg-primary text-primary-foreground" 
                : "bg-white/20 text-white backdrop-blur-sm"
            )}>
              SAIF
            </div>
            <div className="hidden sm:block">
              <p className={cn(
                "font-bold text-sm transition-colors duration-300",
                isScrolled ? "text-foreground" : "text-white"
              )}>
                KBCNMU Jalgaon
              </p>
              <p className={cn(
                "text-xs transition-colors duration-300",
                isScrolled ? "text-muted-foreground" : "text-white/70"
              )}>
                Sophisticated Analytical Instrument Facility
              </p>
            </div>
          </a>

          {/* Desktop Navigation with Auth inline */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  isScrolled 
                    ? "text-foreground hover:text-primary hover:bg-muted" 
                    : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
              </a>
            ))}
            
            {/* Auth inline with nav */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/20">
              {user ? (
                <>
                  <span className={cn(
                    "text-sm font-medium",
                    isScrolled ? "text-foreground" : "text-white"
                  )}>
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <Button
                    variant={isScrolled ? "outline" : "heroOutline"}
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant={isScrolled ? "default" : "heroOutline"}
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  <User className="w-4 h-4 mr-1" />
                  Login
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 py-4 border-t border-white/10">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                    isScrolled 
                      ? "text-foreground hover:bg-muted" 
                      : "text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </a>
              ))}
              {user ? (
                <Button variant="hero" size="lg" className="mt-4" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button variant="hero" size="lg" className="mt-4" onClick={() => navigate('/auth')}>
                  <User className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
