import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  // Project Pages serves this repository under /ORBITA-7/; keep Vite dev at /.
  base: mode === 'production' ? '/ORBITA-7/' : '/',
  plugins: [react()],
  server: { host: '127.0.0.1' },
}));

