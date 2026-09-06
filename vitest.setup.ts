/*
 * Polyfills browser DOM APIs in jsdom environment required by Recharts ResponsiveContainer.
 * In JSDOM, elements default to 0x0 dimensions unless getBoundingClientRect is provided.
 */

if (typeof window !== 'undefined') {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = window.ResizeObserver || ResizeObserverMock;

  Element.prototype.getBoundingClientRect = () => ({
    width: 800,
    height: 400,
    top: 0,
    left: 0,
    bottom: 400,
    right: 800,
    x: 0,
    y: 0,
    toJSON: () => {},
  });
}
