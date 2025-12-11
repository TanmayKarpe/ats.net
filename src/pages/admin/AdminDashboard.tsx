import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LogOut, Settings, FileText, Users, Package } from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardItems = [
    {
      icon: Package,
      title: 'Instruments',
      description: 'Manage instruments, pricing, and details',
      href: '/admin/instruments',
    },
    {
      icon: Users,
      title: 'Leadership',
      description: 'Update leadership profiles and information',
      href: '/admin/leadership',
    },
    {
      icon: FileText,
      title: 'Services',
      description: 'Manage service offerings and descriptions',
      href: '/admin/services',
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Configure website content and settings',
      href: '/admin/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-foreground/80 mt-1">Manage ATS content and resources</p>
            </div>
            <Button
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Management Modules</h2>
          <p className="text-muted-foreground">
            Select a module below to manage ATS content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="group hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(item.href)}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center mb-4 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Separator className="my-12" />

        {/* Quick Info */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Admin Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Current Status</h3>
              <p className="text-sm text-muted-foreground">
                You are logged in as an administrator. All changes made here are stored locally
                and will persist across browser sessions until cleared.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">About Admin Panel</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Manage all ATS content from this dashboard</li>
                <li>• Changes are saved to your browser's local storage</li>
                <li>• Backend integration coming soon</li>
                <li>• Contact the development team for support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
