import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// architecture/cross-cutting/security.md, rule 5. The Content-Security-Policy is set by the host that serves the
// production build (hosting TBC); the dev server cannot use it because hot reload injects inline scripts.
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
};

// Same origin in every environment: /api is forwarded to the Task Service (SAD §4.3).
const apiProxy = { '/api': 'http://localhost:8080' };

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: apiProxy,
    headers: securityHeaders,
  },
  preview: {
    port: 4173,
    strictPort: true,
    proxy: apiProxy,
    headers: securityHeaders,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    restoreMocks: true,
  },
});
