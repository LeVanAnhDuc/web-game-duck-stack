import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the same build works at a domain root and under a
  // GitHub Pages project path (ADR-0001). Not an env var -- see .env.example.
  base: './',
  // Alias @/ -> src/ (R-13). Phai khai o CA HAI cho: tsconfig cho tsc, cho nay cho
  // Vite va Vitest — thieu mot ben thi mot trong hai im lang khong hieu duong dan.
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [react()],
  test: {
    // Engine tests run in node: engine/ never touches the DOM (ADR-0002), and a
    // jsdom default would hide an accidental DOM reference instead of failing.
    // Files that do need a DOM opt in with a `@vitest-environment jsdom` docblock.
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
