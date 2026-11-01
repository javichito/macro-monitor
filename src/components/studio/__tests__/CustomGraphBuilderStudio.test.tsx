import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '@/context/AppContext';
import { CustomGraphBuilderStudio } from '../CustomGraphBuilderStudio';

function renderWithProvider() {
  return render(
    <AppProvider>
      <CustomGraphBuilderStudio />
    </AppProvider>
  );
}

describe('CustomGraphBuilderStudio Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders editorial curiosity headline, curated graph recipes, and default series layers', () => {
    renderWithProvider();

    expect(
      screen.getByText(/What Happens When You Plot Any Two Economic Forces Together\?/i)
    ).toBeDefined();
    expect(screen.getByText(/Configure Plotted Metrics/i)).toBeDefined();
    expect(screen.getByText(/Step 1: Predict Pearson Correlation \(r\)/i)).toBeDefined();
  });

  it('allows adding a metric series layer up to 4 layers', () => {
    renderWithProvider();

    expect(screen.getByLabelText(/Select Metric for Series 3/i)).toBeDefined();
    expect(screen.queryByLabelText(/Select Metric for Series 4/i)).toBeNull();

    const addLayerBtn = screen.getByRole('button', { name: /Add Metric Layer/i });
    fireEvent.click(addLayerBtn);

    expect(screen.getByLabelText(/Select Metric for Series 4/i)).toBeDefined();
  });

  it('renders an accessible semantic data table when Data Table toggle is activated', () => {
    renderWithProvider();

    const tableToggleBtn = screen.getByRole('button', { name: /Data Table/i });
    fireEvent.click(tableToggleBtn);

    const table = screen.getByRole('table');
    expect(table).toBeDefined();
    expect(screen.getByText(/Historical data table from/i)).toBeDefined();
  });

  it('switches to 26-Country Snapshot mode and displays sovereign comparison controls', () => {
    renderWithProvider();

    const snapshotRadio = screen.getByRole('radio', { name: /26-Country Snapshot/i });
    fireEvent.click(snapshotRadio);

    expect(
      screen.getByText(/Compare Any Sovereign Metric Across All 26 Economies/i)
    ).toBeDefined();
    expect(screen.getByLabelText(/01 \/ Primary Metric \(X-Axis \/ Ranking\):/i)).toBeDefined();
  });

  it('pins a custom graph to the persistent My Saved Graph Board', () => {
    renderWithProvider();

    const pinBtn = screen.getByRole('button', { name: /Pin to My Board/i });
    fireEvent.click(pinBtn);

    expect(screen.getByText(/Pinned \(\+15 XP\)!/i)).toBeDefined();
  });

  it('evaluates the Predict-First Correlation Intuition Lab challenge', () => {
    renderWithProvider();

    const lockPredictionBtn = screen.getByRole('button', {
      name: /Lock In Prediction & Reveal r \(\+15 XP\)/i,
    });
    fireEvent.click(lockPredictionBtn);

    expect(screen.getByText(/Intuition Checked \(\+15 XP\)/i)).toBeDefined();
    expect(screen.getByText(/Actual r =/i)).toBeDefined();
  });
});
