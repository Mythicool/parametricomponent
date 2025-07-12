/**
 * Demo Selector Component
 * Allows switching between different demo modes
 */

import React, { useState } from 'react';
import ParametricDemo from './ParametricDemo';
import { LiveParametricDemo } from '../components/demo/LiveParametricDemo';

type DemoMode = 'original' | 'simplified';

const DemoSelector: React.FC = () => {
  const [demoMode, setDemoMode] = useState<DemoMode>('simplified');

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b'
  };

  const subtitleStyle: React.CSSProperties = {
    margin: '0.5rem 0 0 0',
    color: '#64748b',
    fontSize: '0.875rem'
  };

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    margin: '0 0.25rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: isActive ? '#3b82f6' : '#ffffff',
    color: isActive ? '#ffffff' : '#374151',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header with demo selector */}
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            Parametric Design System Demo
          </h1>
          <p style={subtitleStyle}>
            {demoMode === 'simplified' 
              ? 'React-bits inspired simplified components with live controls'
              : 'Original parametric system with all 57 components'
            }
          </p>
        </div>
        
        <div>
          <button
            onClick={() => setDemoMode('simplified')}
            style={buttonStyle(demoMode === 'simplified')}
          >
            🚀 Simplified Demo
          </button>
          <button
            onClick={() => setDemoMode('original')}
            style={buttonStyle(demoMode === 'original')}
          >
            📚 Original Demo
          </button>
        </div>
      </header>

      {/* Render selected demo */}
      {demoMode === 'simplified' ? (
        <LiveParametricDemo />
      ) : (
        <ParametricDemo />
      )}
    </div>
  );
};

export default DemoSelector;
