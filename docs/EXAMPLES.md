# Parametric Design System - Examples

## Basic Usage Examples

### Simple Text Animation

```tsx
import React from 'react';
import { ParametricComponent, ParametricSystemProvider, createParametricSystem } from 'parametric-design-system';

function App() {
  const system = createParametricSystem();

  return (
    <ParametricSystemProvider system={system}>
      <div>
        <ParametricComponent 
          type="split-text"
          parameters={{
            text: "Hello, World!",
            delay: 100,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)"
          }}
        />
      </div>
    </ParametricSystemProvider>
  );
}
```

### Interactive Button

```tsx
<ParametricComponent 
  type="button"
  parameters={{
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    hoverScale: 1.1,
    borderRadius: 8,
    padding: 16
  }}
  onParameterChange={(param, value) => {
    console.log(`${param} changed to:`, value);
  }}
>
  Click Me
</ParametricComponent>
```

### Hero Section with Gradient

```tsx
<ParametricComponent 
  type="hero"
  preset="modernDark"
  parameters={{
    fontSize: 56,
    gradient: true,
    animationDuration: 1200
  }}
>
  <h1>Welcome to Our Platform</h1>
  <p>Experience the future of design</p>
</ParametricComponent>
```

## Advanced Examples

### Real-time Parameter Control

```tsx
import React, { useState } from 'react';
import { ParametricComponent, ParametricControlPanel } from 'parametric-design-system';

function InteractiveDemo() {
  const [parameters, setParameters] = useState({
    text: "Dynamic Text",
    fontSize: 32,
    color: "#3b82f6"
  });

  const handleParameterChange = (param: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div style={{ flex: 1 }}>
        <ParametricComponent 
          type="blur-text"
          parameters={parameters}
          onParameterChange={handleParameterChange}
        />
      </div>
      
      <div style={{ width: '300px' }}>
        <ParametricControlPanel
          componentType="blur-text"
          onParameterChange={handleParameterChange}
        />
      </div>
    </div>
  );
}
```

### Custom Component with Validation

```tsx
import React from 'react';
import { ComponentRenderProps, ComponentSchema } from 'parametric-design-system';

// Define schema with validation
const customSchema: ComponentSchema = {
  id: 'validated-input',
  name: 'Validated Input',
  category: 'interactive',
  description: 'Input with custom validation',
  version: '1.0.0',
  groups: {
    'Content': ['placeholder', 'value'],
    'Validation': ['required', 'minLength', 'pattern']
  },
  parameters: {
    placeholder: {
      type: 'text',
      default: 'Enter text...',
      description: 'Placeholder text',
      group: 'Content'
    },
    value: {
      type: 'text',
      default: '',
      description: 'Input value',
      group: 'Content'
    },
    required: {
      type: 'toggle',
      default: false,
      description: 'Required field',
      group: 'Validation'
    },
    minLength: {
      type: 'slider',
      min: 0,
      max: 50,
      default: 0,
      description: 'Minimum length',
      group: 'Validation',
      conditional: {
        dependsOn: 'required',
        condition: (value) => value === true
      }
    },
    pattern: {
      type: 'text',
      default: '',
      description: 'Regex pattern',
      group: 'Validation',
      validation: (value: string) => {
        if (!value) return true;
        try {
          new RegExp(value);
          return true;
        } catch {
          return 'Invalid regex pattern';
        }
      }
    }
  },
  presets: [],
  responsive: {
    breakpoints: { mobile: 768, tablet: 1024, desktop: 1440 },
    parameters: {}
  }
};

// Component renderer
const ValidatedInputRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className
}) => {
  const {
    placeholder = 'Enter text...',
    value = '',
    required = false,
    minLength = 0,
    pattern = ''
  } = parameters;

  const [inputValue, setInputValue] = React.useState(value);
  const [error, setError] = React.useState('');

  const validate = (val: string) => {
    if (required && !val) {
      setError('This field is required');
      return false;
    }
    
    if (required && val.length < minLength) {
      setError(`Minimum length is ${minLength} characters`);
      return false;
    }
    
    if (pattern && !new RegExp(pattern).test(val)) {
      setError('Value does not match required pattern');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    validate(newValue);
  };

  return (
    <div className={`validated-input ${className || ''}`} style={style}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        style={{
          padding: '8px 12px',
          border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '14px',
          width: '100%'
        }}
      />
      {error && (
        <div style={{
          color: '#ef4444',
          fontSize: '12px',
          marginTop: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};
```

### Programmatic Component Creation

```tsx
import React, { useEffect, useState } from 'react';
import { useParametricSystem, ComponentInstance } from 'parametric-design-system';

function ProgrammaticExample() {
  const { system } = useParametricSystem();
  const [components, setComponents] = useState<ComponentInstance[]>([]);

  useEffect(() => {
    // Create multiple components programmatically
    const heroComponent = system.createComponent('hero', 'modernDark');
    const buttonComponent = system.createComponent('button');
    const textComponent = system.createComponent('split-text');

    // Customize parameters
    system.updateParameter(heroComponent.id, 'fontSize', 64);
    system.updateParameter(buttonComponent.id, 'backgroundColor', '#10b981');
    system.updateParameter(textComponent.id, 'text', 'Programmatically Created');

    setComponents([heroComponent, buttonComponent, textComponent]);

    // Listen for parameter changes
    const handleParameterUpdate = (event: any) => {
      console.log('Parameter updated:', event);
    };

    system.on('parameterUpdated', handleParameterUpdate);

    return () => {
      system.off('parameterUpdated', handleParameterUpdate);
    };
  }, [system]);

  return (
    <div>
      {components.map(component => (
        <ParametricComponent
          key={component.id}
          type={component.type}
          parameters={component.parameters}
        />
      ))}
    </div>
  );
}
```

### Preset Management

```tsx
import React, { useState } from 'react';
import { 
  saveComponentPreset, 
  loadComponentPreset, 
  PresetConfig 
} from 'parametric-design-system';

function PresetManager() {
  const [presets, setPresets] = useState<PresetConfig[]>([]);
  const [currentParameters, setCurrentParameters] = useState({
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    borderRadius: 8
  });

  const savePreset = async () => {
    const preset: PresetConfig = {
      id: `preset_${Date.now()}`,
      name: 'My Custom Preset',
      description: 'Custom button styling',
      category: 'interactive',
      componentType: 'button',
      parameters: currentParameters,
      metadata: {
        author: 'User',
        version: '1.0.0',
        tags: ['custom', 'button'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    await saveComponentPreset(preset);
    setPresets(prev => [...prev, preset]);
  };

  const loadPreset = async (presetId: string) => {
    const preset = await loadComponentPreset(presetId);
    setCurrentParameters(preset.parameters);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <ParametricComponent 
          type="button"
          parameters={currentParameters}
        >
          Preview Button
        </ParametricComponent>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={savePreset}>
          Save Current as Preset
        </button>
      </div>

      <div>
        <h3>Saved Presets</h3>
        {presets.map(preset => (
          <button
            key={preset.id}
            onClick={() => loadPreset(preset.id)}
            style={{ margin: '0.25rem', padding: '0.5rem' }}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Configuration Export/Import

```tsx
import React from 'react';
import { 
  exportSystemConfiguration, 
  importSystemConfiguration 
} from 'parametric-design-system';

function ConfigurationManager() {
  const [exportedConfig, setExportedConfig] = useState('');

  const handleExport = () => {
    const config = exportSystemConfiguration();
    setExportedConfig(config);
    
    // Download as file
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parametric-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    try {
      const components = await importSystemConfiguration(text);
      console.log('Imported components:', components);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleExport}>
          Export Configuration
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
        />
      </div>

      {exportedConfig && (
        <div>
          <h3>Exported Configuration</h3>
          <textarea
            value={exportedConfig}
            readOnly
            style={{
              width: '100%',
              height: '200px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
        </div>
      )}
    </div>
  );
}
```

### Animation Sequences

```tsx
import React, { useState } from 'react';
import { ParametricComponent } from 'parametric-design-system';

function AnimationSequence() {
  const [currentStep, setCurrentStep] = useState(0);

  const animationSteps = [
    {
      type: 'split-text',
      parameters: {
        text: 'Step 1: Split Text',
        delay: 50,
        duration: 0.6
      }
    },
    {
      type: 'blur-text',
      parameters: {
        text: 'Step 2: Blur Effect',
        blurAmount: 10,
        animationDuration: 1000
      }
    },
    {
      type: 'circular-text',
      parameters: {
        text: 'Step 3: Circular Motion • ',
        radius: 80,
        rotationSpeed: 45
      }
    }
  ];

  const nextStep = () => {
    setCurrentStep(prev => (prev + 1) % animationSteps.length);
  };

  const currentAnimation = animationSteps[currentStep];

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ParametricComponent
          key={currentStep} // Force re-mount for animation restart
          type={currentAnimation.type}
          parameters={currentAnimation.parameters}
        />
      </div>
      
      <button 
        onClick={nextStep}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Next Animation ({currentStep + 1}/{animationSteps.length})
      </button>
    </div>
  );
}
```

## Integration Examples

### With State Management (Redux)

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { ParametricComponent } from 'parametric-design-system';

function ReduxIntegration() {
  const parameters = useSelector(state => state.parametric.parameters);
  const dispatch = useDispatch();

  const handleParameterChange = (param: string, value: any) => {
    dispatch({
      type: 'UPDATE_PARAMETER',
      payload: { parameter: param, value }
    });
  };

  return (
    <ParametricComponent
      type="hero"
      parameters={parameters}
      onParameterChange={handleParameterChange}
    />
  );
}
```

### With Form Libraries (React Hook Form)

```tsx
import { useForm, Controller } from 'react-hook-form';
import { ParametricControlPanel } from 'parametric-design-system';

function FormIntegration() {
  const { control, watch } = useForm({
    defaultValues: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontSize: 16
    }
  });

  const watchedValues = watch();

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div>
        <ParametricComponent
          type="button"
          parameters={watchedValues}
        >
          Form Button
        </ParametricComponent>
      </div>
      
      <Controller
        control={control}
        name="backgroundColor"
        render={({ field }) => (
          <input
            type="color"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
```
