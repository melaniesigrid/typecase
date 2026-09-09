import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://<user>.github.io/typecase/ so every asset URL is prefixed.
export default defineConfig({
  base: '/typecase/',
  plugins: [react()],
});
