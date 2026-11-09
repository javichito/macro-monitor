import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AppProvider, useApp } from '../AppContext';
import { Header } from '../../components/layout/Header';

/*
 * Verification tests for PWA and OS device-level Light/Dark appearance switching,
 * testing default mediaQuery detection, manual overrides, and DOM attribute synchronization.
 */

function TestConsumer() {
  const { themePreference, setThemePreference, resolvedTheme } = useApp();
  return (
    <div>
      <span data-testid="theme-pref">{themePreference}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setThemePreference('light')}>Set Light</button>
      <button onClick={() => setThemePreference('dark')}>Set Dark</button>
      <button onClick={() => setThemePreference('system')}>Set System</button>
    </div>
  );
}

describe('Theme Context & Device Color Scheme Synchronization', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');

    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false, // Default to light system in test unless overridden
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('detects system preference and applies corresponding classes to DOM root', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    expect(screen.getByTestId('theme-pref').textContent).toBe('system');
    expect(screen.getByTestId('resolved-theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('switches to dark mode on user selection and updates localStorage', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    const darkBtn = screen.getByText('Set Dark');
    act(() => {
      fireEvent.click(darkBtn);
    });

    expect(screen.getByTestId('theme-pref').textContent).toBe('dark');
    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('macro_theme')).toBe('dark');
  });

  it('switches to light mode on user selection and updates localStorage', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    const lightBtn = screen.getByText('Set Light');
    act(() => {
      fireEvent.click(lightBtn);
    });

    expect(screen.getByTestId('theme-pref').textContent).toBe('light');
    expect(screen.getByTestId('resolved-theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('macro_theme')).toBe('light');
  });
});

describe('Header Appearance Controls', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to System on the selector trigger and reveals all 3 options when clicked', () => {
    render(
      <AppProvider>
        <Header />
      </AppProvider>
    );

    const trigger = screen.getByRole('button', { name: /Appearance theme: System/i });
    expect(trigger).toBeDefined();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    act(() => {
      fireEvent.click(trigger);
    });

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByLabelText('Auto System Theme')).toBeDefined();
    expect(screen.getByLabelText('Light Mode')).toBeDefined();
    expect(screen.getByLabelText('Dark Mode')).toBeDefined();
  });

  it('allows selecting Light Mode from the popover selector, persists to localStorage, and closes the menu', () => {
    render(
      <AppProvider>
        <Header />
      </AppProvider>
    );

    const trigger = screen.getByRole('button', { name: /Appearance theme: System/i });
    act(() => {
      fireEvent.click(trigger);
    });

    const lightBtn = screen.getByLabelText('Light Mode');
    act(() => {
      fireEvent.click(lightBtn);
    });

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('macro_theme')).toBe('light');
    expect(screen.getByRole('button', { name: /Appearance theme: Light/i }).getAttribute('aria-expanded')).toBe('false');
  });

  it('hydrates stored theme preference from device localStorage on initial mount', () => {
    localStorage.setItem('macro_theme', 'dark');

    render(
      <AppProvider>
        <Header />
      </AppProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByRole('button', { name: /Appearance theme: Dark/i })).toBeDefined();
  });
});
