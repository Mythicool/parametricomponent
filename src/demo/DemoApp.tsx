/**
 * Demo App Entry Point
 * Simple wrapper to test the LiveParametricDemo component
 */

import React from 'react';
import { LiveParametricDemo } from './LiveParametricDemo';

// Simple demo app that you can render directly
export const DemoApp: React.FC = () => {
  return (
    <div style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
      <LiveParametricDemo />
    </div>
  );
};

// Default export for easy importing
export default DemoApp;
