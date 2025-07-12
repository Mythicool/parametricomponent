/**
 * Main Parametric Component
 * Provides the declarative API for component instantiation
 */

import React, { useEffect, useState, useMemo } from 'react';
import { ComponentInstance, ParameterValue } from '../types/parametric';
import { useParametricSystem } from '../hooks/useParametricSystem';
import { ComponentRenderer } from './ComponentRenderer';

export interface ParametricComponentProps {
  type: string;
  preset?: string;
  parameters?: Record<string, ParameterValue>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onParameterChange?: (parameter: string, value: ParameterValue) => void;
  onError?: (error: Error) => void;
}

/**
 * Main component for declarative parametric component usage
 * Usage: <ParametricComponent type="blur-text" preset="fadeIn" />
 */
export const ParametricComponent: React.FC<ParametricComponentProps> = ({
  type,
  preset,
  parameters = {},
  className,
  style,
  children,
  onParameterChange,
  onError
}) => {
  const { system } = useParametricSystem();
  const [component, setComponent] = useState<ComponentInstance | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Create component instance
  useEffect(() => {
    if (!system) return;

    try {
      const instance = system.createComponent(type, preset);
      
      // Apply custom parameters
      Object.entries(parameters).forEach(([param, value]) => {
        system.updateParameter(instance.id, param, value);
      });

      setComponent(instance);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    }
  }, [system, type, preset]);

  // Update parameters when props change
  useEffect(() => {
    if (!system || !component) return;

    try {
      Object.entries(parameters).forEach(([param, value]) => {
        if (component.parameters[param] !== value) {
          system.updateParameter(component.id, param, value);
        }
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    }
  }, [system, component, parameters]);

  // Listen for parameter updates
  useEffect(() => {
    if (!system || !component) return;

    const handleParameterUpdate = (event: any) => {
      if (event.componentId === component.id) {
        onParameterChange?.(event.parameter, event.newValue);
        
        // Update local component state
        setComponent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            parameters: {
              ...prev.parameters,
              [event.parameter]: event.newValue
            },
            metadata: {
              ...prev.metadata,
              updatedAt: event.timestamp
            }
          };
        });
      }
    };

    system.on('parameterUpdated', handleParameterUpdate);
    
    return () => {
      system.off('parameterUpdated', handleParameterUpdate);
    };
  }, [system, component, onParameterChange]);

  // Memoized render props
  const renderProps = useMemo(() => {
    if (!component) return null;

    return {
      parameters: component.parameters,
      style: style || {},
      className,
      children,
      onParameterChange: (param: string, value: ParameterValue) => {
        if (system && component) {
          system.updateParameter(component.id, param, value);
        }
      }
    };
  }, [component, style, className, children, system]);

  // Error state
  if (error) {
    return (
      <div className="parametric-error" style={{ 
        padding: '16px', 
        border: '1px solid #ef4444', 
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
        color: '#dc2626'
      }}>
        <h4>Parametric Component Error</h4>
        <p>{error.message}</p>
        <details>
          <summary>Error Details</summary>
          <pre>{error.stack}</pre>
        </details>
      </div>
    );
  }

  // Loading state
  if (!component || !renderProps) {
    return (
      <div className="parametric-loading" style={{
        padding: '16px',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        Loading component...
      </div>
    );
  }

  return (
    <ComponentRenderer
      componentType={type}
      renderProps={renderProps}
    />
  );
};

/**
 * Factory function for programmatic component creation
 * Usage: const component = createComponent('hero', 'modernDark')
 */
export function createComponent(type: string, preset?: string): Promise<ComponentInstance> {
  return new Promise((resolve, reject) => {
    // This would typically use a global system instance
    // For now, we'll throw an error to indicate this needs to be implemented
    // with proper context or dependency injection
    reject(new Error('createComponent requires ParametricSystem context. Use ParametricComponent instead.'));
  });
}

/**
 * Hook for imperative component management
 */
export function useParametricComponent(type: string, preset?: string) {
  const { system } = useParametricSystem();
  const [component, setComponent] = useState<ComponentInstance | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!system) return;

    try {
      const instance = system.createComponent(type, preset);
      setComponent(instance);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setComponent(null);
    }
  }, [system, type, preset]);

  const updateParameter = (parameter: string, value: ParameterValue) => {
    if (system && component) {
      try {
        system.updateParameter(component.id, parameter, value);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
      }
    }
  };

  const resetToDefaults = () => {
    if (system && component) {
      try {
        const schema = system.getSchema(component.type);
        if (schema) {
          Object.entries(schema.parameters).forEach(([param, config]) => {
            system.updateParameter(component.id, param, config.default);
          });
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
      }
    }
  };

  return {
    component,
    error,
    updateParameter,
    resetToDefaults,
    isLoading: !component && !error
  };
}
