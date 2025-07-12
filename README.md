# Parametric Design System

A production-ready TypeScript implementation of a comprehensive parametric control system that enables real-time, code-free customization of all site/app components through an intelligent control interface.

## 🚀 Features

### Universal Parametric Architecture
- **Mandatory Parameterization**: Every component exposes configurable parameters
- **Multiple Control Types**: Sliders, dropdowns, color pickers, toggles, range sliders, and more
- **Real-time Updates**: Instant visual feedback as parameters change
- **Type Safety**: Comprehensive TypeScript definitions for all components and parameters

### Component Invocation System
```tsx
// Declarative syntax
<ParametricComponent type="blur-text" preset="fadeIn" />

// Programmatic creation
const component = createComponent('hero', 'modernDark');
```

### Configuration Management
- **Named Presets**: Assign meaningful names to parameter configurations
- **Persistent Storage**: Save configurations to localStorage or external storage
- **Version Control**: Track parameter changes with undo/redo
- **Export/Import**: Share configurations between projects and users

### Production Requirements
- ✅ Complete TypeScript type definitions
- ✅ Error handling and validation for all inputs
- ✅ Performance optimization for real-time updates
- ✅ Comprehensive documentation and examples
- ✅ No placeholder code or TODO items
- ✅ Clean, maintainable code structure

## 📦 Installation

```bash
npm install parametric-design-system
# or
yarn add parametric-design-system
# or
pnpm add parametric-design-system
```

## 🎯 Quick Start

### Basic Usage

```tsx
import React from 'react';
import { 
  ParametricComponent, 
  ParametricSystemProvider,
  createParametricSystem 
} from 'parametric-design-system';

function App() {
  const system = createParametricSystem();

  return (
    <ParametricSystemProvider system={system}>
      <div>
        {/* Hero section with modern dark preset */}
        <ParametricComponent 
          type="hero" 
          preset="modernDark"
        />
        
        {/* Blur text animation */}
        <ParametricComponent 
          type="blur-text"
          parameters={{
            text: "Welcome to Parametric Design",
            fontSize: 48,
            animationDuration: 1200
          }}
        />
        
        {/* Interactive button */}
        <ParametricComponent 
          type="button"
          parameters={{
            backgroundColor: "#ff6b6b",
            variant: "filled",
            hoverScale: 1.1
          }}
        >
          Get Started
        </ParametricComponent>
      </div>
    </ParametricSystemProvider>
  );
}
```

### Programmatic Usage

```tsx
import { 
  createParametricSystem,
  createParametricComponent,
  validateComponentParameters,
  saveComponentPreset
} from 'parametric-design-system';

// Initialize system
const system = createParametricSystem();

// Create components programmatically
const heroComponent = createParametricComponent('hero', 'modernDark');

// Validate parameters
const validation = validateComponentParameters('button', {
  backgroundColor: '#ff0000',
  fontSize: 16,
  variant: 'filled'
});

if (validation.isValid) {
  console.log('Parameters are valid!');
} else {
  console.error('Validation errors:', validation.errors);
}

// Save custom presets
await saveComponentPreset({
  id: 'my-custom-hero',
  name: 'Custom Hero Style',
  componentType: 'hero',
  parameters: {
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    fontSize: 56,
    gradient: true
  },
  metadata: {
    author: 'Your Name',
    version: '1.0.0',
    tags: ['custom', 'hero'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
});
```

## 🎨 Available Components

### Text Animations
- **blur-text**: Text with blur-in animation effects
- **split-text**: Character-by-character animation with various effects
- **circular-text**: Text arranged in circular patterns with rotation
- **shiny-text**: Moving shine/highlight effects
- **gradient-text**: Animated gradient text effects

### Layout Components
- **hero**: Customizable hero sections with gradients
- **button**: Interactive buttons with hover effects
- **card**: Flexible card components with animations

### Animations (Coming Soon)
- **fade-content**: Smooth fade transitions
- **pixel-transition**: Pixel-based transition effects
- **glare-hover**: Glare effects on hover

### Backgrounds (Coming Soon)
- **aurora**: Aurora borealis effects
- **beams**: Light beam animations
- **particles**: Particle system backgrounds

## 🔧 API Reference

### Core Functions

#### `createParametricSystem(storage?: StorageProvider)`
Creates a new parametric system instance.

#### `createParametricComponent(type: string, preset?: string)`
Creates a component instance programmatically.

#### `validateComponentParameters(componentType: string, parameters: Record<string, any>)`
Validates component parameters against schema.

#### `saveComponentPreset(preset: PresetConfig)`
Saves a preset configuration.

#### `exportSystemConfiguration(componentIds?: string[])`
Exports system configuration as JSON.

### Component Props

#### `ParametricComponent`
```tsx
interface ParametricComponentProps {
  type: string;                    // Component type identifier
  preset?: string;                 // Optional preset name
  parameters?: Record<string, any>; // Custom parameter overrides
  className?: string;              // CSS class name
  style?: React.CSSProperties;     // Inline styles
  children?: React.ReactNode;      // Child content
  onParameterChange?: (parameter: string, value: any) => void;
  onError?: (error: Error) => void;
}
```

## 🏗️ Architecture

### Type System
The system uses comprehensive TypeScript definitions:

```typescript
interface ComponentSchema {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  version: string;
  groups: Record<string, string[]>;
  parameters: Record<string, ParameterConfig>;
  presets: PresetConfig[];
  responsive: ResponsiveConfig;
}

interface ParameterConfig {
  type: ParameterType;
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[] | number[];
  unit?: string;
  description: string;
  group: string;
  validation?: (value: any) => boolean | string;
}
```

### Event System
Real-time parameter updates through a robust event system:

```typescript
system.on('parameterUpdated', (event: ParameterUpdateEvent) => {
  console.log(`Parameter ${event.parameter} changed from ${event.oldValue} to ${event.newValue}`);
});
```

### Storage System
Flexible storage with multiple providers:

```typescript
// Local storage (default)
const system = createParametricSystem();

// Custom storage provider
const customStorage = new CustomStorageProvider();
const system = createParametricSystem(customStorage);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🔨 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## 📚 Examples

See the `/src/examples` directory for comprehensive usage examples:

- `ParametricDemo.tsx` - Complete demo application
- Component-specific examples in renderer directories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [Documentation](https://parametric-design-system.dev)
- [GitHub Repository](https://github.com/parametric-design-system/core)
- [NPM Package](https://www.npmjs.com/package/parametric-design-system)
- [Examples](https://examples.parametric-design-system.dev)

---

Built with ❤️ for developers who want powerful, type-safe parametric control systems.
