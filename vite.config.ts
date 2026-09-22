import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  base: '/DPMBoss/',
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
