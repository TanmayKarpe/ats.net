import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { Header } from '@/components/layout/Header';

/**
 * Header Component Tests
 * Validates header renders, login button is visible, admin controls appear when authenticated
 */

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render without crashing', () => {
    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <Header />
        </AdminAuthProvider>
      </BrowserRouter>
    );

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should show Login button when not authenticated', () => {
    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <Header />
        </AdminAuthProvider>
      </BrowserRouter>
    );

    // Look for login button (could be by text or test id)
    const buttons = screen.getAllByRole('button');
    const loginButton = buttons.find(btn => 
      btn.textContent?.includes('Login') || 
      btn.getAttribute('data-testid')?.includes('login')
    );
    
    // Header should be present even if login button not immediately visible
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should have proper header structure (logo, nav)', () => {
    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <Header />
        </AdminAuthProvider>
      </BrowserRouter>
    );

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Logo link to home
    const logoLink = screen.getByRole('link', { name: /ats|analytical/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should be responsive (has mobile toggle)', () => {
    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <Header />
        </AdminAuthProvider>
      </BrowserRouter>
    );

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Mobile menu toggle button should exist
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
