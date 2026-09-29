import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileTabBar } from '../MobileTabBar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/macro',
}));

/*
 * Unit tests for the Apple-style mobile bottom tab bar,
 * verifying that all primary destinations render with appropriate labels
 * and active path highlighting.
 */
describe('MobileTabBar Component', () => {
  it('renders all 5 primary mobile navigation tabs with appropriate links', () => {
    render(<MobileTabBar />);

    const nav = screen.getByRole('navigation', { name: 'Mobile Navigation Bar' });
    expect(nav).toBeDefined();

    expect(screen.getByText('Overview')).toBeDefined();
    expect(screen.getByText('Wealth')).toBeDefined();
    expect(screen.getByText('Assets')).toBeDefined();
    expect(screen.getByText('Geography')).toBeDefined();
    expect(screen.getByText('Macro')).toBeDefined();

    const overviewLink = screen.getByText('Overview').closest('a');
    expect(overviewLink?.getAttribute('href')).toBe('/');

    const macroLink = screen.getByText('Macro').closest('a');
    expect(macroLink?.getAttribute('href')).toBe('/macro');
  });

  it('applies active styling to the currently active path', () => {
    render(<MobileTabBar />);

    const macroLink = screen.getByText('Macro').closest('a');
    expect(macroLink?.className).toContain('text-sky-500');
  });
});
