
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This maps the system environment variable to the client-side process.env
    // as required by the @google/genai SDK guidelines.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  }
});
