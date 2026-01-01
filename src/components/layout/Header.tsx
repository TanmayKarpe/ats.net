import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { navItems } from '@/data/nav';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef<number>(0);
  const stopTimerRef = useRef<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [devAccessEnabled, setDevAccessEnabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      const delta = currentY - lastY;
      const scrollingDown = delta > 2;
      const scrollingUp = delta < -2;

      setIsScrolled(currentY > 20);

      // Always show at or near top
      if (currentY <= 0) {
        setIsHidden(false);
      }

      // Direction-based visibility
      if (scrollingDown) {
        setIsHidden(true);
      } else if (scrollingUp) {
        setIsHidden(false);
      }

      // Debounced show on scroll stop
      if (stopTimerRef.current) {
        window.clearTimeout(stopTimerRef.current);
      }
      stopTimerRef.current = window.setTimeout(() => {
        setIsHidden(false);
      }, 200);

      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (stopTimerRef.current) {
        window.clearTimeout(stopTimerRef.current);
      }
    };
  }, []);

  // Initialize dev access from localStorage: localStorage.setItem('ATS_DEV_ACCESS', 'true')
  useEffect(() => {
    setDevAccessEnabled(localStorage.getItem('ATS_DEV_ACCESS') === 'true');
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-200 backdrop-blur-lg transition-transform ease-out duration-200',
        isScrolled
          ? 'bg-card shadow-lg py-3'
          : 'bg-card/70 shadow-md py-4',
        isHidden ? '-translate-y-full opacity-95' : 'translate-y-0 opacity-100'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {!isHome && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Back to home"
              >
                <span aria-hidden>←</span>
                <span>Home</span>
              </button>
            )}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 bg-primary text-primary-foreground">
                ATS
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-sm transition-colors duration-300 text-foreground">
                  Analytical Testing Services
                </p>
                <p className="text-xs transition-colors duration-300 text-muted-foreground">
                  Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {[{ label: 'Services', href: '/services' }, { label: 'Instruments', href: '/instruments' }, { label: 'Consultancy', href: '/consultancy' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-muted text-foreground hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <span className="text-sm font-medium text-foreground">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : null}
            {devAccessEnabled && !user && (
              <button
                onClick={() => navigate('/admin/login')}
                className="px-3 py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Admin
              </button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors text-foreground"
            )}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col gap-2">
              {[{ label: 'Services', href: '/services' }, { label: 'Instruments', href: '/instruments' }, { label: 'Consultancy', href: '/consultancy' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-muted text-foreground hover:text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
                {user ? (
                  <>
                    <span className={cn(
                      "text-sm font-medium px-3 py-2 text-foreground"
                    )}>
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
