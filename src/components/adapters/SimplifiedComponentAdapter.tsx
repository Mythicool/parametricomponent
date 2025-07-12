/**
 * Simplified Component Adapter
 * Provides seamless integration between simplified components and the parametric control system
 */

import React from 'react';
import { ComponentRenderProps } from '../../types/parametric';

// Import simplified renderers
import { SimplifiedButtonRenderer } from '../renderers/simplified/SimplifiedButtonRenderer';
import { SimplifiedHeroRenderer } from '../renderers/simplified/SimplifiedHeroRenderer';
import { SimplifiedCardRenderer } from '../renderers/simplified/SimplifiedCardRenderer';

export interface SimplifiedComponentAdapterProps {
  componentType: string;
  renderProps: ComponentRenderProps;
}

/**
 * Registry of simplified component renderers
 * These components are designed to be cleaner, more maintainable versions
 * of the original components while maintaining full parametric control compatibility
 */
const SIMPLIFIED_COMPONENT_RENDERERS: Record<string, React.ComponentType<ComponentRenderProps>> = {
  // Core components (Phase 1)
  'button-simplified': SimplifiedButtonRenderer,
  'hero-simplified': SimplifiedHeroRenderer,
  'card-simplified': SimplifiedCardRenderer,
  
  // Aliases for easy migration
  'button': SimplifiedButtonRenderer,
  'hero': SimplifiedHeroRenderer,
  'card': SimplifiedCardRenderer,
};

/**
 * Component adapter that handles the rendering of simplified components
 * while maintaining compatibility with the parametric control system
 */
export const SimplifiedComponentAdapter: React.FC<SimplifiedComponentAdapterProps> = ({
  componentType,
  renderProps
}) => {
  // Check if we have a simplified version of this component
  const SimplifiedRenderer = SIMPLIFIED_COMPONENT_RENDERERS[componentType];
  
  if (!SimplifiedRenderer) {
    return (
      <div className="parametric-adapter-error" style={{
        padding: '16px',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        backgroundColor: '#fef3c7',
        color: '#92400e'
      }}>
        <h4>Component Not Found</h4>
        <p>Simplified component type: <code>{componentType}</code> is not available.</p>
        <p>Available components: {Object.keys(SIMPLIFIED_COMPONENT_RENDERERS).join(', ')}</p>
      </div>
    );
  }

  try {
    return <SimplifiedRenderer {...renderProps} />;
  } catch (error) {
    return (
      <div className="parametric-adapter-error" style={{
        padding: '16px',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
        color: '#dc2626'
      }}>
        <h4>Render Error</h4>
        <p>Failed to render simplified component: <code>{componentType}</code></p>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
};

/**
 * Register a new simplified component renderer
 */
export function registerSimplifiedRenderer(
  componentType: string, 
  renderer: React.ComponentType<ComponentRenderProps>
): void {
  SIMPLIFIED_COMPONENT_RENDERERS[componentType] = renderer;
}

/**
 * Get all registered simplified component types
 */
export function getSimplifiedComponentTypes(): string[] {
  return Object.keys(SIMPLIFIED_COMPONENT_RENDERERS);
}

/**
 * Check if a simplified version exists for a component type
 */
export function hasSimplifiedRenderer(componentType: string): boolean {
  return componentType in SIMPLIFIED_COMPONENT_RENDERERS;
}

/**
 * Get the simplified renderer for a component type
 */
export function getSimplifiedRenderer(componentType: string): React.ComponentType<ComponentRenderProps> | undefined {
  return SIMPLIFIED_COMPONENT_RENDERERS[componentType];
}

/**
 * Migration helper: Check if we should use simplified version
 * This can be used to gradually migrate components
 */
export function shouldUseSimplified(componentType: string, useSimplified: boolean = true): boolean {
  return useSimplified && hasSimplifiedRenderer(componentType);
}

/**
 * Component factory that automatically chooses between original and simplified versions
 */
export interface AdaptiveComponentProps extends SimplifiedComponentAdapterProps {
  useSimplified?: boolean;
  fallbackRenderer?: React.ComponentType<ComponentRenderProps>;
}

export const AdaptiveComponent: React.FC<AdaptiveComponentProps> = ({
  componentType,
  renderProps,
  useSimplified = true,
  fallbackRenderer
}) => {
  // Use simplified version if available and requested
  if (shouldUseSimplified(componentType, useSimplified)) {
    return (
      <SimplifiedComponentAdapter 
        componentType={componentType}
        renderProps={renderProps}
      />
    );
  }

  // Fall back to provided renderer or show error
  if (fallbackRenderer) {
    const FallbackRenderer = fallbackRenderer;
    return <FallbackRenderer {...renderProps} />;
  }

  return (
    <div className="parametric-adapter-fallback" style={{
      padding: '16px',
      border: '1px solid #6b7280',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      color: '#374151'
    }}>
      <h4>No Renderer Available</h4>
      <p>No simplified or fallback renderer found for: <code>{componentType}</code></p>
    </div>
  );
};
