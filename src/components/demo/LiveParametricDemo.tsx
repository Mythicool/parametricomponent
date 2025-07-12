/**
 * Complete Live Parametric Demo Component
 * Self-contained component demonstrating simplified Button, Hero, and Card components
 * with real-time parametric controls
 */

import React, { useState, useCallback } from 'react';
import { SimplifiedButtonRenderer } from '../renderers/simplified/SimplifiedButtonRenderer';
import { SimplifiedHeroRenderer } from '../renderers/simplified/SimplifiedHeroRenderer';
import { SimplifiedCardRenderer } from '../renderers/simplified/SimplifiedCardRenderer';
import { ComponentRenderProps, ParameterValue } from '../../types/parametric';

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
  const [selectedComponent, setSelectedComponent] = useState<'button' | 'hero' | 'card'>('button');
  const [showExport, setShowExport] = useState(false);
  
  // Button parameters
  const [buttonParams, setButtonParams] = useState<Record<string, ParameterValue>>({
    backgroundColor: '#4f46e5',
    textColor: '#ffffff',
    fontSize: 16,
    padding: 16,
    borderRadius: 8,
    hoverScale: 1.05,
    animationDuration: 200,
    width: 180,
    shadow: true,
    variant: 'filled',
    disabled: false,
    ripple: true
  });

  // Hero parameters
  const [heroParams, setHeroParams] = useState<Record<string, ParameterValue>>({
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    fontSize: 48,
    padding: 60,
    borderRadius: 12,
    animationDuration: 800,
    opacity: 1,
    spacing: 24,
    layout: 'center',
    gradient: true,
    gradientDirection: '135deg',
    shadowIntensity: 0.3,
    minHeight: 400,
    overlay: true,
    overlayOpacity: 0.4
  });

  // Card parameters
  const [cardParams, setCardParams] = useState<Record<string, ParameterValue>>({
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    shadowIntensity: 0.1,
    hoverLift: 4,
    spacing: 16,
    layout: 'vertical',
    interactive: true,
    animationDuration: 200,
    gradient: false,
    gradientDirection: '135deg',
    hoverShadowIntensity: 0.2
  });

  // Update parameter functions
  const updateButtonParam = useCallback((key: string, value: ParameterValue) => {
    setButtonParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateHeroParam = useCallback((key: string, value: ParameterValue) => {
    setHeroParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateCardParam = useCallback((key: string, value: ParameterValue) => {
    setCardParams(prev => ({ ...prev, [key]: value }));
  }, []);

  // Get current parameters and update function
  const getCurrentParams = () => {
    switch (selectedComponent) {
      case 'button': return { params: buttonParams, update: updateButtonParam };
      case 'hero': return { params: heroParams, update: updateHeroParam };
      case 'card': return { params: cardParams, update: updateCardParam };
    }
  };

  const { params, update } = getCurrentParams();

  // Export functionality
  const generateCodeSnippet = () => {
    const paramsString = JSON.stringify(params, null, 2);
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
      parameters: params,
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
    update(key, value);
  };

  // Render current component
  const renderComponent = () => {
    const renderProps: ComponentRenderProps = {
      parameters: params,
      style: {},
      className: 'demo-component'
    };

    switch (selectedComponent) {
      case 'button':
        return <SimplifiedButtonRenderer {...renderProps}>Click Me!</SimplifiedButtonRenderer>;
      case 'hero':
        return <SimplifiedHeroRenderer {...renderProps} />;
      case 'card':
        return <SimplifiedCardRenderer {...renderProps} />;
    }
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

          {/* Component selector */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {(['button', 'hero', 'card'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedComponent(type)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: selectedComponent === type ? '#4f46e5' : '#e2e8f0',
                  color: selectedComponent === type ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                {type}
              </button>
            ))}
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
              onClick={() => copyToClipboard(JSON.stringify(params, null, 2))}
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
        {selectedComponent === 'button' && (
          <>
            <ParameterControl
              label="Background Color"
              type="color"
              value={buttonParams.backgroundColor}
              onChange={(value) => handleParameterUpdate('backgroundColor', value)}
            />
            <ParameterControl
              label="Text Color"
              type="color"
              value={buttonParams.textColor}
              onChange={(value) => handleParameterUpdate('textColor', value)}
            />
            <ParameterControl
              label="Font Size"
              type="slider"
              value={buttonParams.fontSize}
              onChange={(value) => handleParameterUpdate('fontSize', value)}
              min={12}
              max={32}
              unit="px"
            />
            <ParameterControl
              label="Padding"
              type="slider"
              value={buttonParams.padding}
              onChange={(value) => handleParameterUpdate('padding', value)}
              min={8}
              max={32}
              unit="px"
            />
            <ParameterControl
              label="Border Radius"
              type="slider"
              value={buttonParams.borderRadius}
              onChange={(value) => handleParameterUpdate('borderRadius', value)}
              min={0}
              max={24}
              unit="px"
            />
            <ParameterControl
              label="Hover Scale"
              type="slider"
              value={buttonParams.hoverScale}
              onChange={(value) => handleParameterUpdate('hoverScale', value)}
              min={1}
              max={1.2}
              step={0.01}
            />
            <ParameterControl
              label="Variant"
              type="select"
              value={buttonParams.variant}
              onChange={(value) => handleParameterUpdate('variant', value)}
              options={['filled', 'outlined', 'ghost']}
            />
            <ParameterControl
              label="Shadow"
              type="toggle"
              value={buttonParams.shadow}
              onChange={(value) => handleParameterUpdate('shadow', value)}
            />
            <ParameterControl
              label="Ripple Effect"
              type="toggle"
              value={buttonParams.ripple}
              onChange={(value) => handleParameterUpdate('ripple', value)}
            />
            <ParameterControl
              label="Disabled"
              type="toggle"
              value={buttonParams.disabled}
              onChange={(value) => handleParameterUpdate('disabled', value)}
            />
          </>
        )}

        {selectedComponent === 'hero' && (
          <>
            <ParameterControl
              label="Background Color"
              type="color"
              value={heroParams.backgroundColor}
              onChange={(value) => handleParameterUpdate('backgroundColor', value)}
            />
            <ParameterControl
              label="Text Color"
              type="color"
              value={heroParams.textColor}
              onChange={(value) => handleParameterUpdate('textColor', value)}
            />
            <ParameterControl
              label="Font Size"
              type="slider"
              value={heroParams.fontSize}
              onChange={(value) => handleParameterUpdate('fontSize', value)}
              min={24}
              max={72}
              unit="px"
            />
            <ParameterControl
              label="Padding"
              type="slider"
              value={heroParams.padding}
              onChange={(value) => handleParameterUpdate('padding', value)}
              min={20}
              max={100}
              unit="px"
            />
            <ParameterControl
              label="Border Radius"
              type="slider"
              value={heroParams.borderRadius}
              onChange={(value) => handleParameterUpdate('borderRadius', value)}
              min={0}
              max={32}
              unit="px"
            />
            <ParameterControl
              label="Opacity"
              type="slider"
              value={heroParams.opacity}
              onChange={(value) => handleParameterUpdate('opacity', value)}
              min={0}
              max={1}
              step={0.1}
            />
            <ParameterControl
              label="Shadow Intensity"
              type="slider"
              value={heroParams.shadowIntensity}
              onChange={(value) => handleParameterUpdate('shadowIntensity', value)}
              min={0}
              max={1}
              step={0.1}
            />
            <ParameterControl
              label="Layout"
              type="select"
              value={heroParams.layout}
              onChange={(value) => handleParameterUpdate('layout', value)}
              options={['left', 'center', 'right']}
            />
            <ParameterControl
              label="Gradient"
              type="toggle"
              value={heroParams.gradient}
              onChange={(value) => handleParameterUpdate('gradient', value)}
            />
          </>
        )}

        {selectedComponent === 'card' && (
          <>
            <ParameterControl
              label="Background Color"
              type="color"
              value={cardParams.backgroundColor}
              onChange={(value) => handleParameterUpdate('backgroundColor', value)}
            />
            <ParameterControl
              label="Border Color"
              type="color"
              value={cardParams.borderColor}
              onChange={(value) => handleParameterUpdate('borderColor', value)}
            />
            <ParameterControl
              label="Border Width"
              type="slider"
              value={cardParams.borderWidth}
              onChange={(value) => handleParameterUpdate('borderWidth', value)}
              min={0}
              max={4}
              unit="px"
            />
            <ParameterControl
              label="Border Radius"
              type="slider"
              value={cardParams.borderRadius}
              onChange={(value) => handleParameterUpdate('borderRadius', value)}
              min={0}
              max={24}
              unit="px"
            />
            <ParameterControl
              label="Padding"
              type="slider"
              value={cardParams.padding}
              onChange={(value) => handleParameterUpdate('padding', value)}
              min={12}
              max={48}
              unit="px"
            />
            <ParameterControl
              label="Shadow Intensity"
              type="slider"
              value={cardParams.shadowIntensity}
              onChange={(value) => handleParameterUpdate('shadowIntensity', value)}
              min={0}
              max={0.5}
              step={0.05}
            />
            <ParameterControl
              label="Hover Lift"
              type="slider"
              value={cardParams.hoverLift}
              onChange={(value) => handleParameterUpdate('hoverLift', value)}
              min={0}
              max={12}
              unit="px"
            />
            <ParameterControl
              label="Layout"
              type="select"
              value={cardParams.layout}
              onChange={(value) => handleParameterUpdate('layout', value)}
              options={['vertical', 'horizontal']}
            />
            <ParameterControl
              label="Interactive"
              type="toggle"
              value={cardParams.interactive}
              onChange={(value) => handleParameterUpdate('interactive', value)}
            />
            <ParameterControl
              label="Gradient"
              type="toggle"
              value={cardParams.gradient}
              onChange={(value) => handleParameterUpdate('gradient', value)}
            />
          </>
        )}
      </div>
    </div>
  );
};
