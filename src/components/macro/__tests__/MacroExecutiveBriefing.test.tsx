import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MacroExecutiveBriefing } from '../briefing/MacroExecutiveBriefing';

describe('MacroExecutiveBriefing Component', () => {
  it('renders hero title, pulse radars, and domain cards', () => {
    const handleSelectTab = vi.fn();
    render(<MacroExecutiveBriefing onSelectTab={handleSelectTab} />);

    expect(screen.getByText(/Executive Briefing & Global Macro Pulse/i)).toBeDefined();
    expect(screen.getByText(/10Y–2Y Sovereign Spread/i)).toBeDefined();
    expect(screen.getByText(/ICE BofA MOVE Index/i)).toBeDefined();
    expect(screen.getByText(/Sahm Rule Delta/i)).toBeDefined();
    expect(screen.getByText(/Energy % World GDP/i)).toBeDefined();

    // 5 Pillar Cards
    expect(screen.getByText('Regimes & Business Cycle')).toBeDefined();
    expect(screen.getByText('Rates, Liquidity & Debt')).toBeDefined();
    expect(screen.getByText('Credit & Market Structure')).toBeDefined();
    expect(screen.getByText('Physical Economy & Inflation')).toBeDefined();
    expect(screen.getByText('External Sector & Events')).toBeDefined();
  });

  it('triggers onSelectTab when domain cards are clicked', () => {
    const handleSelectTab = vi.fn();
    render(<MacroExecutiveBriefing onSelectTab={handleSelectTab} />);

    const cycleCard = screen.getByText('Regimes & Business Cycle');
    fireEvent.click(cycleCard);
    expect(handleSelectTab).toHaveBeenCalledWith('regimes');

    const ratesCard = screen.getByText('Rates, Liquidity & Debt');
    fireEvent.click(ratesCard);
    expect(handleSelectTab).toHaveBeenCalledWith('yields');
  });
});
