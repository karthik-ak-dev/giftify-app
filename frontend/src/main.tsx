import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// PWA Service Worker Registration
import { register as registerSW } from './utils/serviceWorker'

// Register service worker for PWA functionality
registerSW({
  onSuccess: () => {
    console.log('Giftify is ready for offline use');
  },
  onUpdate: () => {
    console.log('New version available! Please refresh to update.');
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
