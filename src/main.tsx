import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/index.css'

// Redirect all relative /api requests to VITE_API_URL if configured.
// For production deployment, fall back to the hosted backend URL if VITE_API_URL is not set.
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  const envApiUrl = (import.meta.env.VITE_API_URL as string) || '';
  const defaultProdApiUrl = import.meta.env.PROD ? 'https://visiting-backend.onrender.com' : '';
  const baseUrl = envApiUrl || defaultProdApiUrl;

  if (baseUrl) {
    if (typeof input === 'string' && input.startsWith('/api')) {
      return originalFetch(`${baseUrl}${input}`, init);
    }
    if (input instanceof URL && input.pathname.startsWith('/api')) {
      return originalFetch(new URL(`${baseUrl}${input.pathname}${input.search}`), init);
    }
    if (input instanceof Request && new URL(input.url).pathname.startsWith('/api')) {
      const urlObj = new URL(input.url);
      const newUrl = `${baseUrl}${urlObj.pathname}${urlObj.search}`;
      return originalFetch(new Request(newUrl, input), init);
    }
  }
  return originalFetch(input, init);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
