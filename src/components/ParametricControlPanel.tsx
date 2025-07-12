/**
 * Parametric Control Panel
 * Provides real-time parameter controls for components
 */

import React, { useState, useEffect } from 'react';
import { ComponentSchema, ParameterConfig, ParameterValue } from '../types/parametric';
import { useParametricSystem } from '../hooks/useParametricSystem';

export interface ParametricControlPanelProps {
  componentType: string;
  onParameterChange?: (parameter: string, value: ParameterValue) => void;
  className?: string;
  style?: React.CSSProperties;
  layout?: 'sidebar' | 'horizontal';
}

export const ParametricControlPanel: React.FC<ParametricControlPanelProps> = ({
  componentType,
  onParameterChange,
  className,
  style,
  layout = 'sidebar'
}) => {
  const { system } = useParametricSystem();
  const [schema, setSchema] = useState<ComponentSchema | null>(null);
  const [parameters, setParameters] = useState<Record<string, ParameterValue>>({});

  useEffect(() => {
    if (system) {
      const componentSchema = system.getSchema(componentType);
      if (componentSchema) {
        setSchema(componentSchema);
        
        // Initialize parameters with defaults
        const defaultParams: Record<string, ParameterValue> = {};
        Object.entries(componentSchema.parameters).forEach(([key, config]) => {
          defaultParams[key] = config.default;
        });
        setParameters(defaultParams);
      }
    }
  }, [system, componentType]);

  const updateParameter = (paramKey: string, value: ParameterValue) => {
    setParameters(prev => ({
      ...prev,
      [paramKey]: value
    }));
    onParameterChange?.(paramKey, value);
  };

  const renderControl = (paramKey: string, paramConfig: ParameterConfig) => {
    const currentValue = parameters[paramKey];
    
    switch (paramConfig.type) {
      case 'slider':
        return (
          <div key={paramKey} style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                {paramConfig.description}
              </label>
              <span style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                fontFamily: 'monospace'
              }}>
                {currentValue}{paramConfig.unit || ''}
              </span>
            </div>
            <input
              type="range"
              min={paramConfig.min}
              max={paramConfig.max}
              step={paramConfig.step || 1}
              value={currentValue as number}
              onChange={(e) => updateParameter(paramKey, parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#e5e7eb',
                outline: 'none',
                appearance: 'none'
              }}
            />
          </div>
        );
      
      case 'color':
        return (
          <div key={paramKey} style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '14px', 
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              {paramConfig.description}
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={currentValue as string}
                onChange={(e) => updateParameter(paramKey, e.target.value)}
                style={{
                  width: '40px',
                  height: '32px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              />
              <input
                type="text"
                value={currentValue as string}
                onChange={(e) => updateParameter(paramKey, e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          </div>
        );
      
      case 'dropdown':
        return (
          <div key={paramKey} style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '14px', 
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              {paramConfig.description}
            </label>
            <select
              value={currentValue as string}
              onChange={(e) => updateParameter(paramKey, e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#ffffff'
              }}
            >
              {paramConfig.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'toggle':
        return (
          <div key={paramKey} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              {paramConfig.description}
            </label>
            <button
              onClick={() => updateParameter(paramKey, !currentValue)}
              style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                backgroundColor: currentValue ? '#3b82f6' : '#d1d5db',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: currentValue ? '22px' : '2px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              />
            </button>
          </div>
        );
      
      case 'text':
        return (
          <div key={paramKey} style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '14px', 
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              {paramConfig.description}
            </label>
            <input
              type="text"
              value={currentValue as string}
              onChange={(e) => updateParameter(paramKey, e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!schema) {
    return (
      <div style={{ padding: '16px', color: '#6b7280' }}>
        Loading controls for {componentType}...
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: layout === 'horizontal' ? 'transparent' : '#ffffff',
    border: layout === 'horizontal' ? 'none' : '1px solid #e5e7eb',
    borderRadius: layout === 'horizontal' ? '0' : '8px',
    padding: layout === 'horizontal' ? '0' : '16px',
    maxHeight: layout === 'horizontal' ? 'none' : '600px',
    overflowY: layout === 'horizontal' ? 'visible' : 'auto',
    ...style
  };

  const groupsContainerStyle: React.CSSProperties = {
    display: layout === 'horizontal' ? 'grid' : 'block',
    gridTemplateColumns: layout === 'horizontal' ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'none',
    gap: layout === 'horizontal' ? '2rem' : '0',
    width: '100%'
  };

  return (
    <div
      className={`parametric-control-panel ${className || ''}`}
      style={containerStyle}
    >
      {layout === 'sidebar' && (
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          Customize
        </h3>
      )}

      <div style={groupsContainerStyle}>
        {Object.entries(schema.groups).map(([groupName, paramKeys]) => (
          <div key={groupName} style={{
            marginBottom: layout === 'horizontal' ? '0' : '24px',
            padding: layout === 'horizontal' ? '1.5rem' : '0',
            backgroundColor: layout === 'horizontal' ? '#f8fafc' : 'transparent',
            borderRadius: layout === 'horizontal' ? '0.5rem' : '0',
            border: layout === 'horizontal' ? '1px solid #e2e8f0' : 'none'
          }}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: layout === 'horizontal' ? '14px' : '12px',
              fontWeight: '600',
              color: layout === 'horizontal' ? '#1f2937' : '#6b7280',
              textTransform: layout === 'horizontal' ? 'none' : 'uppercase',
              letterSpacing: layout === 'horizontal' ? '0' : '0.05em'
            }}>
              {groupName}
            </h4>
            {paramKeys.map(paramKey => {
              const paramConfig = schema.parameters[paramKey];
              return paramConfig ? renderControl(paramKey, paramConfig) : null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
