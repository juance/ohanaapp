
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Debug environment
console.log("Environment:", import.meta.env.MODE);
console.log("Base URL:", import.meta.env.BASE_URL);
console.log("Initializing application...");

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);

console.log("React application mounted");

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
