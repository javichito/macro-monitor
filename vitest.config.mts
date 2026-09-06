import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/*
 * Standard Vitest configuration prescribed in official Next.js testing documentation:
 * https://nextjs.org/docs/app/guides/testing/vitest
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
