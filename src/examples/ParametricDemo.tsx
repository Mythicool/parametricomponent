/**
 * Comprehensive Parametric System Demo
 * Demonstrates the production-ready TypeScript implementation
 */

import React, { useState, useEffect } from 'react';
import {
  ParametricComponent,
  ParametricSystemProvider,
  createParametricSystem,
  getAvailableComponentTypes,
  saveComponentPreset,
  loadComponentPreset,
  exportSystemConfiguration,
  importSystemConfiguration
} from '../index';
import { ParametricControlPanel } from '../components/ParametricControlPanel';

const ParametricDemo: React.FC = () => {
  const [system] = useState(() => createParametricSystem());
  const [selectedComponent, setSelectedComponent] = useState('split-text');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [presetName, setPresetName] = useState('');
  const [exportedConfig, setExportedConfig] = useState('');
  const [componentParameters, setComponentParameters] = useState<Record<string, any>>({});

  useEffect(() => {
    setAvailableTypes(getAvailableComponentTypes());
  }, []);

  const handleSavePreset = async () => {
    if (!presetName) return;
    
    try {
      const preset = {
        id: `custom_${Date.now()}`,
        name: presetName,
        description: `Custom preset for ${selectedComponent}`,
        category: 'components' as const,
        componentType: selectedComponent,
        parameters: {
          // This would typically come from the current component state
          backgroundColor: '#ff6b6b',
          textColor: '#ffffff'
        },
        metadata: {
          author: 'Demo User',
          version: '1.0.0',
          tags: ['custom', 'demo'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };
      
      await saveComponentPreset(preset);
      alert(`Preset "${presetName}" saved successfully!`);
      setPresetName('');
    } catch (error) {
      alert(`Failed to save preset: ${error.message}`);
    }
  };

  const handleExportConfig = () => {
    try {
      const config = exportSystemConfiguration();
      setExportedConfig(config);
    } catch (error) {
      alert(`Failed to export configuration: ${error.message}`);
    }
  };

  const handleImportConfig = async () => {
    if (!exportedConfig) return;

    try {
      await importSystemConfiguration(exportedConfig);
      alert('Configuration imported successfully!');
    } catch (error) {
      alert(`Failed to import configuration: ${error.message}`);
    }
  };

  const handleParameterChange = (parameter: string, value: any) => {
    setComponentParameters(prev => ({
      ...prev,
      [parameter]: value
    }));
  };

  return (
    <ParametricSystemProvider system={system}>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 2rem'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Parametric Design System Demo
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            Production-ready TypeScript implementation with comprehensive type safety
          </p>
        </header>

        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
          {/* Sidebar */}
          <aside style={{
            width: '300px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            padding: '1.5rem',
            overflowY: 'auto'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Component Types
            </h3>

            <div style={{ marginBottom: '2rem' }}>
              {availableTypes.map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedComponent(type);
                    setComponentParameters({});
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: selectedComponent === type ? '#3b82f6' : '#ffffff',
                    color: selectedComponent === type ? '#ffffff' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            <h3 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '1rem', 
              fontWeight: '600',
              color: '#374151'
            }}>
              Preset Management
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={handleSavePreset}
                disabled={!presetName}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.5rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  backgroundColor: presetName ? '#10b981' : '#d1d5db',
                  color: '#ffffff',
                  cursor: presetName ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem'
                }}
              >
                Save Preset
              </button>
            </div>

            <h3 style={{ 
              margin: '2rem 0 1rem 0', 
              fontSize: '1rem', 
              fontWeight: '600',
              color: '#374151'
            }}>
              Configuration
            </h3>
            
            <button
              onClick={handleExportConfig}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid #3b82f6',
                borderRadius: '0.375rem',
                backgroundColor: '#ffffff',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Export Config
            </button>
            
            <button
              onClick={handleImportConfig}
              disabled={!exportedConfig}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                backgroundColor: exportedConfig ? '#8b5cf6' : '#d1d5db',
                color: '#ffffff',
                cursor: exportedConfig ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem'
              }}
            >
              Import Config
            </button>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1, padding: '2rem' }}>
            {/* Component Preview */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Component Preview: {selectedComponent}
              </h2>

              <div style={{
                padding: '2rem',
                backgroundColor: '#1a1a2e',
                borderRadius: '0.375rem',
                border: '1px solid #e2e8f0',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ParametricComponent
                  type={selectedComponent}
                  parameters={componentParameters}
                  onError={(error) => console.error('Component error:', error)}
                />
              </div>
            </div>

            {/* Parametric Control Panel - Now beneath preview */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Parametric Controls
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                <ParametricControlPanel
                  componentType={selectedComponent}
                  onParameterChange={handleParameterChange}
                  layout="horizontal"
                  style={{
                    border: 'none',
                    padding: 0,
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
            </div>

            {/* API Examples */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              padding: '2rem'
            }}>
              <h2 style={{ 
                margin: '0 0 1rem 0', 
                fontSize: '1.25rem', 
                fontWeight: '600',
                color: '#1e293b'
              }}>
                API Usage Examples
              </h2>
              
              <div style={{ 
                backgroundColor: '#1e293b', 
                color: '#e2e8f0',
                padding: '1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontFamily: 'Monaco, Consolas, monospace',
                overflow: 'auto'
              }}>
                <pre>{`// Declarative usage
<ParametricComponent type="hero" preset="modernDark" />

// Programmatic usage
const component = createParametricComponent('blur-text', 'fadeIn');

// Parameter validation
const validation = validateComponentParameters('button', {
  backgroundColor: '#ff0000',
  fontSize: 16
});

// Preset management
await saveComponentPreset({
  id: 'my-preset',
  name: 'Custom Style',
  componentType: 'hero',
  parameters: { backgroundColor: '#ff6b6b' }
});

// Configuration export/import
const config = exportSystemConfiguration();
await importSystemConfiguration(config);`}</pre>
              </div>
            </div>

            {/* Exported Configuration Display */}
            {exportedConfig && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                padding: '2rem',
                marginTop: '2rem'
              }}>
                <h3 style={{ 
                  margin: '0 0 1rem 0', 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Exported Configuration
                </h3>
                <textarea
                  value={exportedConfig}
                  onChange={(e) => setExportedConfig(e.target.value)}
                  style={{
                    width: '100%',
                    height: '200px',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontFamily: 'Monaco, Consolas, monospace',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </ParametricSystemProvider>
  );
};

export default ParametricDemo;
