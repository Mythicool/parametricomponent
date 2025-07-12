/**
 * Demo Application Entry Point
 * Showcases the parametric design system in action
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import DemoSelector from './examples/DemoSelector';

// Global styles for the demo
const globalStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8fafc;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  .parametric-error {
    font-family: system-ui, -apple-system, sans-serif;
  }

  .parametric-loading {
    font-family: system-ui, -apple-system, sans-serif;
  }

  .parametric-unknown-component {
    font-family: system-ui, -apple-system, sans-serif;
  }

  .parametric-render-error {
    font-family: system-ui, -apple-system, sans-serif;
  }

  /* Custom slider styles */
  .slider {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }

  .slider::-webkit-slider-track {
    background: #e2e8f0;
    height: 8px;
    border-radius: 4px;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: #3b82f6;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .slider::-moz-range-track {
    background: #e2e8f0;
    height: 8px;
    border-radius: 4px;
    border: none;
  }

  .slider::-moz-range-thumb {
    background: #3b82f6;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  /* Animation keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Utility classes */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  .animate-slide-in {
    animation: slideIn 0.5s ease-out;
  }

  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }
`;

// Inject global styles
const styleElement = document.createElement('style');
styleElement.textContent = globalStyles;
document.head.appendChild(styleElement);

// Render the demo application
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <DemoSelector />
  </React.StrictMode>
);
