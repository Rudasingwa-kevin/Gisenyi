import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginModal from './LoginModal';

const mockLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe('LoginModal', () => {
  beforeEach(() => mockLogin.mockReset());

  it('does not render when closed', () => {
    render(
      <MemoryRouter>
        <LoginModal isOpen={false} onClose={() => {}} />
      </MemoryRouter>
    );
    expect(screen.queryByText('Admin Login')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <MemoryRouter>
        <LoginModal isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('has username and password inputs', () => {
    render(
      <MemoryRouter>
        <LoginModal isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('admin')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('calls login with credentials on submit', async () => {
    mockLogin.mockResolvedValue({ username: 'admin' });
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <LoginModal isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'pass123' } });
    fireEvent.submit(screen.getByText('Sign In').closest('form'));

    await vi.waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin', 'pass123');
    });
  });

  it('calls onClose after successful login', async () => {
    mockLogin.mockResolvedValue({ username: 'admin' });
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <LoginModal isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'pass' } });
    fireEvent.submit(screen.getByText('Sign In').closest('form'));

    await vi.waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
