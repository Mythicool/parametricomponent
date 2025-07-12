/**
 * Demo file for simplified components
 * Shows how the simplified components work with the parametric system
 */

import React, { useState } from 'react';
import { ParametricComponent } from '../components/ParametricComponent';
import { ParametricControlPanel } from '../components/ParametricControlPanel';
import { ParametricSystemProvider } from '../hooks/useParametricSystem';
import { createParametricSystem } from '../core/ParametricSystem';
import { componentSchemas } from '../schemas/componentSchemas';

// Create system and register schemas
const system = createParametricSystem();
Object.values(componentSchemas).forEach(schema => {
  system.registerComponent(schema);
});

export const SimplifiedComponentsDemo: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('button');
  const [parameters, setParameters] = useState<Record<string, any>>({});

  const handleParameterChange = (parameter: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [parameter]: value
    }));
  };

  const componentTypes = ['button', 'hero', 'card'];

  return (
    <ParametricSystemProvider system={system}>
      <div style={{ 
        display: 'flex', 
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Main content area */}
        <div style={{ 
          flex: 1, 
          padding: '40px',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#1f2937'
            }}>
              Simplified Components Demo
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              marginBottom: '32px'
            }}>
              React-bits inspired components with parametric controls
            </p>

            {/* Component selector */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Select Component:
              </label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {componentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Component preview */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '32px',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ParametricComponent
                type={selectedComponent}
                parameters={parameters}
                onParameterChange={handleParameterChange}
              />
            </div>

            {/* Component info */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                Component Features
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#10b981', 
                    borderRadius: '50%' 
                  }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Simplified, cleaner code structure
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#10b981', 
                    borderRadius: '50%' 
                  }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Full parametric control compatibility
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#10b981', 
                    borderRadius: '50%' 
                  }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    React-bits inspired patterns
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#10b981', 
                    borderRadius: '50%' 
                  }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Real-time parameter updates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control panel sidebar */}
        <div style={{ 
          width: '320px', 
          backgroundColor: 'white',
          borderLeft: '1px solid #e5e7eb',
          padding: '24px',
          overflowY: 'auto'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#1f2937'
          }}>
            Parameters
          </h2>
          <ParametricControlPanel
            componentType={selectedComponent}
            onParameterChange={handleParameterChange}
          />
        </div>
      </div>
    </ParametricSystemProvider>
  );
};
