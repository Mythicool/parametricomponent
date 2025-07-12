/**
 * Plugin Manager for Parametric System
 * Enables extensible architecture for adding new component types and animation categories
 */

import { ComponentSchema, ParametricPlugin, ComponentRegistry } from '../types/parametric';
import { EventEmitter } from './EventEmitter';

export interface PluginMetadata {
  name: string;
  version: string;
  author: string;
  description: string;
  dependencies: string[];
  loadOrder: number;
  enabled: boolean;
}

export interface PluginContext {
  registerComponent: (schema: ComponentSchema) => void;
  registerRenderer: (type: string, renderer: any) => void;
  getSystem: () => any;
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
}

export class PluginManager extends EventEmitter {
  private plugins: Map<string, ParametricPlugin> = new Map();
  private metadata: Map<string, PluginMetadata> = new Map();
  private loadOrder: string[] = [];
  private context: PluginContext;

  constructor(context: PluginContext) {
    super();
    this.context = context;
  }

  /**
   * Register a plugin
   */
  registerPlugin(plugin: ParametricPlugin, metadata: PluginMetadata): void {
    // Validate plugin
    this.validatePlugin(plugin, metadata);

    // Check dependencies
    this.checkDependencies(metadata);

    // Store plugin and metadata
    this.plugins.set(plugin.name, plugin);
    this.metadata.set(plugin.name, metadata);

    // Add to load order
    this.insertInLoadOrder(plugin.name, metadata.loadOrder);

    this.emit('pluginRegistered', { plugin, metadata });
  }

  /**
   * Load all registered plugins
   */
  async loadPlugins(): Promise<void> {
    for (const pluginName of this.loadOrder) {
      await this.loadPlugin(pluginName);
    }
  }

  /**
   * Load a specific plugin
   */
  async loadPlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    const metadata = this.metadata.get(pluginName);

    if (!plugin || !metadata) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }

    if (!metadata.enabled) {
      return;
    }

    try {
      // Initialize plugin
      if (plugin.initialize) {
        await plugin.initialize();
      }

      // Register components
      if (plugin.components) {
        Object.values(plugin.components).forEach(schema => {
          this.context.registerComponent(schema);
        });
      }

      // Register renderers if available
      if ('renderers' in plugin && plugin.renderers) {
        Object.entries(plugin.renderers).forEach(([type, renderer]) => {
          this.context.registerRenderer(type, renderer);
        });
      }

      this.emit('pluginLoaded', { plugin, metadata });
    } catch (error) {
      this.emit('pluginLoadError', { plugin, metadata, error });
      throw new Error(`Failed to load plugin '${pluginName}': ${error.message}`);
    }
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    const metadata = this.metadata.get(pluginName);

    if (!plugin || !metadata) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }

    try {
      // Call plugin destroy method
      if (plugin.destroy) {
        await plugin.destroy();
      }

      this.emit('pluginUnloaded', { plugin, metadata });
    } catch (error) {
      this.emit('pluginUnloadError', { plugin, metadata, error });
      throw new Error(`Failed to unload plugin '${pluginName}': ${error.message}`);
    }
  }

  /**
   * Enable a plugin
   */
  enablePlugin(pluginName: string): void {
    const metadata = this.metadata.get(pluginName);
    if (metadata) {
      metadata.enabled = true;
      this.emit('pluginEnabled', pluginName);
    }
  }

  /**
   * Disable a plugin
   */
  disablePlugin(pluginName: string): void {
    const metadata = this.metadata.get(pluginName);
    if (metadata) {
      metadata.enabled = false;
      this.emit('pluginDisabled', pluginName);
    }
  }

  /**
   * Get plugin information
   */
  getPlugin(pluginName: string): { plugin: ParametricPlugin; metadata: PluginMetadata } | null {
    const plugin = this.plugins.get(pluginName);
    const metadata = this.metadata.get(pluginName);
    
    if (plugin && metadata) {
      return { plugin, metadata };
    }
    
    return null;
  }

  /**
   * List all plugins
   */
  listPlugins(): Array<{ plugin: ParametricPlugin; metadata: PluginMetadata }> {
    return Array.from(this.plugins.keys()).map(name => {
      const plugin = this.plugins.get(name)!;
      const metadata = this.metadata.get(name)!;
      return { plugin, metadata };
    });
  }

  /**
   * Get enabled plugins
   */
  getEnabledPlugins(): Array<{ plugin: ParametricPlugin; metadata: PluginMetadata }> {
    return this.listPlugins().filter(({ metadata }) => metadata.enabled);
  }

  /**
   * Check if plugin is loaded
   */
  isPluginLoaded(pluginName: string): boolean {
    return this.plugins.has(pluginName);
  }

  /**
   * Check if plugin is enabled
   */
  isPluginEnabled(pluginName: string): boolean {
    const metadata = this.metadata.get(pluginName);
    return metadata ? metadata.enabled : false;
  }

  // Private methods

  private validatePlugin(plugin: ParametricPlugin, metadata: PluginMetadata): void {
    if (!plugin.name || !plugin.version) {
      throw new Error('Plugin must have name and version');
    }

    if (plugin.name !== metadata.name) {
      throw new Error('Plugin name mismatch between plugin and metadata');
    }

    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' is already registered`);
    }
  }

  private checkDependencies(metadata: PluginMetadata): void {
    for (const dependency of metadata.dependencies) {
      if (!this.plugins.has(dependency)) {
        throw new Error(`Plugin '${metadata.name}' depends on '${dependency}' which is not registered`);
      }
    }
  }

  private insertInLoadOrder(pluginName: string, loadOrder: number): void {
    // Find insertion point based on load order
    let insertIndex = this.loadOrder.length;
    
    for (let i = 0; i < this.loadOrder.length; i++) {
      const existingPluginName = this.loadOrder[i];
      const existingMetadata = this.metadata.get(existingPluginName);
      
      if (existingMetadata && existingMetadata.loadOrder > loadOrder) {
        insertIndex = i;
        break;
      }
    }
    
    this.loadOrder.splice(insertIndex, 0, pluginName);
  }
}

/**
 * Plugin factory for creating standard plugins
 */
export class PluginFactory {
  /**
   * Create a component plugin
   */
  static createComponentPlugin(
    name: string,
    version: string,
    components: ComponentRegistry,
    options: Partial<PluginMetadata> = {}
  ): { plugin: ParametricPlugin; metadata: PluginMetadata } {
    const plugin: ParametricPlugin = {
      name,
      version,
      components,
      initialize: async () => {
        console.log(`Component plugin '${name}' initialized`);
      }
    };

    const metadata: PluginMetadata = {
      name,
      version,
      author: 'Unknown',
      description: `Component plugin for ${name}`,
      dependencies: [],
      loadOrder: 100,
      enabled: true,
      ...options
    };

    return { plugin, metadata };
  }

  /**
   * Create a renderer plugin
   */
  static createRendererPlugin(
    name: string,
    version: string,
    renderers: Record<string, any>,
    options: Partial<PluginMetadata> = {}
  ): { plugin: ParametricPlugin; metadata: PluginMetadata } {
    const plugin: ParametricPlugin = {
      name,
      version,
      components: {},
      renderers,
      initialize: async () => {
        console.log(`Renderer plugin '${name}' initialized`);
      }
    };

    const metadata: PluginMetadata = {
      name,
      version,
      author: 'Unknown',
      description: `Renderer plugin for ${name}`,
      dependencies: [],
      loadOrder: 50,
      enabled: true,
      ...options
    };

    return { plugin, metadata };
  }
}
