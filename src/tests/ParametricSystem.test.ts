/**
 * Comprehensive tests for ParametricSystem
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ParametricSystem } from '../core/ParametricSystem';
import { LocalStorageProvider } from '../core/storage/LocalStorageProvider';
import { ComponentSchema, PresetConfig } from '../types/parametric';

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

describe('ParametricSystem', () => {
  let system: ParametricSystem;
  let mockStorage: LocalStorageProvider;

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
    mockStorage = new LocalStorageProvider();
    system = new ParametricSystem(mockStorage);
  });

  describe('Component Registration', () => {
    it('should register a component schema', () => {
      system.registerComponent(testSchema);
      const retrievedSchema = system.getSchema('test-component');
      expect(retrievedSchema).toEqual(testSchema);
    });

    it('should throw error for invalid schema', () => {
      const invalidSchema = { ...testSchema, id: '' };
      expect(() => system.registerComponent(invalidSchema as ComponentSchema)).toThrow();
    });

    it('should emit componentRegistered event', () => {
      const listener = vi.fn();
      system.on('componentRegistered', listener);
      
      system.registerComponent(testSchema);
      
      expect(listener).toHaveBeenCalledWith(testSchema);
    });
  });

  describe('Component Creation', () => {
    beforeEach(() => {
      system.registerComponent(testSchema);
    });

    it('should create a component with default parameters', () => {
      const component = system.createComponent('test-component');
      
      expect(component).toMatchObject({
        type: 'test-component',
        parameters: {
          backgroundColor: '#ffffff',
          opacity: 1,
          padding: 16
        }
      });
      expect(component.id).toBeDefined();
      expect(component.metadata.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error for unknown component type', () => {
      expect(() => system.createComponent('unknown-component')).toThrow();
    });

    it('should emit componentCreated event', () => {
      const listener = vi.fn();
      system.on('componentCreated', listener);
      
      const component = system.createComponent('test-component');
      
      expect(listener).toHaveBeenCalledWith(component);
    });
  });

  describe('Parameter Updates', () => {
    let componentId: string;

    beforeEach(() => {
      system.registerComponent(testSchema);
      const component = system.createComponent('test-component');
      componentId = component.id;
    });

    it('should update parameter value', () => {
      system.updateParameter(componentId, 'opacity', 0.5);
      
      const component = system.getComponent(componentId);
      expect(component?.parameters.opacity).toBe(0.5);
    });

    it('should validate parameter values', () => {
      expect(() => system.updateParameter(componentId, 'opacity', 2)).toThrow();
    });

    it('should throw error for unknown parameter', () => {
      expect(() => system.updateParameter(componentId, 'unknownParam', 'value')).toThrow();
    });

    it('should emit parameterUpdated event', () => {
      const listener = vi.fn();
      system.on('parameterUpdated', listener);
      
      system.updateParameter(componentId, 'opacity', 0.5);
      
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId,
          parameter: 'opacity',
          oldValue: 1,
          newValue: 0.5
        })
      );
    });
  });

  describe('Parameter Validation', () => {
    beforeEach(() => {
      system.registerComponent(testSchema);
    });

    it('should validate valid parameters', () => {
      const result = system.validateParameters('test-component', {
        backgroundColor: '#ff0000',
        opacity: 0.8,
        padding: 20
      });
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid parameter values', () => {
      const result = system.validateParameters('test-component', {
        backgroundColor: '#ff0000',
        opacity: 2, // Invalid: exceeds max
        padding: 20
      });
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect missing required parameters', () => {
      const result = system.validateParameters('test-component', {
        backgroundColor: '#ff0000'
        // Missing opacity and padding
      });
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Preset Management', () => {
    const testPreset: PresetConfig = {
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
        author: 'Test Author',
        version: '1.0.0',
        tags: ['test'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    beforeEach(() => {
      system.registerComponent(testSchema);
    });

    it('should save a preset', async () => {
      await system.savePreset(testPreset);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        expect.stringContaining('preset_test-preset'),
        expect.any(String)
      );
    });

    it('should load a preset', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testPreset));
      
      const loadedPreset = await system.loadPreset('test-preset');
      
      expect(loadedPreset).toEqual(testPreset);
    });

    it('should create component with preset', () => {
      system.registerComponent({
        ...testSchema,
        presets: [testPreset]
      });
      
      const component = system.createComponent('test-component', 'test-preset');
      
      expect(component.parameters).toEqual(testPreset.parameters);
      expect(component.preset).toBe('test-preset');
    });
  });

  describe('Configuration Export/Import', () => {
    let componentId: string;

    beforeEach(() => {
      system.registerComponent(testSchema);
      const component = system.createComponent('test-component');
      componentId = component.id;
    });

    it('should export configuration', () => {
      const config = system.exportConfiguration();
      const parsed = JSON.parse(config);
      
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('components');
      expect(parsed.components).toHaveLength(1);
    });

    it('should import configuration', async () => {
      const config = system.exportConfiguration();
      
      // Clear current state
      system.listComponents().forEach(comp => {
        // Assuming we have a method to remove components
      });
      
      const importedComponents = await system.importConfiguration(config);
      
      expect(importedComponents).toHaveLength(1);
      expect(importedComponents[0].type).toBe('test-component');
    });
  });

  describe('Event System', () => {
    it('should add and remove event listeners', () => {
      const listener = vi.fn();
      
      system.on('test-event', listener);
      system.emit('test-event', 'test-data');
      
      expect(listener).toHaveBeenCalledWith('test-data');
      
      system.off('test-event', listener);
      system.emit('test-event', 'test-data-2');
      
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      
      const testPreset: PresetConfig = {
        id: 'test-preset',
        name: 'Test Preset',
        description: 'A test preset',
        category: 'layout',
        componentType: 'test-component',
        parameters: {},
        metadata: {
          author: 'Test',
          version: '1.0.0',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };
      
      await expect(system.savePreset(testPreset)).rejects.toThrow();
    });
  });
});
