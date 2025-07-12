/**
 * Parametric Design System - Main Entry Point
 * Production-ready TypeScript implementation with comprehensive type safety
 */

// Core exports
export { ParametricSystem } from './core/ParametricSystem';
export { EventEmitter } from './core/EventEmitter';
export { ParameterValidator } from './core/ParameterValidator';
export { LocalStorageProvider } from './core/storage/LocalStorageProvider';

// Type exports
export type {
  ParameterType,
  ParameterValue,
  ParameterConfig,
  ComponentCategory,
  AnimationConfig,
  ResponsiveConfig,
  PresetConfig,
  ComponentSchema,
  ComponentInstance,
  ComponentRegistry,
  ParameterUpdateEvent,
  ValidationResult,
  ComponentRenderProps,
  StorageProvider,
  EventEmitter as IEventEmitter,
  ParametricSystem as IParametricSystem,
  ParametricPlugin
} from './types/parametric';

// Error exports
export {
  ParametricError,
  ValidationError,
  ConfigurationError
} from './types/parametric';

// Component exports
export { ParametricComponent, createComponent, useParametricComponent } from './components/ParametricComponent';
export { ComponentRenderer, registerRenderer, getRegisteredTypes, hasRenderer } from './components/ComponentRenderer';
export { ParametricControlPanel } from './components/ParametricControlPanel';

// Hook exports
export { useParametricSystem, ParametricSystemProvider } from './hooks/useParametricSystem';

// Schema exports
export { componentSchemas } from './schemas/componentSchemas';

// Renderer exports
export { HeroRenderer } from './components/renderers/HeroRenderer';
export { ButtonRenderer } from './components/renderers/ButtonRenderer';
export { CardRenderer } from './components/renderers/CardRenderer';
export { BlurTextRenderer } from './components/renderers/textAnimations/BlurTextRenderer';
export { SplitTextRenderer } from './components/renderers/textAnimations/SplitTextRenderer';
export { CircularTextRenderer } from './components/renderers/textAnimations/CircularTextRenderer';
export { ShinyTextRenderer } from './components/renderers/textAnimations/ShinyTextRenderer';
export { GradientTextRenderer } from './components/renderers/textAnimations/GradientTextRenderer';

// Initialization and factory functions
import { ParametricSystem } from './core/ParametricSystem';
import { LocalStorageProvider } from './core/storage/LocalStorageProvider';
import { componentSchemas } from './schemas/componentSchemas';

/**
 * Create a new parametric system instance with default configuration
 */
export function createParametricSystem(storage?: any): ParametricSystem {
  const system = new ParametricSystem(storage || new LocalStorageProvider());
  
  // Register all default component schemas
  Object.values(componentSchemas).forEach(schema => {
    system.registerComponent(schema);
  });

  return system;
}

/**
 * Global system instance for convenience
 */
let globalSystem: ParametricSystem | null = null;

/**
 * Get or create the global parametric system instance
 */
export function getGlobalSystem(): ParametricSystem {
  if (!globalSystem) {
    globalSystem = createParametricSystem();
  }
  return globalSystem;
}

/**
 * Initialize the parametric system with custom configuration
 */
export function initializeParametricSystem(config?: {
  storage?: any;
  schemas?: any[];
  plugins?: any[];
}): ParametricSystem {
  const system = createParametricSystem(config?.storage);
  
  // Register custom schemas
  if (config?.schemas) {
    config.schemas.forEach(schema => {
      system.registerComponent(schema);
    });
  }

  // Initialize plugins
  if (config?.plugins) {
    config.plugins.forEach(plugin => {
      if (plugin.initialize) {
        plugin.initialize();
      }
      
      // Register plugin components
      if (plugin.components) {
        Object.values(plugin.components).forEach(schema => {
          system.registerComponent(schema);
        });
      }
    });
  }

  // Set as global system
  globalSystem = system;
  
  return system;
}

/**
 * Factory function for creating components programmatically
 * Usage: const component = createParametricComponent('hero', 'modernDark')
 */
export function createParametricComponent(type: string, preset?: string) {
  const system = getGlobalSystem();
  return system.createComponent(type, preset);
}

/**
 * Utility function to validate component parameters
 */
export function validateComponentParameters(
  componentType: string, 
  parameters: Record<string, any>
) {
  const system = getGlobalSystem();
  return system.validateParameters(componentType, parameters);
}

/**
 * Utility function to get component schema
 */
export function getComponentSchema(componentType: string) {
  const system = getGlobalSystem();
  return system.getSchema(componentType);
}

/**
 * Utility function to list all available component types
 */
export function getAvailableComponentTypes(): string[] {
  const system = getGlobalSystem();
  return system.listSchemas().map(schema => schema.id);
}

/**
 * Utility function to save a preset
 */
export async function saveComponentPreset(preset: any) {
  const system = getGlobalSystem();
  return system.savePreset(preset);
}

/**
 * Utility function to load a preset
 */
export async function loadComponentPreset(presetId: string) {
  const system = getGlobalSystem();
  return system.loadPreset(presetId);
}

/**
 * Utility function to export configuration
 */
export function exportSystemConfiguration(componentIds?: string[]): string {
  const system = getGlobalSystem();
  return system.exportConfiguration(componentIds);
}

/**
 * Utility function to import configuration
 */
export async function importSystemConfiguration(configuration: string) {
  const system = getGlobalSystem();
  return system.importConfiguration(configuration);
}

// Version information
export const VERSION = '1.0.0';

// Default export for convenience
export default {
  ParametricSystem,
  createParametricSystem,
  getGlobalSystem,
  initializeParametricSystem,
  createParametricComponent,
  validateComponentParameters,
  getComponentSchema,
  getAvailableComponentTypes,
  saveComponentPreset,
  loadComponentPreset,
  exportSystemConfiguration,
  importSystemConfiguration,
  VERSION
};
