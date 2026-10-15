import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MacroPillarNav } from '../navigation/MacroPillarNav';

describe('MacroPillarNav Component', () => {
  it('renders all 5 macro pillars and the All option', () => {
    const handleTabChange = vi.fn();
    render(<MacroPillarNav activeTab="briefing" onTabChange={handleTabChange} />);

    expect(screen.getByRole('button', { name: /Executive Briefing/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Regimes & Business Cycle/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Rates, Liquidity & Debt/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Credit & Market Structure/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Physical Economy & Inflation/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /External Sector & Calendar/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /All/i })).toBeDefined();
  });

  it('triggers onTabChange with first subtab when a pillar is clicked', () => {
    const handleTabChange = vi.fn();
    render(<MacroPillarNav activeTab="briefing" onTabChange={handleTabChange} />);

    const cycleBtn = screen.getByRole('button', { name: /Regimes & Business Cycle/i });
    fireEvent.click(cycleBtn);

    expect(handleTabChange).toHaveBeenCalledWith('regimes');
  });

  it('renders contextual sub-tabs when an active sub-tab is selected', () => {
    const handleTabChange = vi.fn();
    render(<MacroPillarNav activeTab="yields" onTabChange={handleTabChange} />);

    expect(screen.getByRole('button', { name: /Sovereign Yield Curves & 3D/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Bond Volatility & Collateral/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Central Bank Liquidity & Fiscal/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Money Velocity & Issuance/i })).toBeDefined();

    const volSubTab = screen.getByRole('button', { name: /Bond Volatility & Collateral/i });
    fireEvent.click(volSubTab);
    expect(handleTabChange).toHaveBeenCalledWith('volatility');
  });
});
