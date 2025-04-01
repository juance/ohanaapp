
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TooltipProvider } from './components/ui/tooltip';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

// Wrap the app with TooltipProvider at the root level
// to ensure tooltip hooks are available throughout the application
createRoot(rootElement).render(
  <React.StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </React.StrictMode>
);
