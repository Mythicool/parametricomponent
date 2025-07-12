/**
 * Tests for ParameterValidator
 */

import { describe, it, expect } from 'vitest';
import { ParameterValidator } from '../core/ParameterValidator';
import { ParameterConfig, ComponentSchema } from '../types/parametric';

describe('ParameterValidator', () => {
  let validator: ParameterValidator;

  beforeEach(() => {
    validator = new ParameterValidator();
  });

  describe('Numeric Parameter Validation', () => {
    const numericConfig: ParameterConfig = {
      type: 'slider',
      min: 0,
      max: 100,
      step: 5,
      default: 50,
      description: 'Test numeric parameter',
      group: 'test'
    };

    it('should validate valid numeric values', () => {
      expect(validator.validateParameter(numericConfig, 25)).toBe(true);
      expect(validator.validateParameter(numericConfig, 0)).toBe(true);
      expect(validator.validateParameter(numericConfig, 100)).toBe(true);
    });

    it('should reject values outside range', () => {
      expect(validator.validateParameter(numericConfig, -1)).toBe(false);
      expect(validator.validateParameter(numericConfig, 101)).toBe(false);
    });

    it('should validate step increments', () => {
      expect(validator.validateParameter(numericConfig, 25)).toBe(true); // 5 * 5
      expect(validator.validateParameter(numericConfig, 27)).toBe(false); // Not divisible by step
    });

    it('should reject non-numeric values', () => {
      expect(validator.validateParameter(numericConfig, 'invalid')).toBe(false);
      expect(validator.validateParameter(numericConfig, null)).toBe(false);
    });
  });

  describe('Color Parameter Validation', () => {
    const colorConfig: ParameterConfig = {
      type: 'color',
      default: '#ffffff',
      description: 'Test color parameter',
      group: 'test'
    };

    it('should validate hex colors', () => {
      expect(validator.validateParameter(colorConfig, '#ffffff')).toBe(true);
      expect(validator.validateParameter(colorConfig, '#000')).toBe(true);
      expect(validator.validateParameter(colorConfig, '#ff0000')).toBe(true);
    });

    it('should validate RGB colors', () => {
      expect(validator.validateParameter(colorConfig, 'rgb(255, 255, 255)')).toBe(true);
      expect(validator.validateParameter(colorConfig, 'rgba(255, 0, 0, 0.5)')).toBe(true);
    });

    it('should validate HSL colors', () => {
      expect(validator.validateParameter(colorConfig, 'hsl(360, 100%, 50%)')).toBe(true);
      expect(validator.validateParameter(colorConfig, 'hsla(180, 50%, 25%, 0.8)')).toBe(true);
    });

    it('should reject invalid color formats', () => {
      expect(validator.validateParameter(colorConfig, '#gggggg')).toBe(false);
      expect(validator.validateParameter(colorConfig, 'rgb(256, 0, 0)')).toBe(false);
      expect(validator.validateParameter(colorConfig, 'invalid-color')).toBe(false);
    });
  });

  describe('Dropdown Parameter Validation', () => {
    const dropdownConfig: ParameterConfig = {
      type: 'dropdown',
      options: ['option1', 'option2', 'option3'],
      default: 'option1',
      description: 'Test dropdown parameter',
      group: 'test'
    };

    it('should validate valid options', () => {
      expect(validator.validateParameter(dropdownConfig, 'option1')).toBe(true);
      expect(validator.validateParameter(dropdownConfig, 'option2')).toBe(true);
      expect(validator.validateParameter(dropdownConfig, 'option3')).toBe(true);
    });

    it('should reject invalid options', () => {
      expect(validator.validateParameter(dropdownConfig, 'invalid-option')).toBe(false);
      expect(validator.validateParameter(dropdownConfig, '')).toBe(false);
    });
  });

  describe('Toggle Parameter Validation', () => {
    const toggleConfig: ParameterConfig = {
      type: 'toggle',
      default: true,
      description: 'Test toggle parameter',
      group: 'test'
    };

    it('should validate boolean values', () => {
      expect(validator.validateParameter(toggleConfig, true)).toBe(true);
      expect(validator.validateParameter(toggleConfig, false)).toBe(true);
    });

    it('should reject non-boolean values', () => {
      expect(validator.validateParameter(toggleConfig, 'true')).toBe(false);
      expect(validator.validateParameter(toggleConfig, 1)).toBe(false);
      expect(validator.validateParameter(toggleConfig, 0)).toBe(false);
    });
  });

  describe('Range Parameter Validation', () => {
    const rangeConfig: ParameterConfig = {
      type: 'range',
      min: 0,
      max: 100,
      default: [25, 75],
      description: 'Test range parameter',
      group: 'test'
    };

    it('should validate valid ranges', () => {
      expect(validator.validateParameter(rangeConfig, [10, 90])).toBe(true);
      expect(validator.validateParameter(rangeConfig, [0, 100])).toBe(true);
      expect(validator.validateParameter(rangeConfig, [50, 50])).toBe(true);
    });

    it('should reject invalid ranges', () => {
      expect(validator.validateParameter(rangeConfig, [90, 10])).toBe(false); // min > max
      expect(validator.validateParameter(rangeConfig, [-10, 50])).toBe(false); // below min
      expect(validator.validateParameter(rangeConfig, [50, 110])).toBe(false); // above max
      expect(validator.validateParameter(rangeConfig, [50])).toBe(false); // wrong length
    });
  });

  describe('Component Schema Validation', () => {
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

    it('should validate all parameters successfully', () => {
      const result = validator.validateParameters(testSchema, {
        backgroundColor: '#ff0000',
        opacity: 0.8,
        padding: 24
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing parameters', () => {
      const result = validator.validateParameters(testSchema, {
        backgroundColor: '#ff0000'
        // Missing opacity and padding
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(error => error.includes('opacity'))).toBe(true);
      expect(result.errors.some(error => error.includes('padding'))).toBe(true);
    });

    it('should detect invalid parameter values', () => {
      const result = validator.validateParameters(testSchema, {
        backgroundColor: 'invalid-color',
        opacity: 2, // exceeds max
        padding: -5 // below min
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should warn about unknown parameters', () => {
      const result = validator.validateParameters(testSchema, {
        backgroundColor: '#ff0000',
        opacity: 0.8,
        padding: 24,
        unknownParam: 'value'
      });

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(warning => warning.includes('unknownParam'))).toBe(true);
    });
  });

  describe('Custom Validation Functions', () => {
    it('should execute custom validation functions', () => {
      const customConfig: ParameterConfig = {
        type: 'text',
        default: '',
        description: 'Test custom validation',
        group: 'test',
        validation: (value: string) => {
          if (typeof value !== 'string') return false;
          if (value.length < 3) return 'Must be at least 3 characters';
          if (value.includes('invalid')) return 'Cannot contain "invalid"';
          return true;
        }
      };

      expect(validator.validateParameter(customConfig, 'valid')).toBe(true);
      expect(validator.validateParameter(customConfig, 'ab')).toBe(false);
      expect(validator.validateParameter(customConfig, 'invalid-text')).toBe(false);
    });
  });

  describe('Advanced Parameter Types', () => {
    it('should validate vector2D parameters', () => {
      const vector2DConfig: ParameterConfig = {
        type: 'vector2D',
        default: [0, 0],
        description: 'Test vector2D parameter',
        group: 'test'
      };

      expect(validator.validateParameter(vector2DConfig, [10, 20])).toBe(true);
      expect(validator.validateParameter(vector2DConfig, [10])).toBe(false);
      expect(validator.validateParameter(vector2DConfig, [10, 20, 30])).toBe(false);
      expect(validator.validateParameter(vector2DConfig, ['10', '20'])).toBe(false);
    });

    it('should validate bezier curve parameters', () => {
      const bezierConfig: ParameterConfig = {
        type: 'bezierCurve',
        default: [0, 0, 1, 1],
        description: 'Test bezier curve parameter',
        group: 'test'
      };

      expect(validator.validateParameter(bezierConfig, [0.25, 0.1, 0.25, 1])).toBe(true);
      expect(validator.validateParameter(bezierConfig, [0, 0, 1])).toBe(false); // wrong length
      expect(validator.validateParameter(bezierConfig, [-0.1, 0, 1, 1])).toBe(false); // out of range
      expect(validator.validateParameter(bezierConfig, [0, 0, 1, 1.1])).toBe(false); // out of range
    });
  });
});
