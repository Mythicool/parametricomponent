/**
 * Simplified Card Component Renderer
 * Inspired by react-bits patterns with cleaner, more maintainable code
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface CardState {
  isHovered: boolean;
  isFocused: boolean;
}

interface CardLayout {
  flexDirection: 'row' | 'column';
  alignItems: string;
  gap: string;
}

export const SimplifiedCardRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [state, setState] = useState<CardState>({
    isHovered: false,
    isFocused: false
  });

  // Extract parameters with defaults
  const {
    backgroundColor = '#ffffff',
    borderColor = '#e5e7eb',
    borderWidth = 1,
    borderRadius = 12,
    padding = 24,
    shadowIntensity = 0.1,
    hoverLift = 4,
    spacing = 16,
    layout = 'vertical',
    interactive = true,
    animationDuration = 200,
    maxWidth = '100%',
    minHeight = 'auto',
    gradient = false,
    gradientDirection = '135deg',
    hoverShadowIntensity = 0.2
  } = parameters;

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    if (interactive) setState(prev => ({ ...prev, isHovered: true }));
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: false }));
  }, []);

  const handleFocus = useCallback(() => {
    if (interactive) setState(prev => ({ ...prev, isFocused: true }));
  }, [interactive]);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
  }, []);

  // Generate layout styles
  const getLayoutStyles = useMemo((): CardLayout => {
    const layouts: Record<string, CardLayout> = {
      vertical: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: `${spacing}px`
      },
      horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: `${spacing}px`
      }
    };

    return layouts[layout] || layouts.vertical;
  }, [layout, spacing]);

  // Generate background styles
  const getBackgroundStyles = useMemo((): React.CSSProperties => {
    if (!gradient) {
      return { backgroundColor };
    }

    const gradientColor = `${backgroundColor}dd`;
    return {
      background: `linear-gradient(${gradientDirection}, ${backgroundColor}, ${gradientColor})`
    };
  }, [backgroundColor, gradient, gradientDirection]);

  // Generate shadow styles
  const getShadowStyles = useMemo((): string => {
    const intensity = state.isHovered ? hoverShadowIntensity : shadowIntensity;
    if (intensity === 0) return 'none';
    
    const shadowSize = intensity * 50;
    const shadowBlur = intensity * 100;
    
    return `0 ${shadowSize}px ${shadowBlur}px rgba(0,0,0,${intensity})`;
  }, [shadowIntensity, hoverShadowIntensity, state.isHovered]);

  // Generate transform styles
  const getTransform = useMemo((): string => {
    if (!interactive) return 'none';
    
    const lift = state.isHovered ? hoverLift : 0;
    return `translateY(-${lift}px)`;
  }, [state.isHovered, hoverLift, interactive]);

  // Main card styles
  const cardStyle: React.CSSProperties = {
    // Background
    ...getBackgroundStyles(),
    
    // Border
    borderColor: borderColor,
    borderWidth: `${borderWidth}px`,
    borderStyle: 'solid',
    borderRadius: `${borderRadius}px`,
    
    // Layout
    display: 'flex',
    ...getLayoutStyles,
    maxWidth: maxWidth,
    minHeight: minHeight === 'auto' ? 'auto' : `${minHeight}px`,
    width: '100%',
    
    // Spacing
    padding: `${padding}px`,
    
    // Appearance
    transform: getTransform(),

    // Animation
    transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,

    // Interaction
    cursor: interactive ? 'pointer' : 'default',
    outline: 'none',

    // Focus ring and shadow
    boxShadow: state.isFocused && interactive
      ? `${getShadowStyles()}, 0 0 0 3px ${borderColor}40`
      : getShadowStyles(),
    
    // Overflow
    overflow: 'hidden',
    position: 'relative',
    
    // Custom styles override
    ...style
  };

  // Default content styles
  const iconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    backgroundColor: '#dbeafe',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  const iconInnerStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    backgroundColor: '#3b82f6',
    borderRadius: '4px'
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
    fontSize: '18px',
    lineHeight: 1.3
  };

  const descriptionStyle: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0,
    lineHeight: 1.5,
    opacity: 0.8
  };

  const contentWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${Math.floor(spacing / 2)}px`,
    flex: 1
  };

  return (
    <div
      className={`parametric-card-simplified ${className || ''}`}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={interactive ? 0 : -1}
      role={interactive ? 'button' : 'article'}
    >
      {children || (
        <>
          {/* Default icon */}
          <div style={iconStyle}>
            <div style={iconInnerStyle} />
          </div>
          
          {/* Default content */}
          <div style={contentWrapperStyle}>
            <h3 style={titleStyle}>
              Card Title
            </h3>
            <p style={descriptionStyle}>
              This is a simplified card component with clean animations and better maintainability.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
