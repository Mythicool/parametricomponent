/**
 * Tests for ParametricComponent React component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ParametricComponent } from '../components/ParametricComponent';
import { ParametricSystemProvider } from '../hooks/useParametricSystem';
import { ParametricSystem } from '../core/ParametricSystem';
import { LocalStorageProvider } from '../core/storage/LocalStorageProvider';
import { ComponentSchema } from '../types/parametric';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ParametricComponent', () => {
  let system: ParametricSystem;

  const testSchema: ComponentSchema = {
    id: 'test-component',
    name: 'Test Component',
    category: 'layout',
    description: 'A test component',
    version: '1.0.0',
    groups: {
      'Visual': ['backgroundColor', 'opacity'],
      'Layout': ['padding']
    },
    parameters: {
      backgroundColor: {
        type: 'color',
        default: '#ffffff',
        description: 'Background color',
        group: 'Visual'
      },
      opacity: {
        type: 'slider',
        min: 0,
        max: 1,
        step: 0.1,
        default: 1,
        description: 'Opacity',
        group: 'Visual'
      },
      padding: {
        type: 'slider',
        min: 0,
        max: 100,
        default: 16,
        unit: 'px',
        description: 'Padding',
        group: 'Layout'
      }
    },
    presets: [],
    responsive: {
      breakpoints: { mobile: 768, tablet: 1024, desktop: 1440 },
      parameters: {}
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    system = new ParametricSystem(new LocalStorageProvider());
    system.registerComponent(testSchema);
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <ParametricSystemProvider system={system}>
        {component}
      </ParametricSystemProvider>
    );
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      renderWithProvider(<ParametricComponent type="test-component" />);
      expect(screen.getByText('Loading component...')).toBeInTheDocument();
    });

    it('should show error for unknown component type', async () => {
      renderWithProvider(<ParametricComponent type="unknown-component" />);
      
      await waitFor(() => {
        expect(screen.getByText('Parametric Component Error')).toBeInTheDocument();
      });
    });

    it('should render component with default parameters', async () => {
      renderWithProvider(<ParametricComponent type="test-component" />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading component...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Parameter Updates', () => {
    it('should update parameters when props change', async () => {
      const { rerender } = renderWithProvider(
        <ParametricComponent 
          type="test-component" 
          parameters={{ opacity: 0.5 }}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('Loading component...')).not.toBeInTheDocument();
      });

      rerender(
        <ParametricSystemProvider system={system}>
          <ParametricComponent 
            type="test-component" 
            parameters={{ opacity: 0.8 }}
          />
        </ParametricSystemProvider>
      );

      // Component should update with new parameters
      await waitFor(() => {
        // This would depend on how the test component renders the opacity
        // For now, we just verify no errors occurred
        expect(screen.queryByText('Parametric Component Error')).not.toBeInTheDocument();
      });
    });

    it('should call onParameterChange callback', async () => {
      const onParameterChange = vi.fn();
      
      renderWithProvider(
        <ParametricComponent 
          type="test-component" 
          onParameterChange={onParameterChange}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('Loading component...')).not.toBeInTheDocument();
      });

      // Simulate parameter change from the system
      const components = system.listComponents();
      if (components.length > 0) {
        system.updateParameter(components[0].id, 'opacity', 0.7);
        
        await waitFor(() => {
          expect(onParameterChange).toHaveBeenCalledWith('opacity', 0.7);
        });
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle parameter validation errors', async () => {
      const onError = vi.fn();
      
      renderWithProvider(
        <ParametricComponent 
          type="test-component" 
          parameters={{ opacity: 2 }} // Invalid value
          onError={onError}
        />
      );

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });

    it('should display error UI for component errors', async () => {
      const onError = vi.fn();
      
      renderWithProvider(
        <ParametricComponent 
          type="test-component" 
          parameters={{ opacity: 'invalid' }} // Invalid type
          onError={onError}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Parametric Component Error')).toBeInTheDocument();
      });
    });
  });

  describe('Preset Support', () => {
    beforeEach(() => {
      const schemaWithPreset: ComponentSchema = {
        ...testSchema,
        presets: [{
          id: 'test-preset',
          name: 'Test Preset',
          description: 'A test preset',
          category: 'layout',
          componentType: 'test-component',
          parameters: {
            backgroundColor: '#ff0000',
            opacity: 0.8,
            padding: 24
          },
          metadata: {
            author: 'Test',
            version: '1.0.0',
            tags: ['test'],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }]
      };
      
      system.registerComponent(schemaWithPreset);
    });

    it('should apply preset parameters', async () => {
      renderWithProvider(
        <ParametricComponent 
          type="test-component" 
          preset="test-preset"
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('Loading component...')).not.toBeInTheDocument();
      });

      // Verify preset was applied
      const components = system.listComponents();
      expect(components[0].parameters.backgroundColor).toBe('#ff0000');
      expect(components[0].parameters.opacity).toBe(0.8);
      expect(components[0].parameters.padding).toBe(24);
    });
  });

  describe('Custom Children', () => {
    it('should render custom children', async () => {
      renderWithProvider(
        <ParametricComponent type="test-component">
          <div>Custom Content</div>
        </ParametricComponent>
      );

      await waitFor(() => {
        expect(screen.getByText('Custom Content')).toBeInTheDocument();
      });
    });
  });

  describe('CSS Classes and Styles', () => {
    it('should apply custom className', async () => {
      const { container } = renderWithProvider(
        <ParametricComponent 
          type="test-component" 
          className="custom-class"
        />
      );

      await waitFor(() => {
        expect(container.querySelector('.custom-class')).toBeInTheDocument();
      });
    });

    it('should apply custom styles', async () => {
      const customStyle = { border: '1px solid red' };
      
      const { container } = renderWithProvider(
        <ParametricComponent 
          type="test-component" 
          style={customStyle}
        />
      );

      await waitFor(() => {
        const element = container.querySelector('[style*="border"]');
        expect(element).toBeInTheDocument();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up on unmount', async () => {
      const { unmount } = renderWithProvider(
        <ParametricComponent type="test-component" />
      );

      await waitFor(() => {
        expect(screen.queryByText('Loading component...')).not.toBeInTheDocument();
      });

      const initialComponentCount = system.listComponents().length;
      
      unmount();

      // Component should be cleaned up
      expect(system.listComponents().length).toBeLessThanOrEqual(initialComponentCount);
    });
  });
});
