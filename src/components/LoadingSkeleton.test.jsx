import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardSkeleton, GridSkeleton, HeroSkeleton } from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders CardSkeleton', () => {
    const { container } = render(<CardSkeleton />);
    expect(container.firstChild).toHaveClass('aspect-[3/4]');
  });

  it('renders GridSkeleton with default count', () => {
    const { container } = render(<GridSkeleton />);
    expect(container.firstChild?.childNodes.length).toBe(8);
  });

  it('renders GridSkeleton with custom count', () => {
    const { container } = render(<GridSkeleton count={4} />);
    expect(container.firstChild?.childNodes.length).toBe(4);
  });

  it('renders HeroSkeleton', () => {
    const { container } = render(<HeroSkeleton />);
    expect(container.firstChild).toHaveClass('h-screen');
  });
});
