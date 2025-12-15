import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Home, Package, DollarSign, Bell, FileText, Settings, Users } from 'lucide-react';

export default function AdminLayout() {
  const sections = [
    { title: 'Dashboard', href: '/admin', icon: Home },
    { title: 'Instruments', href: '/admin/instruments', icon: Package },
    { title: 'Components', href: '/admin/components', icon: Package },
    { title: 'Prices', href: '/admin/prices', icon: DollarSign },
    { title: 'Announcements', href: '/admin/announcements', icon: Bell },
    { title: 'Info Blocks', href: '/admin/info-blocks', icon: FileText },
    { title: 'Departments', href: '/admin/departments', icon: Users },
    { title: 'Enquiries', href: '/admin/enquiries', icon: Bell },
    { title: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-72 border-r bg-muted/40 p-4">
        <div className="mb-6 px-2">
          <h2 className="text-xl font-bold">ATS Admin</h2>
          <p className="text-sm text-muted-foreground">Manage the ATS dashboard</p>
        </div>
        <nav className="space-y-1 px-2">
          {sections.map((s) => (
            <Link to={s.href} key={s.href} className="block">
              <Button variant="ghost" className="w-full justify-start">
                <s.icon className="w-4 h-4 mr-2" /> {s.title}
              </Button>
            </Link>
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="px-2">
          <Card className="p-3 bg-muted/10">
            <div className="text-sm">Admin tools</div>
          </Card>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
