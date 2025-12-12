import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { navItems } from '@/data/nav';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-card/90 backdrop-blur-lg shadow-lg py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300",
              isScrolled 
                ? "bg-primary text-primary-foreground" 
                : "bg-white/20 text-white backdrop-blur-sm"
            )}>
              ATS
            </div>
            <div className="hidden sm:block">
              <p className={cn(
                "font-bold text-sm transition-colors duration-300",
                isScrolled ? "text-foreground" : "text-white"
              )}>
                Analytical Testing Services
              </p>
              <p className={cn(
                "text-xs transition-colors duration-300",
                isScrolled ? "text-muted-foreground" : "text-white/70"
              )}>
                Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon
              </p>
            </div>
          </Link>

          {/* Desktop Navigation with Auth inline */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  isScrolled 
                    ? "text-foreground hover:text-primary hover:bg-muted" 
                    : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
              </Link>
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
                <>
                  <Button
                    variant={isScrolled ? "default" : "heroOutline"}
                    size="sm"
                    onClick={() => navigate('/auth')}
                  >
                    <User className="w-4 h-4 mr-1" />
                    Login
                  </Button>
                  <Button
                    variant={isScrolled ? "ghost" : "ghost"}
                    size="sm"
                    onClick={() => navigate('/admin/login')}
                    title="Admin Portal"
                    className="text-xs"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </>
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
          <nav className="lg:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10",
                    isScrolled 
                      ? "text-foreground hover:text-primary hover:bg-muted" 
                      : "text-white/90 hover:text-white"
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
                      "text-sm font-medium px-3 py-2",
                      isScrolled ? "text-foreground" : "text-white"
                    )}>
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <Button
                      variant={isScrolled ? "outline" : "heroOutline"}
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={isScrolled ? "default" : "heroOutline"}
                      size="sm"
                      onClick={() => {
                        navigate('/auth');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                    <Button
                      variant={isScrolled ? "outline" : "heroOutline"}
                      size="sm"
                      onClick={() => {
                        navigate('/admin/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Portal
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
