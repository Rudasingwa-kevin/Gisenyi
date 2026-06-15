import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false }),
}));

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer onAdminClick={() => {}} />
    </MemoryRouter>
  );

describe('Footer', () => {
  it('renders brand name', () => {
    renderFooter();
    expect(screen.getAllByText(/GISENYI/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders navigation links', () => {
    renderFooter();
    expect(screen.getByText('Stays')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('renders copyright', () => {
    renderFooter();
    expect(screen.getByText(/2026 Gisenyi Tourism/i)).toBeInTheDocument();
  });

  it('shows admin button when not logged in', () => {
    renderFooter();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
