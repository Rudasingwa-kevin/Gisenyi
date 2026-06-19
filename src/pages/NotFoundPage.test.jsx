import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

const renderPage = () =>
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );

describe('NotFoundPage', () => {
  it('renders 404 text', () => {
    renderPage();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders page not found message', () => {
    renderPage();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderPage();
    expect(screen.getByText(/doesn't exist or has been moved/)).toBeInTheDocument();
  });

  it('renders back to home link', () => {
    renderPage();
    const link = screen.getByText('Back to Home');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });
});
