
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TooltipProvider } from './components/ui/tooltip';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

// Create the root outside of the render call
const root = createRoot(rootElement);

// Then render to it
root.render(
  <React.StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </React.StrictMode>
);
