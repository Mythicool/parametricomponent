/**
 * Parameter Validation System
 * Handles validation of parameter values against their configurations
 */

import { 
  ParameterConfig, 
  ParameterValue, 
  ComponentSchema, 
  ValidationResult,
  ValidationError 
} from '../types/parametric';

export class ParameterValidator {
  /**
   * Validate a single parameter value
   */
  validateParameter(config: ParameterConfig, value: ParameterValue): boolean {
    try {
      // Type-specific validation
      switch (config.type) {
        case 'slider':
        case 'numeric':
          return this.validateNumeric(config, value as number);
        
        case 'color':
          return this.validateColor(value as string);
        
        case 'dropdown':
          return this.validateDropdown(config, value as string);
        
        case 'toggle':
          return typeof value === 'boolean';
        
        case 'range':
          return this.validateRange(config, value as number[]);
        
        case 'text':
          return typeof value === 'string';
        
        case 'multiSelect':
          return this.validateMultiSelect(config, value as string[]);
        
        case 'colorGradient':
          return this.validateColorGradient(value);
        
        case 'bezierCurve':
          return this.validateBezierCurve(value as number[]);
        
        case 'vector2D':
          return this.validateVector2D(value as number[]);
        
        case 'vector3D':
          return this.validateVector3D(value as number[]);
        
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate all parameters for a component schema
   */
  validateParameters(schema: ComponentSchema, parameters: Record<string, ParameterValue>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required parameters
    Object.entries(schema.parameters).forEach(([paramName, config]) => {
      if (!(paramName in parameters)) {
        errors.push(`Missing required parameter: ${paramName}`);
        return;
      }

      const value = parameters[paramName];
      
      // Validate parameter value
      if (!this.validateParameter(config, value)) {
        errors.push(`Invalid value for parameter '${paramName}': ${value}`);
      }

      // Custom validation function
      if (config.validation) {
        const result = config.validation(value);
        if (result !== true) {
          if (typeof result === 'string') {
            errors.push(`${paramName}: ${result}`);
          } else {
            errors.push(`Invalid value for parameter '${paramName}'`);
          }
        }
      }

      // Check dependencies
      if (config.dependencies) {
        config.dependencies.forEach(dep => {
          if (!(dep in parameters)) {
            warnings.push(`Parameter '${paramName}' depends on '${dep}' which is not set`);
          }
        });
      }

      // Check conditional visibility
      if (config.conditional) {
        const dependentValue = parameters[config.conditional.dependsOn];
        if (dependentValue !== undefined && !config.conditional.condition(dependentValue)) {
          warnings.push(`Parameter '${paramName}' should not be visible based on current conditions`);
        }
      }
    });

    // Check for unknown parameters
    Object.keys(parameters).forEach(paramName => {
      if (!(paramName in schema.parameters)) {
        warnings.push(`Unknown parameter: ${paramName}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Type-specific validation methods
  private validateNumeric(config: ParameterConfig, value: number): boolean {
    if (typeof value !== 'number' || isNaN(value)) {
      return false;
    }

    if (config.min !== undefined && value < config.min) {
      return false;
    }

    if (config.max !== undefined && value > config.max) {
      return false;
    }

    if (config.step !== undefined) {
      const steps = Math.round((value - (config.min || 0)) / config.step);
      const expectedValue = (config.min || 0) + steps * config.step;
      if (Math.abs(value - expectedValue) > 0.0001) {
        return false;
      }
    }

    return true;
  }

  private validateColor(value: string): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    // Hex color validation
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(value)) {
      return true;
    }

    // RGB/RGBA validation
    const rgbRegex = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/;
    const rgbMatch = value.match(rgbRegex);
    if (rgbMatch) {
      const [, r, g, b, a] = rgbMatch;
      const red = parseInt(r);
      const green = parseInt(g);
      const blue = parseInt(b);
      const alpha = a ? parseFloat(a) : 1;

      return red >= 0 && red <= 255 &&
             green >= 0 && green <= 255 &&
             blue >= 0 && blue <= 255 &&
             alpha >= 0 && alpha <= 1;
    }

    // HSL/HSLA validation
    const hslRegex = /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/;
    const hslMatch = value.match(hslRegex);
    if (hslMatch) {
      const [, h, s, l, a] = hslMatch;
      const hue = parseInt(h);
      const saturation = parseInt(s);
      const lightness = parseInt(l);
      const alpha = a ? parseFloat(a) : 1;

      return hue >= 0 && hue <= 360 &&
             saturation >= 0 && saturation <= 100 &&
             lightness >= 0 && lightness <= 100 &&
             alpha >= 0 && alpha <= 1;
    }

    return false;
  }

  private validateDropdown(config: ParameterConfig, value: string): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    return config.options ? config.options.includes(value) : true;
  }

  private validateRange(config: ParameterConfig, value: number[]): boolean {
    if (!Array.isArray(value) || value.length !== 2) {
      return false;
    }

    const [min, max] = value;
    if (typeof min !== 'number' || typeof max !== 'number') {
      return false;
    }

    if (min > max) {
      return false;
    }

    if (config.min !== undefined && min < config.min) {
      return false;
    }

    if (config.max !== undefined && max > config.max) {
      return false;
    }

    return true;
  }

  private validateMultiSelect(config: ParameterConfig, value: string[]): boolean {
    if (!Array.isArray(value)) {
      return false;
    }

    if (!config.options) {
      return true;
    }

    return value.every(item => config.options!.includes(item));
  }

  private validateColorGradient(value: any): boolean {
    if (typeof value !== 'object' || !value) {
      return false;
    }

    const { type, colors, stops } = value;

    if (!['linear', 'radial', 'conic'].includes(type)) {
      return false;
    }

    if (!Array.isArray(colors) || colors.length < 2) {
      return false;
    }

    // Validate each color
    if (!colors.every(color => this.validateColor(color))) {
      return false;
    }

    // Validate stops if provided
    if (stops) {
      if (!Array.isArray(stops) || stops.length !== colors.length) {
        return false;
      }
      if (!stops.every(stop => typeof stop === 'number' && stop >= 0 && stop <= 100)) {
        return false;
      }
    }

    return true;
  }

  private validateBezierCurve(value: number[]): boolean {
    return Array.isArray(value) && 
           value.length === 4 && 
           value.every(v => typeof v === 'number' && v >= 0 && v <= 1);
  }

  private validateVector2D(value: number[]): boolean {
    return Array.isArray(value) && 
           value.length === 2 && 
           value.every(v => typeof v === 'number');
  }

  private validateVector3D(value: number[]): boolean {
    return Array.isArray(value) && 
           value.length === 3 && 
           value.every(v => typeof v === 'number');
  }
}
