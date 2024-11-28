import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import stdLibBrowser from 'vite-plugin-node-stdlib-browser';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), stdLibBrowser()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
});
