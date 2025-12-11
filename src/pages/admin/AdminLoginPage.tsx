import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Lock, Beaker, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [devKey, setDevKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDevKeyModal, setShowDevKeyModal] = useState(false);
  const [tempDevKey, setTempDevKey] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if VITE_ADMIN_DEV_KEY is configured
  useEffect(() => {
    const hasDevKey = import.meta.env.VITE_ADMIN_DEV_KEY;
    const useSupa = import.meta.env.VITE_USE_SUPABASE === 'true';

    if (!hasDevKey && !useSupa) {
      setShowDevKeyModal(true);
    }
  }, []);

  const handleDevKeyModalSubmit = () => {
    if (!tempDevKey.trim()) {
      toast({
        title: 'Dev Key Required',
        description: 'Please paste the development key.',
        variant: 'destructive',
      });
      return;
    }

    sessionStorage.setItem('_ats_temp_dev_key', tempDevKey);
    setDevKey(tempDevKey);
    setShowDevKeyModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let keyToUse = devKey;

    if (!keyToUse) {
      const sessionKey = sessionStorage.getItem('_ats_temp_dev_key');
      if (sessionKey) {
        keyToUse = sessionKey;
      }
    }

    const success = login(keyToUse);

    if (success) {
      toast({
        title: 'Success',
        description: 'You are now logged in as admin.',
      });
      navigate('/admin');
    } else {
      toast({
        title: 'Authentication Failed',
        description: 'Invalid development key. Please check and try again.',
        variant: 'destructive',
      });
      setDevKey('');
      sessionStorage.removeItem('_ats_temp_dev_key');
    }

    setLoading(false);
  };

  return (
    <>
      {/* Dev Key Modal (shown once if env var not set) */}
      <Dialog open={showDevKeyModal} onOpenChange={setShowDevKeyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Development Key Required
            </DialogTitle>
            <DialogDescription>
              The development environment key is not set. Paste it below to continue with local dev auth.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="temp-dev-key" className="text-sm font-medium">
                Paste your development key
              </Label>
              <Input
                id="temp-dev-key"
                type="password"
                placeholder="Paste key here..."
                value={tempDevKey}
                onChange={(e) => setTempDevKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDevKeyModalSubmit();
                  }
                }}
                autoFocus
                data-testid="paste-dev-key-input"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This key is only used for this session and not stored permanently. See docs/admin-dev-setup.md for details.
            </p>
            <Button
              onClick={handleDevKeyModalSubmit}
              className="w-full"
              disabled={!tempDevKey.trim()}
              data-testid="paste-dev-key-submit"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Page */}
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Beaker className="w-5 h-5" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-center">
                Analytical Testing Services Management
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dev-key" className="text-sm font-medium">
                    Development Key
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="dev-key"
                      type="password"
                      placeholder="Enter your development key"
                      value={devKey}
                      onChange={(e) => setDevKey(e.target.value)}
                      className="pl-10"
                      required
                      autoFocus
                      data-testid="admin-login-input"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set VITE_ADMIN_DEV_KEY in .env.local or check docs/admin-dev-setup.md
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  disabled={loading || !devKey}
                  data-testid="admin-login-submit"
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-6">
                This is a restricted admin area. Only authorized personnel can access this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
