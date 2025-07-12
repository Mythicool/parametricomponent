# Parametric Design System - API Reference

## Core Classes

### ParametricSystem

The main orchestrator class that manages components, parameters, and state.

#### Constructor

```typescript
constructor(storage?: StorageProvider)
```

- `storage` - Optional storage provider for persistence (defaults to LocalStorageProvider)

#### Methods

##### Component Management

```typescript
registerComponent(schema: ComponentSchema): void
```
Registers a new component schema with the system.

```typescript
createComponent(type: string, preset?: string): ComponentInstance
```
Creates a new component instance of the specified type.

```typescript
getComponent(componentId: string): ComponentInstance | undefined
```
Retrieves a component instance by ID.

```typescript
listComponents(): ComponentInstance[]
```
Returns all registered component instances.

```typescript
removeComponent(componentId: string): void
```
Removes a component instance from the system.

##### Parameter Management

```typescript
updateParameter(
  componentId: string, 
  parameter: string, 
  value: ParameterValue
): void
```
Updates a parameter value for a specific component.

```typescript
validateParameters(
  componentType: string, 
  parameters: Record<string, any>
): ValidationResult
```
Validates a set of parameters against a component schema.

##### Schema Management

```typescript
getSchema(componentType: string): ComponentSchema | undefined
```
Retrieves a component schema by type.

```typescript
listSchemas(): ComponentSchema[]
```
Returns all registered component schemas.

##### Preset Management

```typescript
async savePreset(preset: PresetConfig): Promise<void>
```
Saves a preset configuration to storage.

```typescript
async loadPreset(presetId: string): Promise<PresetConfig>
```
Loads a preset configuration from storage.

```typescript
listPresets(componentType?: string): PresetConfig[]
```
Lists available presets, optionally filtered by component type.

##### Configuration Management

```typescript
exportConfiguration(componentIds?: string[]): string
```
Exports system configuration as JSON string.

```typescript
async importConfiguration(configuration: string): Promise<ComponentInstance[]>
```
Imports configuration and returns created components.

#### Events

The ParametricSystem extends EventEmitter and emits the following events:

- `componentRegistered` - When a component schema is registered
- `componentCreated` - When a component instance is created
- `componentRemoved` - When a component instance is removed
- `parameterUpdated` - When a parameter value is updated
- `presetSaved` - When a preset is saved
- `presetLoaded` - When a preset is loaded

### ParameterValidator

Validates parameter values against their configurations.

#### Methods

```typescript
validateParameter(config: ParameterConfig, value: any): boolean | string
```
Validates a single parameter value. Returns `true` if valid, or error message if invalid.

```typescript
validateParameters(
  schema: ComponentSchema, 
  parameters: Record<string, any>
): ValidationResult
```
Validates multiple parameters against a schema.

### StateManager

Manages component state with real-time updates and persistence.

#### Constructor

```typescript
constructor(config?: Partial<StateManagerConfig>)
```

#### Methods

```typescript
registerComponent(component: ComponentInstance): void
```
Registers a component with the state manager.

```typescript
updateParameter(
  componentId: string, 
  parameter: string, 
  value: ParameterValue,
  immediate?: boolean
): void
```
Updates a parameter with optional debouncing.

```typescript
getSnapshot(): StateSnapshot
```
Returns current state snapshot.

```typescript
restoreSnapshot(snapshot: StateSnapshot): void
```
Restores state from snapshot.

```typescript
undo(): boolean
```
Undoes the last change. Returns `true` if successful.

## React Components

### ParametricComponent

Main React component for rendering parametric components.

#### Props

```typescript
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

#### Usage

```tsx
<ParametricComponent 
  type="blur-text"
  parameters={{
    text: "Hello World",
    fontSize: 48,
    animationDuration: 1200
  }}
  onParameterChange={(param, value) => console.log(param, value)}
/>
```

### ParametricControlPanel

Provides real-time parameter controls for components.

#### Props

```typescript
interface ParametricControlPanelProps {
  componentType: string;
  onParameterChange?: (parameter: string, value: ParameterValue) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

#### Usage

```tsx
<ParametricControlPanel
  componentType="split-text"
  onParameterChange={(param, value) => {
    // Handle parameter changes
  }}
/>
```

### ParametricSystemProvider

React context provider for the parametric system.

#### Props

```typescript
interface ParametricSystemProviderProps {
  system: ParametricSystem;
  children: ReactNode;
}
```

#### Usage

```tsx
const system = createParametricSystem();

<ParametricSystemProvider system={system}>
  <App />
</ParametricSystemProvider>
```

## Hooks

### useParametricSystem

Hook to access the parametric system from React components.

```typescript
function useParametricSystem(): ParametricSystemContextValue
```

#### Usage

```tsx
function MyComponent() {
  const { system } = useParametricSystem();
  
  // Use system methods
  const component = system.createComponent('hero');
  
  return <div>...</div>;
}
```

### useParametricComponent

Hook for managing parametric component state.

```typescript
function useParametricComponent(
  type: string,
  initialParameters?: Record<string, any>
): {
  component: ComponentInstance | null;
  updateParameter: (parameter: string, value: any) => void;
  resetParameters: () => void;
}
```

## Utility Functions

### createParametricSystem

Factory function for creating a parametric system instance.

```typescript
function createParametricSystem(storage?: StorageProvider): ParametricSystem
```

### createParametricComponent

Factory function for creating components programmatically.

```typescript
function createParametricComponent(type: string, preset?: string): ComponentInstance
```

### validateComponentParameters

Utility function to validate component parameters.

```typescript
function validateComponentParameters(
  componentType: string, 
  parameters: Record<string, any>
): ValidationResult
```

## Type Definitions

### ComponentSchema

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
  dependencies?: string[];
  examples?: ExampleConfig[];
  metadata?: ComponentMetadata;
  validation?: ComponentValidation;
}
```

### ParameterConfig

```typescript
interface ParameterConfig<T = ParameterValue> {
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
  conditional?: ConditionalConfig;
  responsive?: ResponsiveParameterConfig<T>;
  constraints?: ParameterConstraints;
  metadata?: ParameterMetadata;
}
```

### ComponentInstance

```typescript
interface ComponentInstance {
  id: string;
  type: string;
  parameters: Record<string, ParameterValue>;
  preset?: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
  };
}
```

### PresetConfig

```typescript
interface PresetConfig {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  componentType: string;
  parameters: Record<string, ParameterValue>;
  metadata: PresetMetadata;
}
```

## Error Handling

### ParametricError

Base error class for parametric system errors.

```typescript
class ParametricError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ParametricError';
  }
}
```

### ValidationError

Error thrown when parameter validation fails.

```typescript
class ValidationError extends ParametricError {
  constructor(
    message: string, 
    public parameter: string,
    public value: any
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}
```

### ConfigurationError

Error thrown when configuration is invalid.

```typescript
class ConfigurationError extends ParametricError {
  constructor(message: string) {
    super(message, 'CONFIGURATION_ERROR');
    this.name = 'ConfigurationError';
  }
}
```
