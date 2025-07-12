/**
 * Core Parametric System Implementation
 * Provides the main API for component management, parameter validation, and preset handling
 */

import { 
  ComponentSchema, 
  ComponentInstance, 
  PresetConfig, 
  ParameterValue, 
  ValidationResult,
  ParametricSystem as IParametricSystem,
  ParametricError,
  ValidationError,
  ConfigurationError,
  StorageProvider,
  ParameterUpdateEvent
} from '../types/parametric';
import { EventEmitter } from './EventEmitter';
import { ParameterValidator } from './ParameterValidator';
import { LocalStorageProvider } from './storage/LocalStorageProvider';

export class ParametricSystem implements IParametricSystem {
  private schemas: Map<string, ComponentSchema> = new Map();
  private components: Map<string, ComponentInstance> = new Map();
  private presets: Map<string, PresetConfig> = new Map();
  private eventEmitter: EventEmitter = new EventEmitter();
  private validator: ParameterValidator = new ParameterValidator();
  private storage: StorageProvider;

  constructor(storage?: StorageProvider) {
    this.storage = storage || new LocalStorageProvider();
    this.loadPresetsFromStorage();
  }

  /**
   * Register a new component schema
   */
  registerComponent(schema: ComponentSchema): void {
    try {
      this.validateSchema(schema);
      this.schemas.set(schema.id, schema);
      
      // Register presets from schema
      schema.presets.forEach(preset => {
        this.presets.set(preset.id, preset);
      });

      this.eventEmitter.emit('componentRegistered', schema);
    } catch (error) {
      throw new ConfigurationError(
        `Failed to register component: ${error.message}`,
        schema.id
      );
    }
  }

  /**
   * Create a new component instance
   */
  createComponent(type: string, preset?: string): ComponentInstance {
    const schema = this.schemas.get(type);
    if (!schema) {
      throw new ConfigurationError(`Component type '${type}' not found`);
    }

    let parameters: Record<string, ParameterValue> = {};

    // Apply default parameters
    Object.entries(schema.parameters).forEach(([key, config]) => {
      parameters[key] = config.default;
    });

    // Apply preset if specified
    if (preset) {
      const presetConfig = this.presets.get(preset);
      if (!presetConfig) {
        throw new ConfigurationError(`Preset '${preset}' not found`);
      }
      if (presetConfig.componentType !== type) {
        throw new ConfigurationError(
          `Preset '${preset}' is not compatible with component type '${type}'`
        );
      }
      parameters = { ...parameters, ...presetConfig.parameters };
    }

    // Validate parameters
    const validation = this.validateParameters(type, parameters);
    if (!validation.isValid) {
      throw new ValidationError(
        `Invalid parameters: ${validation.errors.join(', ')}`,
        type
      );
    }

    const instance: ComponentInstance = {
      id: this.generateId(),
      type,
      preset,
      parameters,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    this.components.set(instance.id, instance);
    this.eventEmitter.emit('componentCreated', instance);

    return instance;
  }

  /**
   * Update a parameter value for a component
   */
  updateParameter(componentId: string, parameter: string, value: ParameterValue): void {
    const component = this.components.get(componentId);
    if (!component) {
      throw new ConfigurationError(`Component '${componentId}' not found`);
    }

    const schema = this.schemas.get(component.type);
    if (!schema) {
      throw new ConfigurationError(`Schema for component type '${component.type}' not found`);
    }

    const paramConfig = schema.parameters[parameter];
    if (!paramConfig) {
      throw new ValidationError(
        `Parameter '${parameter}' not found in component type '${component.type}'`,
        component.type,
        parameter
      );
    }

    // Validate the new value
    const isValid = this.validator.validateParameter(paramConfig, value);
    if (!isValid) {
      throw new ValidationError(
        `Invalid value for parameter '${parameter}'`,
        component.type,
        parameter
      );
    }

    const oldValue = component.parameters[parameter];
    component.parameters[parameter] = value;
    component.metadata.updatedAt = new Date();

    const event: ParameterUpdateEvent = {
      componentId,
      componentType: component.type,
      parameter,
      oldValue,
      newValue: value,
      timestamp: new Date()
    };

    this.eventEmitter.emit('parameterUpdated', event);
  }

  /**
   * Validate all parameters for a component type
   */
  validateParameters(componentType: string, parameters: Record<string, ParameterValue>): ValidationResult {
    const schema = this.schemas.get(componentType);
    if (!schema) {
      return {
        isValid: false,
        errors: [`Component type '${componentType}' not found`],
        warnings: []
      };
    }

    return this.validator.validateParameters(schema, parameters);
  }

  /**
   * Save a preset configuration
   */
  async savePreset(preset: PresetConfig): Promise<void> {
    try {
      // Validate preset
      if (!preset.id || !preset.name || !preset.componentType) {
        throw new ValidationError('Preset must have id, name, and componentType');
      }

      // Validate that component type exists
      if (!this.schemas.has(preset.componentType)) {
        throw new ValidationError(`Component type '${preset.componentType}' not found`);
      }

      // Validate parameters
      const validation = this.validateParameters(preset.componentType, preset.parameters);
      if (!validation.isValid) {
        throw new ValidationError(`Invalid preset parameters: ${validation.errors.join(', ')}`);
      }

      this.presets.set(preset.id, preset);
      await this.storage.save(`preset_${preset.id}`, preset);
      
      this.eventEmitter.emit('presetSaved', preset);
    } catch (error) {
      throw new ConfigurationError(`Failed to save preset: ${error.message}`);
    }
  }

  /**
   * Load a preset configuration
   */
  async loadPreset(presetId: string): Promise<PresetConfig> {
    try {
      let preset = this.presets.get(presetId);
      
      if (!preset) {
        preset = await this.storage.load(`preset_${presetId}`);
        if (preset) {
          this.presets.set(presetId, preset);
        }
      }

      if (!preset) {
        throw new ConfigurationError(`Preset '${presetId}' not found`);
      }

      return preset;
    } catch (error) {
      throw new ConfigurationError(`Failed to load preset: ${error.message}`);
    }
  }

  /**
   * Export configuration as JSON string
   */
  exportConfiguration(componentIds?: string[]): string {
    const componentsToExport = componentIds 
      ? componentIds.map(id => this.components.get(id)).filter(Boolean)
      : Array.from(this.components.values());

    const configuration = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      components: componentsToExport,
      presets: Array.from(this.presets.values())
    };

    return JSON.stringify(configuration, null, 2);
  }

  /**
   * Import configuration from JSON string
   */
  async importConfiguration(configuration: string): Promise<ComponentInstance[]> {
    try {
      const config = JSON.parse(configuration);
      const importedComponents: ComponentInstance[] = [];

      // Import presets first
      if (config.presets) {
        for (const preset of config.presets) {
          await this.savePreset(preset);
        }
      }

      // Import components
      if (config.components) {
        for (const componentData of config.components) {
          const component = this.createComponent(componentData.type, componentData.preset);
          
          // Apply imported parameters
          Object.entries(componentData.parameters).forEach(([param, value]) => {
            this.updateParameter(component.id, param, value);
          });

          importedComponents.push(component);
        }
      }

      this.eventEmitter.emit('configurationImported', importedComponents);
      return importedComponents;
    } catch (error) {
      throw new ConfigurationError(`Failed to import configuration: ${error.message}`);
    }
  }

  // Getter methods
  getComponent(componentId: string): ComponentInstance | undefined {
    return this.components.get(componentId);
  }

  getSchema(componentType: string): ComponentSchema | undefined {
    return this.schemas.get(componentType);
  }

  listComponents(): ComponentInstance[] {
    return Array.from(this.components.values());
  }

  listSchemas(): ComponentSchema[] {
    return Array.from(this.schemas.values());
  }

  // Event system
  on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener);
  }

  off(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.off(event, listener);
  }

  // Private methods
  private validateSchema(schema: ComponentSchema): void {
    if (!schema.id || !schema.name || !schema.category) {
      throw new ValidationError('Schema must have id, name, and category');
    }

    if (!schema.parameters || Object.keys(schema.parameters).length === 0) {
      throw new ValidationError('Schema must have at least one parameter');
    }

    // Validate parameter configurations
    Object.entries(schema.parameters).forEach(([key, config]) => {
      if (!config.type || config.default === undefined) {
        throw new ValidationError(`Parameter '${key}' must have type and default value`);
      }
    });
  }

  private generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async loadPresetsFromStorage(): Promise<void> {
    try {
      const keys = await this.storage.list();
      const presetKeys = keys.filter(key => key.startsWith('preset_'));
      
      for (const key of presetKeys) {
        try {
          const preset = await this.storage.load(key);
          if (preset) {
            this.presets.set(preset.id, preset);
          }
        } catch (error) {
          console.warn(`Failed to load preset from key '${key}':`, error);
        }
      }
    } catch (error) {
      console.warn('Failed to load presets from storage:', error);
    }
  }
}
