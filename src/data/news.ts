import { GraduationCap, Newspaper, Wrench } from 'lucide-react';

export const newsItems = [
  {
    type: 'Training',
    icon: GraduationCap,
    title: 'Hands-on Training Workshop on FE-SEM',
    description: 'Two-day intensive workshop on sample preparation and imaging techniques for field emission scanning electron microscopy.',
    date: 'Dec 15-16, 2025',
    color: 'bg-secondary',
  },
  {
    type: 'Announcement',
    icon: Newspaper,
    title: 'New NMR Spectrometer Installation',
    description: 'ATS is pleased to announce the installation of a new 500 MHz NMR spectrometer with advanced capabilities.',
    date: 'Nov 28, 2025',
    color: 'bg-accent',
  },
  {
    type: 'Maintenance',
    icon: Wrench,
    title: 'Scheduled Maintenance: XRD System',
    description: 'The X-Ray Diffractometer will be under scheduled maintenance. Samples submitted before Dec 1 will be processed.',
    date: 'Dec 5-8, 2025',
    color: 'bg-amber-500',
  },
];
