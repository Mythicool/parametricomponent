/**
 * React Hook for Parametric System
 * Provides access to the parametric system through React context
 */

import React, { useContext, createContext, ReactNode } from 'react';
import { ParametricSystem } from '../core/ParametricSystem';

export interface ParametricSystemContextValue {
  system: ParametricSystem | null;
}

export const ParametricSystemContext = createContext<ParametricSystemContextValue>({
  system: null
});

/**
 * Hook to access the parametric system
 */
export function useParametricSystem(): ParametricSystemContextValue {
  const context = useContext(ParametricSystemContext);

  if (!context) {
    throw new Error('useParametricSystem must be used within a ParametricSystemProvider');
  }

  return context;
}

/**
 * Provider component for the parametric system
 */
export interface ParametricSystemProviderProps {
  system: ParametricSystem;
  children: ReactNode;
}

export const ParametricSystemProvider: React.FC<ParametricSystemProviderProps> = ({
  system,
  children
}) => {
  return React.createElement(
    ParametricSystemContext.Provider,
    { value: { system } },
    children
  );
};
