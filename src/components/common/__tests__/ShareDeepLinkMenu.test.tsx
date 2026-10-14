import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ShareDeepLinkMenu } from '../ShareDeepLinkMenu';

describe('ShareDeepLinkMenu Component', () => {
  const sampleState = {
    country: 'USA',
    scenario: 'custom',
    bondYield: 5.2,
    primaryDeficit: 6.5,
    realGrowth: 2.0,
    inflation: 3.1,
  };

  it('renders trigger button and chevron toggle', () => {
    render(<ShareDeepLinkMenu simulator="fiscal" state={sampleState} label="Share Simulation" />);

    expect(screen.getByRole('button', { name: /Share Simulation/i })).toBeDefined();
    expect(screen.getByTitle(/Choose link format/i)).toBeDefined();
  });

  it('copies hash deep-link directly when clicking the main button', async () => {
    let copiedText = '';
    Object.assign(navigator, {
      clipboard: {
        writeText: (text: string) => {
          copiedText = text;
          return Promise.resolve();
        },
      },
    });

    render(<ShareDeepLinkMenu simulator="fiscal" state={sampleState} />);

    const shareButton = screen.getByRole('button', { name: /Share Simulation/i });
    await act(async () => {
      fireEvent.click(shareButton);
    });

    expect(copiedText).toContain('tab=liquidity');
    expect(copiedText).toContain('#fiscal-simulator?');
    expect(screen.getByText(/Link Copied!/i)).toBeDefined();
  });

  it('opens popover menu when chevron is clicked and allows query string format copy', async () => {
    let copiedText = '';
    Object.assign(navigator, {
      clipboard: {
        writeText: (text: string) => {
          copiedText = text;
          return Promise.resolve();
        },
      },
    });

    render(<ShareDeepLinkMenu simulator="fiscal" state={sampleState} />);

    const chevron = screen.getByTitle(/Choose link format/i);
    fireEvent.click(chevron);

    expect(screen.getByText('Shareable Deep-Link Formats')).toBeDefined();
    expect(screen.getByText('URL Hash Link')).toBeDefined();
    expect(screen.getByText('Query String Link')).toBeDefined();

    const queryOption = screen.getByRole('menuitem', { name: /Query String Link/i });
    await act(async () => {
      fireEvent.click(queryOption);
    });

    expect(copiedText).toContain('fds_c=USA');
    expect(copiedText).toContain('fds_y=5.20');
  });

  it('closes popover on Escape key', () => {
    render(<ShareDeepLinkMenu simulator="fiscal" state={sampleState} />);

    const chevron = screen.getByTitle(/Choose link format/i);
    fireEvent.click(chevron);
    expect(screen.getByText('Shareable Deep-Link Formats')).toBeDefined();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Shareable Deep-Link Formats')).toBeNull();
  });
});
