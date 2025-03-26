
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Debug environment
console.log("Environment:", import.meta.env.MODE);
console.log("Base URL:", import.meta.env.BASE_URL);
console.log("Initializing application...");

// Find the root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Fatal: Root element not found in the DOM");
  throw new Error('Root element not found');
}

console.log("Root element found, mounting React application");

// Create and render the root
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

console.log("React application mounted");
