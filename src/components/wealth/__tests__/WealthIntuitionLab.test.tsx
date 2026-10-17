import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WealthIntuitionLab } from '../WealthIntuitionLab';
import { AppProvider } from '../../../context/AppContext';

describe('WealthIntuitionLab Component', () => {
  it('allows learners to adjust prediction slider and reveal empirical comparison', () => {
    render(
      <AppProvider>
        <WealthIntuitionLab
          selectedYear={2026}
          medianWealthUsd={9750}
          meanWealthUsd={98200}
          adultPopulationBillions={5.45}
        />
      </AppProvider>
    );

    expect(screen.getByText(/Interactive Intuition Lab/i)).toBeDefined();
    expect(screen.getByText(/Why do 9 out of 10 people guess too high\?/i)).toBeDefined();

    const slider = screen.getByLabelText('Guess median global adult wealth');
    fireEvent.change(slider, { target: { value: '10000' } });

    const revealBtn = screen.getByRole('button', { name: /Reveal the Reality/i });
    fireEvent.click(revealBtn);

    expect(screen.getByText(/True Global Median \(50th Percentile\)/i)).toBeDefined();
    expect(screen.getByText(/The Billionaire in the Bar Effect:/i)).toBeDefined();
    expect(screen.getByText(/Completed \(\+15 XP\)/i)).toBeDefined();
  });
});
