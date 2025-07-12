/**
 * Button Component Renderer
 * Renders buttons with parametric controls
 */

import React, { useState } from 'react';
import { ComponentRenderProps } from '../../types/parametric';

export const ButtonRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    backgroundColor = '#4f46e5',
    textColor = '#ffffff',
    fontSize = 16,
    padding = 16,
    borderRadius = 8,
    hoverScale = 1.05,
    animationDuration = 300,
    width = 180,
    shadow = true,
    variant = 'filled'
  } = parameters;

  const buttonStyle: React.CSSProperties = {
    backgroundColor: variant === 'filled' ? backgroundColor : 'transparent',
    color: variant === 'filled' ? textColor : backgroundColor,
    fontSize: `${fontSize}px`,
    padding: `${padding}px`,
    borderRadius: `${borderRadius}px`,
    width: `${width}px`,
    border: variant === 'outlined' ? `2px solid ${backgroundColor}` : 'none',
    boxShadow: shadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
    transition: `all ${animationDuration}ms ease`,
    transform: isHovered ? `scale(${hoverScale})` : 'scale(1)',
    cursor: 'pointer',
    fontWeight: 'medium',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    outline: 'none',
    ...style
  };

  // Handle variant-specific styles
  if (variant === 'ghost') {
    buttonStyle.backgroundColor = 'transparent';
    buttonStyle.color = backgroundColor;
    buttonStyle.border = 'none';
    buttonStyle.boxShadow = 'none';
  }

  return (
    <button
      className={`parametric-button ${className || ''}`}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {children || 'Primary Action'}
    </button>
  );
};
