/**
 * Simplified Hero Component Renderer
 * Inspired by react-bits patterns with cleaner, more maintainable code
 */

import React, { useMemo } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface HeroLayout {
  display: string;
  alignItems: string;
  justifyContent: string;
  textAlign: 'left' | 'center' | 'right';
}

export const SimplifiedHeroRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  // Extract parameters with defaults
  const {
    backgroundColor = '#1a1a2e',
    textColor = '#ffffff',
    fontSize = 48,
    padding = 60,
    borderRadius = 12,
    animationDuration = 800,
    opacity = 1,
    spacing = 24,
    layout = 'center',
    gradient = true,
    gradientDirection = '135deg',
    shadowIntensity = 0.3,
    minHeight = 400,
    maxWidth = '100%',
    backgroundImage = '',
    overlay = true,
    overlayOpacity = 0.4
  } = parameters;

  // Generate layout styles
  const getLayoutStyles = useMemo((): HeroLayout => {
    const layouts: Record<string, HeroLayout> = {
      left: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left'
      },
      center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      },
      right: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'right'
      }
    };

    return layouts[layout] || layouts.center;
  }, [layout]);

  // Generate background styles
  const getBackgroundStyles = useMemo((): React.CSSProperties => {
    let background = backgroundColor;

    if (gradient) {
      const gradientColor = `${backgroundColor}dd`;
      background = `linear-gradient(${gradientDirection}, ${backgroundColor}, ${gradientColor})`;
    }

    if (backgroundImage) {
      background = `${gradient ? background + ',' : ''} url(${backgroundImage})`;
    }

    return {
      background,
      backgroundSize: backgroundImage ? 'cover' : 'auto',
      backgroundPosition: backgroundImage ? 'center' : 'initial',
      backgroundRepeat: backgroundImage ? 'no-repeat' : 'initial'
    };
  }, [backgroundColor, gradient, gradientDirection, backgroundImage]);

  // Generate shadow styles
  const getShadowStyles = useMemo((): string => {
    if (shadowIntensity === 0) return 'none';
    
    const shadowSize = shadowIntensity * 20;
    const shadowBlur = shadowIntensity * 40;
    
    return `0 ${shadowSize}px ${shadowBlur}px rgba(0,0,0,${shadowIntensity})`;
  }, [shadowIntensity]);

  // Main container styles
  const heroStyle: React.CSSProperties = {
    // Background
    ...getBackgroundStyles(),
    
    // Layout
    ...getLayoutStyles,
    minHeight: `${minHeight}px`,
    maxWidth: maxWidth,
    width: '100%',
    position: 'relative',
    
    // Spacing
    padding: `${padding}px`,
    
    // Appearance
    color: textColor,
    borderRadius: `${borderRadius}px`,
    opacity: opacity,
    boxShadow: getShadowStyles(),
    
    // Animation
    transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    
    // Typography
    fontSize: `${fontSize}px`,
    fontFamily: 'inherit',
    lineHeight: 1.2,
    
    // Overflow
    overflow: 'hidden',
    
    // Custom styles override
    ...style
  };

  // Content wrapper styles
  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '100%',
    width: '100%'
  };

  // Overlay styles (for background images)
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
    zIndex: 1,
    pointerEvents: 'none'
  };

  // Default content styles
  const defaultContentStyles: React.CSSProperties = {
    marginBottom: `${spacing}px`
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'inherit',
    fontWeight: 'bold',
    margin: `0 0 ${spacing}px 0`,
    lineHeight: 1.1
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: `${fontSize * 0.4}px`,
    opacity: 0.9,
    fontWeight: 'normal',
    margin: 0,
    lineHeight: 1.4
  };

  return (
    <div 
      className={`parametric-hero-simplified ${className || ''}`}
      style={heroStyle}
    >
      {/* Background overlay for images */}
      {backgroundImage && overlay && (
        <div style={overlayStyle} />
      )}
      
      {/* Content wrapper */}
      <div style={contentStyle}>
        <div style={defaultContentStyles}>
          {children || (
            <>
              <h1 style={titleStyle}>
                Parametric Design System
              </h1>
              <p style={subtitleStyle}>
                Real-time control over every visual parameter
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
