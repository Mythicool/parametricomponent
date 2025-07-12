/**
 * Centralized State Management for Parametric System
 * Implements pub/sub pattern with real-time updates and state persistence
 */

import { EventEmitter } from './EventEmitter';
import { ParameterValue, ComponentInstance, ParameterUpdateEvent } from '../types/parametric';

export interface StateSnapshot {
  timestamp: Date;
  components: Record<string, ComponentInstance>;
  globalParameters: Record<string, ParameterValue>;
}

export interface StateManagerConfig {
  enableHistory: boolean;
  maxHistorySize: number;
  enablePersistence: boolean;
  persistenceKey: string;
  debounceMs: number;
}

export class StateManager extends EventEmitter {
  private components: Map<string, ComponentInstance> = new Map();
  private globalParameters: Map<string, ParameterValue> = new Map();
  private history: StateSnapshot[] = [];
  private config: StateManagerConfig;
  private updateQueue: Map<string, ParameterUpdateEvent> = new Map();
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<StateManagerConfig> = {}) {
    super();
    
    this.config = {
      enableHistory: true,
      maxHistorySize: 50,
      enablePersistence: true,
      persistenceKey: 'parametric_state',
      debounceMs: 16, // ~60fps
      ...config
    };

    if (this.config.enablePersistence) {
      this.loadPersistedState();
    }
  }

  /**
   * Register a component instance
   */
  registerComponent(component: ComponentInstance): void {
    this.components.set(component.id, component);
    this.emit('componentRegistered', component);
    
    if (this.config.enablePersistence) {
      this.persistState();
    }
  }

  /**
   * Unregister a component instance
   */
  unregisterComponent(componentId: string): void {
    const component = this.components.get(componentId);
    if (component) {
      this.components.delete(componentId);
      this.emit('componentUnregistered', component);
      
      if (this.config.enablePersistence) {
        this.persistState();
      }
    }
  }

  /**
   * Update a parameter with debouncing and batching
   */
  updateParameter(
    componentId: string, 
    parameter: string, 
    value: ParameterValue,
    immediate: boolean = false
  ): void {
    const component = this.components.get(componentId);
    if (!component) {
      throw new Error(`Component ${componentId} not found`);
    }

    const oldValue = component.parameters[parameter];
    const updateEvent: ParameterUpdateEvent = {
      componentId,
      componentType: component.type,
      parameter,
      oldValue,
      newValue: value,
      timestamp: new Date()
    };

    // Update component state
    component.parameters[parameter] = value;
    component.metadata.updatedAt = new Date();

    if (immediate) {
      this.processUpdate(updateEvent);
    } else {
      // Queue update for batching
      this.updateQueue.set(`${componentId}.${parameter}`, updateEvent);
      this.scheduleUpdate();
    }
  }

  /**
   * Set global parameter that affects all components
   */
  setGlobalParameter(parameter: string, value: ParameterValue): void {
    const oldValue = this.globalParameters.get(parameter);
    this.globalParameters.set(parameter, value);
    
    this.emit('globalParameterUpdated', {
      parameter,
      oldValue,
      newValue: value,
      timestamp: new Date()
    });

    if (this.config.enablePersistence) {
      this.persistState();
    }
  }

  /**
   * Get current state snapshot
   */
  getSnapshot(): StateSnapshot {
    return {
      timestamp: new Date(),
      components: Object.fromEntries(this.components),
      globalParameters: Object.fromEntries(this.globalParameters)
    };
  }

  /**
   * Restore state from snapshot
   */
  restoreSnapshot(snapshot: StateSnapshot): void {
    this.components.clear();
    this.globalParameters.clear();

    // Restore components
    Object.values(snapshot.components).forEach(component => {
      this.components.set(component.id, component);
    });

    // Restore global parameters
    Object.entries(snapshot.globalParameters).forEach(([key, value]) => {
      this.globalParameters.set(key, value);
    });

    this.emit('stateRestored', snapshot);
    
    if (this.config.enablePersistence) {
      this.persistState();
    }
  }

  /**
   * Undo last change
   */
  undo(): boolean {
    if (this.history.length < 2) {
      return false;
    }

    // Remove current state and restore previous
    this.history.pop();
    const previousState = this.history[this.history.length - 1];
    this.restoreSnapshot(previousState);
    
    this.emit('undoPerformed', previousState);
    return true;
  }

  /**
   * Get component by ID
   */
  getComponent(componentId: string): ComponentInstance | undefined {
    return this.components.get(componentId);
  }

  /**
   * Get all components
   */
  getAllComponents(): ComponentInstance[] {
    return Array.from(this.components.values());
  }

  /**
   * Get global parameter
   */
  getGlobalParameter(parameter: string): ParameterValue | undefined {
    return this.globalParameters.get(parameter);
  }

  /**
   * Clear all state
   */
  clear(): void {
    this.components.clear();
    this.globalParameters.clear();
    this.history = [];
    this.updateQueue.clear();
    
    this.emit('stateCleared');
    
    if (this.config.enablePersistence) {
      this.clearPersistedState();
    }
  }

  // Private methods

  private scheduleUpdate(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.flushUpdates();
    }, this.config.debounceMs);
  }

  private flushUpdates(): void {
    const updates = Array.from(this.updateQueue.values());
    this.updateQueue.clear();

    if (updates.length === 0) return;

    // Save state snapshot before updates
    if (this.config.enableHistory) {
      this.saveSnapshot();
    }

    // Process all queued updates
    updates.forEach(update => {
      this.processUpdate(update);
    });

    // Emit batch update event
    this.emit('batchUpdateCompleted', updates);

    if (this.config.enablePersistence) {
      this.persistState();
    }
  }

  private processUpdate(update: ParameterUpdateEvent): void {
    this.emit('parameterUpdated', update);
  }

  private saveSnapshot(): void {
    const snapshot = this.getSnapshot();
    this.history.push(snapshot);

    // Limit history size
    if (this.history.length > this.config.maxHistorySize) {
      this.history.shift();
    }
  }

  private persistState(): void {
    try {
      const state = this.getSnapshot();
      localStorage.setItem(this.config.persistenceKey, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to persist state:', error);
    }
  }

  private loadPersistedState(): void {
    try {
      const persistedState = localStorage.getItem(this.config.persistenceKey);
      if (persistedState) {
        const state = JSON.parse(persistedState);
        this.restoreSnapshot(state);
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error);
    }
  }

  private clearPersistedState(): void {
    try {
      localStorage.removeItem(this.config.persistenceKey);
    } catch (error) {
      console.warn('Failed to clear persisted state:', error);
    }
  }
}
