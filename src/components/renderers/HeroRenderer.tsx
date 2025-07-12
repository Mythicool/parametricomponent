/**
 * Hero Component Renderer
 * Renders hero sections with parametric controls
 */

import React from 'react';
import { ComponentRenderProps } from '../../types/parametric';

export const HeroRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const {
    backgroundColor = '#1a1a2e',
    textColor = '#ffffff',
    fontSize = 48,
    padding = 60,
    borderRadius = 12,
    animationDuration = 1000,
    opacity = 1,
    spacing = 24,
    layout = 'center',
    gradient = true,
    shadowIntensity = 0.3
  } = parameters;

  const heroStyle: React.CSSProperties = {
    background: gradient 
      ? `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd)`
      : backgroundColor,
    color: textColor,
    fontSize: `${fontSize}px`,
    padding: `${padding}px`,
    borderRadius: `${borderRadius}px`,
    opacity: opacity,
    textAlign: layout as 'left' | 'center' | 'right',
    boxShadow: `0 ${shadowIntensity * 20}px ${shadowIntensity * 40}px rgba(0,0,0,${shadowIntensity})`,
    transition: `all ${animationDuration}ms ease`,
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: layout === 'left' ? 'flex-start' : layout === 'right' ? 'flex-end' : 'center',
    ...style
  };

  const contentStyle: React.CSSProperties = {
    marginBottom: `${spacing}px`
  };

  return (
    <div 
      className={`parametric-hero ${className || ''}`}
      style={heroStyle}
    >
      <div style={contentStyle}>
        {children || (
          <>
            <h1 className="font-bold mb-4">Parametric Design System</h1>
            <p className="text-lg opacity-90">
              Real-time control over every visual parameter
            </p>
          </>
        )}
      </div>
    </div>
  );
};
