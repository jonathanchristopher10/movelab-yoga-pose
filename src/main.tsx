import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted fonts (offline-capable for booths). Anton = display, Inter = body.
import '@fontsource/anton/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import './index.css';
import App from './App';
import { initKiosk } from './lib/kiosk';

initKiosk();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
