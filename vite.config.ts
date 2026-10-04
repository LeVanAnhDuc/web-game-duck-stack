import { fileURLToPath } from 'node:url'

import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // VITE_BASE_PATH is "/" locally and "/<repo>/" in the deploy workflow; unset means
    // the Vite default, the site root. An absolute base replaces the relative './' of
    // ADR-0001 because the OAuth redirect_uri needs a known app root (ADR-0018).
    ...(env.VITE_BASE_PATH ? { base: env.VITE_BASE_PATH } : {}),
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
  }
})
