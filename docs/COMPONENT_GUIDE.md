# Component Development Guide

## Creating Custom Components

### Component Schema Definition

Every parametric component starts with a schema that defines its parameters, groups, and metadata.

```typescript
import { ComponentSchema } from 'parametric-design-system';

const myComponentSchema: ComponentSchema = {
  id: 'my-component',
  name: 'My Custom Component',
  category: 'layout',
  description: 'A custom component with parametric controls',
  version: '1.0.0',
  groups: {
    'Visual': ['backgroundColor', 'textColor'],
    'Animation': ['duration', 'easing'],
    'Layout': ['padding', 'borderRadius']
  },
  parameters: {
    backgroundColor: {
      type: 'color',
      default: '#ffffff',
      description: 'Background color',
      group: 'Visual'
    },
    textColor: {
      type: 'color',
      default: '#000000',
      description: 'Text color',
      group: 'Visual'
    },
    duration: {
      type: 'slider',
      min: 100,
      max: 3000,
      default: 1000,
      unit: 'ms',
      description: 'Animation duration',
      group: 'Animation'
    },
    easing: {
      type: 'dropdown',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out'],
      default: 'ease-out',
      description: 'Animation easing',
      group: 'Animation'
    },
    padding: {
      type: 'slider',
      min: 0,
      max: 100,
      default: 16,
      unit: 'px',
      description: 'Internal padding',
      group: 'Layout'
    },
    borderRadius: {
      type: 'slider',
      min: 0,
      max: 50,
      default: 8,
      unit: 'px',
      description: 'Corner radius',
      group: 'Layout'
    }
  },
  presets: [],
  responsive: {
    breakpoints: { mobile: 768, tablet: 1024, desktop: 1440 },
    parameters: {}
  }
};
```

### Component Renderer

Create a React component that renders based on the parameters:

```typescript
import React from 'react';
import { ComponentRenderProps } from 'parametric-design-system';

export const MyComponentRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const {
    backgroundColor = '#ffffff',
    textColor = '#000000',
    duration = 1000,
    easing = 'ease-out',
    padding = 16,
    borderRadius = 8
  } = parameters;

  const componentStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding: `${padding}px`,
    borderRadius: `${borderRadius}px`,
    transition: `all ${duration}ms ${easing}`,
    ...style
  };

  return (
    <div 
      className={`my-component ${className || ''}`}
      style={componentStyle}
    >
      {children || (
        <div>
          <h3>My Custom Component</h3>
          <p>This component responds to parametric controls.</p>
        </div>
      )}
    </div>
  );
};
```

### Registration

Register your component with the system:

```typescript
import { createParametricSystem } from 'parametric-design-system';
import { registerRenderer } from 'parametric-design-system';

// Register the renderer
registerRenderer('my-component', MyComponentRenderer);

// Register the schema
const system = createParametricSystem();
system.registerComponent(myComponentSchema);
```

## Parameter Types

### Basic Types

#### Slider
```typescript
{
  type: 'slider',
  min: 0,
  max: 100,
  step: 1,
  default: 50,
  unit: 'px',
  description: 'Numeric value with slider control'
}
```

#### Color
```typescript
{
  type: 'color',
  default: '#ffffff',
  description: 'Color picker control'
}
```

#### Dropdown
```typescript
{
  type: 'dropdown',
  options: ['option1', 'option2', 'option3'],
  default: 'option1',
  description: 'Select from predefined options'
}
```

#### Toggle
```typescript
{
  type: 'toggle',
  default: true,
  description: 'Boolean on/off control'
}
```

#### Text
```typescript
{
  type: 'text',
  default: 'Default text',
  description: 'Text input field'
}
```

### Advanced Types

#### Range
```typescript
{
  type: 'range',
  min: 0,
  max: 100,
  default: [25, 75],
  description: 'Dual-handle range slider'
}
```

#### Vector2D
```typescript
{
  type: 'vector2D',
  default: [0, 0],
  description: '2D vector input (x, y)'
}
```

#### Bezier Curve
```typescript
{
  type: 'bezierCurve',
  default: [0, 0, 1, 1],
  description: 'Cubic bezier curve editor'
}
```

## Parameter Validation

### Built-in Validation

Most parameter types have automatic validation:

- Sliders validate min/max bounds and step increments
- Colors validate format (hex, rgb, hsl)
- Dropdowns validate against available options
- Toggles validate boolean type

### Custom Validation

Add custom validation functions:

```typescript
{
  type: 'text',
  default: '',
  description: 'Username',
  validation: (value: string) => {
    if (typeof value !== 'string') return false;
    if (value.length < 3) return 'Must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores allowed';
    return true;
  }
}
```

### Conditional Parameters

Show/hide parameters based on other parameter values:

```typescript
{
  type: 'slider',
  min: 0,
  max: 100,
  default: 50,
  description: 'Animation speed',
  conditional: {
    dependsOn: 'enableAnimation',
    condition: (value) => value === true,
    showWhen: true
  }
}
```

## Responsive Parameters

Define different parameter values for different screen sizes:

```typescript
{
  type: 'slider',
  min: 12,
  max: 72,
  default: 32,
  unit: 'px',
  description: 'Font size',
  responsive: {
    breakpoints: {
      mobile: 24,
      tablet: 28,
      desktop: 32
    },
    autoScale: true
  }
}
```

## Parameter Groups

Organize parameters into logical groups for better UX:

```typescript
groups: {
  'Typography': ['fontSize', 'fontWeight', 'lineHeight'],
  'Colors': ['backgroundColor', 'textColor', 'borderColor'],
  'Layout': ['padding', 'margin', 'borderRadius'],
  'Animation': ['duration', 'easing', 'delay']
}
```

## Presets

Define preset configurations for common use cases:

```typescript
presets: [
  {
    id: 'modern-card',
    name: 'Modern Card',
    description: 'Clean modern card design',
    category: 'layout',
    componentType: 'my-component',
    parameters: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 24,
      duration: 300
    },
    metadata: {
      author: 'Design Team',
      version: '1.0.0',
      tags: ['modern', 'clean'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
]
```

## Animation Components

### Text Animations

For text-based animations, consider these patterns:

```typescript
// Character-by-character animation
const characters = text.split('');
return (
  <div>
    {characters.map((char, index) => (
      <span
        key={index}
        style={{
          display: 'inline-block',
          animationDelay: `${index * staggerDelay}ms`,
          // ... other styles
        }}
      >
        {char}
      </span>
    ))}
  </div>
);
```

### Interactive Animations

For mouse-responsive animations:

```typescript
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setMousePosition({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  });
};

return (
  <div onMouseMove={handleMouseMove}>
    {/* Use mousePosition for animations */}
  </div>
);
```

## Best Practices

### Performance

1. **Debounce Updates**: Use debouncing for expensive operations
2. **Memoization**: Use React.memo for complex components
3. **Efficient Animations**: Prefer CSS transforms over layout changes

### Accessibility

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Labels**: Add accessibility labels
3. **Keyboard Navigation**: Support keyboard interactions
4. **Reduced Motion**: Respect prefers-reduced-motion

### Type Safety

1. **Parameter Interfaces**: Define TypeScript interfaces for parameters
2. **Validation**: Always validate parameter values
3. **Error Boundaries**: Implement error boundaries for robustness

### Documentation

1. **Parameter Descriptions**: Write clear parameter descriptions
2. **Examples**: Provide usage examples
3. **Metadata**: Include component metadata for discoverability

## Testing Components

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponentRenderer } from './MyComponentRenderer';

test('renders with default parameters', () => {
  render(<MyComponentRenderer parameters={{}} />);
  expect(screen.getByText('My Custom Component')).toBeInTheDocument();
});

test('applies custom parameters', () => {
  const parameters = {
    backgroundColor: '#ff0000',
    textColor: '#ffffff'
  };
  
  const { container } = render(
    <MyComponentRenderer parameters={parameters} />
  );
  
  const element = container.firstChild as HTMLElement;
  expect(element.style.backgroundColor).toBe('rgb(255, 0, 0)');
});
```

### Integration Tests

```typescript
import { ParametricSystem } from 'parametric-design-system';

test('component integrates with system', () => {
  const system = new ParametricSystem();
  system.registerComponent(myComponentSchema);
  
  const component = system.createComponent('my-component');
  expect(component.type).toBe('my-component');
  
  system.updateParameter(component.id, 'backgroundColor', '#ff0000');
  expect(component.parameters.backgroundColor).toBe('#ff0000');
});
```
