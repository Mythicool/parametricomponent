/**
 * Complete Live Parametric Demo Component
 * Self-contained component demonstrating all available parametric components
 * with real-time parametric controls
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ComponentRenderer } from '../ComponentRenderer';
import { componentSchemas } from '../../schemas/componentSchemas';
import { ComponentRenderProps, ParameterValue, ComponentSchema } from '../../types/parametric';

// Control component for sliders, toggles, etc.
const ParameterControl: React.FC<{
  label: string;
  type: 'slider' | 'toggle' | 'color' | 'select';
  value: ParameterValue;
  onChange: (value: ParameterValue) => void;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  unit?: string;
}> = ({ label, type, value, onChange, min = 0, max = 100, step = 1, options = [], unit = '' }) => {
  const controlStyle: React.CSSProperties = {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#374151'
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    fontFamily: 'monospace',
    float: 'right'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '4px',
    borderRadius: '4px',
    border: '1px solid #d1d5db'
  };

  return (
    <div style={controlStyle}>
      <label style={labelStyle}>
        {label}
        <span style={valueStyle}>{value}{unit}</span>
      </label>
      
      {type === 'slider' && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            ...inputStyle,
            height: '6px',
            background: '#e5e7eb',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
      )}
      
      {type === 'toggle' && (
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          {value ? 'Enabled' : 'Disabled'}
        </label>
      )}
      
      {type === 'color' && (
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, height: '40px', cursor: 'pointer' }}
        />
      )}
      
      {type === 'select' && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, height: '36px', cursor: 'pointer' }}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )}
    </div>
  );
};

// Main demo component
export const LiveParametricDemo: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('button');
  const [showExport, setShowExport] = useState(false);
  const [availableComponents, setAvailableComponents] = useState<string[]>([]);
  const [componentParameters, setComponentParameters] = useState<Record<string, ParameterValue>>({});
  const [currentSchema, setCurrentSchema] = useState<ComponentSchema | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Initialize available components and set default parameters
  useEffect(() => {
    const components = Object.keys(componentSchemas);
    setAvailableComponents(components);

    // Set initial component and parameters
    if (components.length > 0) {
      const initialComponent = components.includes('button') ? 'button' : components[0];
      setSelectedComponent(initialComponent);
      const schema = componentSchemas[initialComponent as keyof typeof componentSchemas];
      setCurrentSchema(schema);

      // Set default parameters from schema
      const defaultParams: Record<string, ParameterValue> = {};
      Object.entries(schema.parameters).forEach(([key, param]) => {
        defaultParams[key] = param.default;
      });
      setComponentParameters(defaultParams);
    }
  }, []);

  // Get unique categories
  const getCategories = () => {
    const categories = new Set<string>();
    Object.values(componentSchemas).forEach(schema => {
      categories.add(schema.category);
    });
    return Array.from(categories).sort();
  };

  // Filter components based on category and search term
  const getFilteredComponents = () => {
    let filtered = availableComponents;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(componentKey => {
        const schema = componentSchemas[componentKey as keyof typeof componentSchemas];
        return schema.category === selectedCategory;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(componentKey =>
        componentKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        componentSchemas[componentKey as keyof typeof componentSchemas]?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Update parameters when component changes
  useEffect(() => {
    if (selectedComponent && componentSchemas[selectedComponent as keyof typeof componentSchemas]) {
      const schema = componentSchemas[selectedComponent as keyof typeof componentSchemas];
      setCurrentSchema(schema);

      // Set default parameters from schema
      const defaultParams: Record<string, ParameterValue> = {};
      Object.entries(schema.parameters).forEach(([key, param]) => {
        defaultParams[key] = param.default;
      });
      setComponentParameters(defaultParams);
    }
  }, [selectedComponent]);

  // Update parameter function
  const updateParameter = useCallback((key: string, value: ParameterValue) => {
    setComponentParameters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Export functionality
  const generateCodeSnippet = () => {
    const paramsString = JSON.stringify(componentParameters, null, 2);
    return `<ParametricComponent
  type="${selectedComponent}"
  parameters={${paramsString}}
>
  ${selectedComponent === 'button' ? 'Click Me!' : ''}
</ParametricComponent>`;
  };

  const generatePresetObject = () => {
    return {
      id: `custom_${selectedComponent}_${Date.now()}`,
      name: `Custom ${selectedComponent.charAt(0).toUpperCase() + selectedComponent.slice(1)}`,
      description: `Custom ${selectedComponent} preset created in demo`,
      componentType: selectedComponent,
      parameters: componentParameters,
      metadata: {
        createdAt: new Date().toISOString(),
        author: 'Demo User'
      }
    };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard!');
    }
  };

  // Debug function to verify real-time updates
  const handleParameterUpdate = (key: string, value: ParameterValue) => {
    console.log(`🔄 Parameter Update: ${key} = ${value} (Component: ${selectedComponent})`);
    updateParameter(key, value);
  };

  // Render current component
  const renderComponent = () => {
    const renderProps: ComponentRenderProps = {
      parameters: componentParameters,
      style: {},
      className: 'demo-component'
    };

    return (
      <ComponentRenderer
        componentType={selectedComponent}
        renderProps={renderProps}
      >
        {selectedComponent === 'button' ? 'Click Me!' : undefined}
      </ComponentRenderer>
    );
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f1f5f9'
    }}>
      {/* Main content area */}
      <div style={{ 
        flex: 1, 
        padding: '32px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#1e293b'
          }}>
            Live Parametric Demo
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#64748b', 
            marginBottom: '24px'
          }}>
            Real-time component customization with parametric controls
          </p>

          {/* Component selector with filtering */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Select Component ({getFilteredComponents().length} of {availableComponents.length} available)
            </label>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="all">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Search input */}
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>

            {/* Component selector */}
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {getFilteredComponents().map(type => {
                const schema = componentSchemas[type as keyof typeof componentSchemas];
                return (
                  <option key={type} value={type}>
                    {schema?.name || type} ({schema?.category || 'unknown'})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Export controls */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => copyToClipboard(generateCodeSnippet())}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #10b981',
                backgroundColor: '#ffffff',
                color: '#10b981',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              📋 Copy Code
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify(componentParameters, null, 2))}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #3b82f6',
                backgroundColor: '#ffffff',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              📦 Copy Parameters
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify(generatePresetObject(), null, 2))}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #8b5cf6',
                backgroundColor: '#ffffff',
                color: '#8b5cf6',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              🎨 Copy Preset
            </button>
            <button
              onClick={() => setShowExport(!showExport)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #f59e0b',
                backgroundColor: showExport ? '#f59e0b' : '#ffffff',
                color: showExport ? '#ffffff' : '#f59e0b',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {showExport ? '🙈 Hide' : '👁️ Show'} Export
            </button>
          </div>
        </div>

        {/* Component preview */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '48px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          {renderComponent()}
        </div>

        {/* Export panel */}
        {showExport && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginTop: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#1e293b'
            }}>
              Export Current Configuration
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {/* React Component Code */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  React Component Code:
                </h4>
                <pre style={{
                  backgroundColor: '#1e293b',
                  color: '#e2e8f0',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  overflow: 'auto',
                  margin: 0
                }}>
                  {generateCodeSnippet()}
                </pre>
              </div>

              {/* Parameters Object */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  Parameters Object:
                </h4>
                <pre style={{
                  backgroundColor: '#f8fafc',
                  color: '#1e293b',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  overflow: 'auto',
                  margin: 0,
                  border: '1px solid #e2e8f0'
                }}>
                  {JSON.stringify(params, null, 2)}
                </pre>
              </div>

              {/* Preset Object */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  Preset Configuration:
                </h4>
                <pre style={{
                  backgroundColor: '#f0f9ff',
                  color: '#1e293b',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  overflow: 'auto',
                  margin: 0,
                  border: '1px solid #bae6fd'
                }}>
                  {JSON.stringify(generatePresetObject(), null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control panel sidebar */}
      <div style={{ 
        width: '350px', 
        backgroundColor: 'white',
        borderLeft: '1px solid #e2e8f0',
        padding: '24px',
        overflowY: 'auto',
        maxHeight: '100vh'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '24px',
          color: '#1e293b'
        }}>
          Controls
        </h2>

        {/* Dynamic controls based on selected component */}
        {currentSchema && Object.entries(currentSchema.parameters).map(([paramKey, paramConfig]) => {
          const value = componentParameters[paramKey];

          // Determine control type based on parameter configuration
          let controlType: 'slider' | 'toggle' | 'color' | 'select' = 'slider';
          let controlProps: any = {};

          if (paramConfig.type === 'boolean') {
            controlType = 'toggle';
          } else if (paramConfig.type === 'color' || paramKey.toLowerCase().includes('color')) {
            controlType = 'color';
          } else if (paramConfig.options && paramConfig.options.length > 0) {
            controlType = 'select';
            controlProps.options = paramConfig.options;
          } else if (paramConfig.type === 'number') {
            controlType = 'slider';
            controlProps.min = paramConfig.min || 0;
            controlProps.max = paramConfig.max || 100;
            controlProps.step = paramConfig.step || 1;
            controlProps.unit = paramConfig.unit || '';
          }

          return (
            <ParameterControl
              key={paramKey}
              label={paramConfig.description || paramKey}
              type={controlType}
              value={value}
              onChange={(newValue) => handleParameterUpdate(paramKey, newValue)}
              {...controlProps}
            />
          );
        })}



      </div>
    </div>
  );
};
