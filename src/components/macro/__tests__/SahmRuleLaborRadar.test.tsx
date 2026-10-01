import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SahmRuleLaborRadar } from '../SahmRuleLaborRadar';

describe('SahmRuleLaborRadar Component', () => {
  it('renders radar header, status badge, and Sahm threshold gauge', () => {
    render(<SahmRuleLaborRadar />);

    expect(screen.getByText('Labor Market Health & Claudia Sahm Recession Radar')).toBeDefined();
    expect(screen.getByText(/Claudia Sahm Recession Threshold Meter/i)).toBeDefined();
    expect(screen.getByText(/Critical Tipping Point/i)).toBeDefined();
    expect(screen.getByText('+0.50%')).toBeDefined();
  });

  it('renders primary labor indicators (Unemployment, Participation, V/U, Wage Growth)', () => {
    render(<SahmRuleLaborRadar />);

    expect(screen.getByText('Headline Unemployment')).toBeDefined();
    expect(screen.getByText('Participation (LFPR)')).toBeDefined();
    expect(screen.getByText('Job Openings per Jobseeker')).toBeDefined();
    expect(screen.getByText('Wage Growth YoY')).toBeDefined();
  });

  it('allows switching sovereign labor profile across 13 global economies', () => {
    render(<SahmRuleLaborRadar />);

    const deuBtn = screen.getByRole('button', { name: /DEU/i });
    fireEvent.click(deuBtn);
    expect(screen.getByText('6.1%')).toBeDefined();
    expect(screen.getByText(/Elevated/i)).toBeDefined();

    const fraBtn = screen.getByRole('button', { name: /FRA/i });
    fireEvent.click(fraBtn);
    expect(screen.getByText('7.4%')).toBeDefined();

    const ausBtn = screen.getByRole('button', { name: /AUS/i });
    fireEvent.click(ausBtn);
    expect(screen.getByText('4.1%')).toBeDefined();
  });

  it('allows toggling between Sahm & Labor Stack and Phillips Curve views', () => {
    render(<SahmRuleLaborRadar />);

    const phillipsTab = screen.getByRole('button', { name: /Phillips Curve/i });
    fireEvent.click(phillipsTab);

    expect(screen.getByText(/Filter by historical macroeconomic era/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /1980s/i })).toBeDefined();

    const sahmTab = screen.getByRole('button', { name: /Sahm & Labor Stack/i });
    fireEvent.click(sahmTab);

    expect(screen.getByText('Headline Unemployment')).toBeDefined();
  });
});
