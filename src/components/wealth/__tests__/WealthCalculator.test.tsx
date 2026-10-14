import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WealthCalculator } from '../WealthCalculator';

describe('WealthCalculator Component', () => {
  it('renders default Wealth Calculator state for USA with 65k net worth', () => {
    render(<WealthCalculator />);

    expect(screen.getByText('Where Do You Stand? (Personal Wealth Positioner)')).toBeDefined();
    expect(screen.getByText('Select Your Country')).toBeDefined();
    expect(screen.getByLabelText(/Your Estimated Net Worth/i)).toBeDefined();
  });

  it('updates net worth value when preset chip is clicked', () => {
    render(<WealthCalculator />);

    const preset200k = screen.getByRole('button', { name: /\$200/i });
    fireEvent.click(preset200k);

    const input = screen.getByLabelText(/Your Estimated Net Worth/i) as HTMLInputElement;
    expect(input.value).toBe('200000');
  });

  it('hydrates wealth assumptions from deep-link URL hash', () => {
    const originalHash = window.location.hash;
    window.location.hash = '#wealth-calculator?c=ESP&nw=300000';

    render(<WealthCalculator />);

    expect(screen.getByText(/Shared Scenario Loaded:/i)).toBeDefined();
    expect(screen.getByText(/Positioned for Spain with \$300,000/i)).toBeDefined();

    const input = screen.getByLabelText(/Your Estimated Net Worth/i) as HTMLInputElement;
    expect(input.value).toBe('300000');

    window.location.hash = originalHash;
  });

  it('hydrates wealth assumptions from URL query string parameters', () => {
    delete (window as any).location;
    window.location = new URL('https://macro-monitor.app/wealth?wc_c=CHE&wc_nw=850000') as any;

    render(<WealthCalculator />);

    expect(screen.getByText(/Shared Scenario Loaded:/i)).toBeDefined();
    expect(screen.getByText(/Positioned for Switzerland with \$850,000/i)).toBeDefined();

    window.location = new URL('https://macro-monitor.app/wealth') as any;
  });

  it('copies shareable deep-link URL when Share Assumptions button is clicked', async () => {
    let copiedText = '';
    Object.assign(navigator, {
      clipboard: {
        writeText: (text: string) => {
          copiedText = text;
          return Promise.resolve();
        },
      },
    });

    render(<WealthCalculator />);

    const shareButton = screen.getByRole('button', { name: /Share Assumptions/i });
    expect(shareButton).toBeDefined();

    await act(async () => {
      fireEvent.click(shareButton);
    });

    expect(copiedText).toContain('#wealth-calculator?');
    expect(copiedText).toContain('c=USA');
    expect(copiedText).toContain('nw=65000');
  });
});
