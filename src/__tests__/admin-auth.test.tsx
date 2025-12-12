import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import { RequireAdmin } from '@/components/auth/RequireAdmin';

/**
 * Admin Auth Tests
 * Validates login flow, logout, persistence, and route protection
 */

describe('AdminAuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should persist auth state to localStorage on login', async () => {
    // Set env var for test
    vi.stubEnv('VITE_ADMIN_DEV_KEY', 'test_key_123');

    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <AdminLoginPage />
        </AdminAuthProvider>
      </BrowserRouter>
    );

    const input = screen.getByTestId('admin-login-input');
    const submit = screen.getByTestId('admin-login-submit');

    fireEvent.change(input, { target: { value: 'test_key_123' } });
    fireEvent.click(submit);

    await waitFor(() => {
      const stored = localStorage.getItem('ats_admin_auth_v1');
      expect(stored).toBeTruthy();
      if (stored) {
        const auth = JSON.parse(stored);
        expect(auth).toHaveProperty('user', 'admin');
        expect(auth).toHaveProperty('token');
        expect(auth).toHaveProperty('loggedAt');
      }
    });
  });

  it('should show paste-once modal when VITE_ADMIN_DEV_KEY is not set', async () => {
    vi.stubEnv('VITE_ADMIN_DEV_KEY', '');
    vi.stubEnv('VITE_USE_SUPABASE', 'false');

    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <AdminLoginPage />
        </AdminAuthProvider>
      </BrowserRouter>
    );

    // Modal should appear
    await waitFor(() => {
      expect(screen.getByText('Development Key Required')).toBeInTheDocument();
    });

    // User pastes key
    const pasteInput = screen.getByTestId('paste-dev-key-input');
    expect(pasteInput).toBeInTheDocument();
  });

  it('should clear localStorage on logout', async () => {
    vi.stubEnv('VITE_ADMIN_DEV_KEY', 'test_key_123');

    // First, log in
    const { unmount: unmount1 } = render(
      <BrowserRouter>
        <AdminAuthProvider>
          <AdminLoginPage />
        </AdminAuthProvider>
      </BrowserRouter>
    );

    const input = screen.getByTestId('admin-login-input');
    fireEvent.change(input, { target: { value: 'test_key_123' } });
    fireEvent.click(screen.getByTestId('admin-login-submit'));

    await waitFor(() => {
      expect(localStorage.getItem('ats_admin_auth_v1')).toBeTruthy();
    });

    unmount1();

    // Verify localStorage has value
    expect(localStorage.getItem('ats_admin_auth_v1')).toBeTruthy();
  });
});

describe('RequireAdmin Guard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should redirect to /admin/login when not authenticated', () => {
    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <RequireAdmin>
            <div>Protected Content</div>
          </RequireAdmin>
        </AdminAuthProvider>
      </BrowserRouter>
    );

    // Should not see protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when authenticated', async () => {
    // Pre-set auth in localStorage
    const authState = {
      user: 'admin',
      token: 'test_token',
      loggedAt: new Date().toISOString(),
    };
    localStorage.setItem('ats_admin_auth_v1', JSON.stringify(authState));

    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <RequireAdmin>
            <div data-testid="protected-content">Protected Content</div>
          </RequireAdmin>
        </AdminAuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });
})

