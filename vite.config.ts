import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Kiosk/signage app. Host 0.0.0.0 so the booth device can be reached on the LAN
// during setup; the app itself makes no network calls at runtime.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
