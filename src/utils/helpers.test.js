import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatDateShort, toDateString } from './helpers';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const bar = undefined;
    expect(cn('foo', bar)).toBe('foo');
  });

  it('deduplicates tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2026-06-20');
    expect(result).toContain('June');
    expect(result).toContain('20');
    expect(result).toContain('2026');
  });

  it('formats Date object', () => {
    const result = formatDate(new Date('2026-07-04'));
    expect(result).toContain('July');
    expect(result).toContain('4');
  });

  it('returns empty string for falsy input', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});

describe('formatDateShort', () => {
  it('formats short date', () => {
    const result = formatDateShort('2026-06-20');
    expect(result).toContain('Jun');
    expect(result).toContain('20');
  });

  it('returns empty string for falsy input', () => {
    expect(formatDateShort('')).toBe('');
  });
});

describe('toDateString', () => {
  it('converts to YYYY-MM-DD', () => {
    const result = toDateString('2026-06-20T12:00:00Z');
    expect(result).toBe('2026-06-20');
  });

  it('converts Date object to YYYY-MM-DD', () => {
    const result = toDateString(new Date('2026-12-25'));
    expect(result).toBe('2026-12-25');
  });

  it('returns empty string for falsy input', () => {
    expect(toDateString(null)).toBe('');
  });
});
