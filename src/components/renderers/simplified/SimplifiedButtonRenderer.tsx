/**
 * Simplified Button Component Renderer
 * Inspired by react-bits patterns with cleaner, more maintainable code
 */

import React, { useState, useCallback } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface ButtonVariant {
  filled: string;
  outlined: string;
  ghost: string;
}

interface ButtonState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
}

export const SimplifiedButtonRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [state, setState] = useState<ButtonState>({
    isHovered: false,
    isPressed: false,
    isFocused: false
  });

  // Extract parameters with defaults
  const {
    backgroundColor = '#4f46e5',
    textColor = '#ffffff',
    fontSize = 16,
    padding = 16,
    borderRadius = 8,
    hoverScale = 1.05,
    animationDuration = 200,
    width = 'auto',
    shadow = true,
    variant = 'filled',
    disabled = false,
    ripple = true
  } = parameters;

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    if (!disabled) setState(prev => ({ ...prev, isHovered: true }));
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: false, isPressed: false }));
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!disabled) setState(prev => ({ ...prev, isPressed: true }));
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
  }, []);

  const handleFocus = useCallback(() => {
    if (!disabled) setState(prev => ({ ...prev, isFocused: true }));
  }, [disabled]);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
  }, []);

  // Generate variant styles
  const getVariantStyles = (): React.CSSProperties => {
    const variants: Record<string, ButtonVariant> = {
      filled: {
        filled: backgroundColor,
        outlined: 'transparent',
        ghost: 'transparent'
      },
      outlined: {
        filled: backgroundColor,
        outlined: 'transparent',
        ghost: 'transparent'
      },
      ghost: {
        filled: backgroundColor,
        outlined: 'transparent',
        ghost: 'transparent'
      }
    };

    const currentVariant = variants[variant] || variants.filled;

    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: state.isHovered ? backgroundColor : 'transparent',
          color: state.isHovered ? textColor : backgroundColor,
          border: `2px solid ${backgroundColor}`,
          boxShadow: shadow && !state.isHovered ? 'none' : undefined
        };
      case 'ghost':
        return {
          backgroundColor: state.isHovered ? `${backgroundColor}10` : 'transparent',
          color: backgroundColor,
          border: 'none',
          boxShadow: 'none'
        };
      default: // filled
        return {
          backgroundColor: backgroundColor,
          color: textColor,
          border: 'none',
          boxShadow: shadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
        };
    }
  };

  // Calculate transform based on state
  const getTransform = (): string => {
    let scale = 1;
    if (state.isPressed) scale = 0.98;
    else if (state.isHovered) scale = hoverScale;

    return `scale(${scale})`;
  };

  // Generate button styles
  const buttonStyle: React.CSSProperties = {
    // Base styles
    fontSize: `${fontSize}px`,
    padding: `${padding}px ${padding * 1.5}px`,
    borderRadius: `${borderRadius}px`,
    width: width === 'auto' ? 'auto' : `${width}px`,
    fontWeight: '500',
    fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    
    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    
    // Transitions
    transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    transform: getTransform(),
    
    // Variant-specific styles
    ...getVariantStyles(),
    
    // Disabled state
    opacity: disabled ? 0.6 : 1,
    
    // Focus ring
    boxShadow: state.isFocused && !disabled 
      ? `${getVariantStyles().boxShadow || ''}, 0 0 0 3px ${backgroundColor}40`
      : getVariantStyles().boxShadow,
    
    // Custom styles override
    ...style
  };

  return (
    <button
      className={`parametric-button-simplified ${className || ''}`}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      type="button"
    >
      {/* Ripple effect overlay */}
      {ripple && state.isPressed && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            animation: `ripple ${animationDuration}ms ease-out`,
            pointerEvents: 'none'
          }}
        />
      )}
      
      {/* Button content */}
      <span style={{ position: 'relative', zIndex: 1 }}>
        {children || 'Button'}
      </span>
      
      {/* CSS for ripple animation */}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};
