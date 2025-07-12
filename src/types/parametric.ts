/**
 * Core TypeScript definitions for the Parametric Design System
 * Provides comprehensive type safety for all components and parameters
 */

// Base parameter types
export type ParameterType = 
  | 'slider' 
  | 'color' 
  | 'dropdown' 
  | 'toggle' 
  | 'range' 
  | 'numeric' 
  | 'text'
  | 'multiSelect'
  | 'colorGradient'
  | 'bezierCurve'
  | 'vector2D'
  | 'vector3D';

// Parameter value types
export type ParameterValue = string | number | boolean | number[] | string[] | Record<string, any>;

// Validation function type
export type ValidationFunction<T = ParameterValue> = (value: T) => boolean | string;

// Enhanced parameter configuration interface with comprehensive validation and dependencies
export interface ParameterConfig<T = ParameterValue> {
  type: ParameterType;
  default: T;
  min?: number;
  max?: number;
  step?: number;
  options?: string[] | number[];
  unit?: string;
  description: string;
  group: string;
  dependencies?: string[];
  validation?: ValidationFunction<T>;
  conditional?: {
    dependsOn: string;
    condition: (value: ParameterValue) => boolean;
    showWhen?: boolean; // Show parameter when condition is true/false
  };
  responsive?: {
    breakpoints: Record<string, T>;
    autoScale?: boolean; // Automatically scale values based on screen size
  };
  constraints?: {
    linkedTo?: string; // Link this parameter to another parameter
    multiplier?: number; // Multiplier when linked
    offset?: number; // Offset when linked
  };
  metadata?: {
    category?: string;
    tags?: string[];
    experimental?: boolean;
    deprecated?: boolean;
    since?: string;
  };
}

// Component categories
export type ComponentCategory = 
  | 'textAnimations'
  | 'animations' 
  | 'components'
  | 'backgrounds'
  | 'layout'
  | 'interactive';

// Animation timing and easing
export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
  iterations: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
}

// Enhanced responsive configuration with adaptive behavior
export interface ResponsiveConfig {
  breakpoints: Record<string, number>;
  parameters: Record<string, Record<string, ParameterValue>>;
  adaptiveScaling?: {
    enabled: boolean;
    baseBreakpoint: string;
    scalingFactor: number;
  };
  orientationSupport?: {
    portrait: Record<string, ParameterValue>;
    landscape: Record<string, ParameterValue>;
  };
  deviceSupport?: {
    mobile: Record<string, ParameterValue>;
    tablet: Record<string, ParameterValue>;
    desktop: Record<string, ParameterValue>;
  };
}

// Preset configuration
export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  componentType: string;
  parameters: Record<string, ParameterValue>;
  metadata: {
    author: string;
    version: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  };
  responsive?: ResponsiveConfig;
}

// Enhanced component schema interface with comprehensive metadata and validation
export interface ComponentSchema {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  version: string;
  groups: Record<string, string[]>;
  parameters: Record<string, ParameterConfig>;
  presets: PresetConfig[];
  responsive: ResponsiveConfig;
  dependencies?: string[];
  examples?: {
    name: string;
    description: string;
    parameters: Record<string, ParameterValue>;
    preview?: string; // URL or base64 image for preview
  }[];
  metadata?: {
    author: string;
    license: string;
    repository?: string;
    documentation?: string;
    tags: string[];
    complexity: 'simple' | 'intermediate' | 'advanced';
    performance: {
      renderCost: 'low' | 'medium' | 'high';
      memoryCost: 'low' | 'medium' | 'high';
      animationCost: 'low' | 'medium' | 'high';
    };
    compatibility: {
      browsers: string[];
      frameworks: string[];
      devices: string[];
    };
  };
  validation?: {
    required: string[];
    conditionalRequired: Record<string, string[]>;
    mutuallyExclusive: string[][];
    customValidation?: (parameters: Record<string, ParameterValue>) => ValidationResult;
  };
}

// Component instance interface
export interface ComponentInstance {
  id: string;
  type: string;
  preset?: string;
  parameters: Record<string, ParameterValue>;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Component registry interface
export interface ComponentRegistry {
  [componentType: string]: ComponentSchema;
}

// Parameter update event
export interface ParameterUpdateEvent {
  componentId: string;
  componentType: string;
  parameter: string;
  oldValue: ParameterValue;
  newValue: ParameterValue;
  timestamp: Date;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Component render props
export interface ComponentRenderProps {
  parameters: Record<string, ParameterValue>;
  style: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  onParameterChange?: (parameter: string, value: ParameterValue) => void;
}

// Error types
export class ParametricError extends Error {
  constructor(
    message: string,
    public code: string,
    public componentType?: string,
    public parameter?: string
  ) {
    super(message);
    this.name = 'ParametricError';
  }
}

export class ValidationError extends ParametricError {
  constructor(message: string, componentType?: string, parameter?: string) {
    super(message, 'VALIDATION_ERROR', componentType, parameter);
    this.name = 'ValidationError';
  }
}

export class ConfigurationError extends ParametricError {
  constructor(message: string, componentType?: string) {
    super(message, 'CONFIGURATION_ERROR', componentType);
    this.name = 'ConfigurationError';
  }
}

// Storage interface
export interface StorageProvider {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
  delete(key: string): Promise<void>;
  list(): Promise<string[]>;
}

// Event system
export interface EventEmitter {
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}

// Plugin interface
export interface ParametricPlugin {
  name: string;
  version: string;
  components: ComponentRegistry;
  initialize?: () => void;
  destroy?: () => void;
}

// Main parametric system interface
export interface ParametricSystem {
  registerComponent(schema: ComponentSchema): void;
  createComponent(type: string, preset?: string): ComponentInstance;
  updateParameter(componentId: string, parameter: string, value: ParameterValue): void;
  validateParameters(componentType: string, parameters: Record<string, ParameterValue>): ValidationResult;
  savePreset(preset: PresetConfig): Promise<void>;
  loadPreset(presetId: string): Promise<PresetConfig>;
  exportConfiguration(componentIds?: string[]): string;
  importConfiguration(configuration: string): Promise<ComponentInstance[]>;
  getComponent(componentId: string): ComponentInstance | undefined;
  getSchema(componentType: string): ComponentSchema | undefined;
  listComponents(): ComponentInstance[];
  listSchemas(): ComponentSchema[];
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
}
