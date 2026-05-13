import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

// Global error handling for debugging on device
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global Error:", message, "at", source, lineno, colno, error);
  // We don't want to alert in the app but we want it in logs
};

window.onunhandledrejection = (event) => {
  console.error("Unhandled Rejection:", event.reason);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Root element not found!");
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
