/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    environment: 'happy-dom',
    include: ['**/*.test.ts'],
    setupFiles: [path.resolve(__dirname, 'vitest.setup.ts')]
  },
})