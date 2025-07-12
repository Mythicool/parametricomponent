/**
 * Fluid Glass Component Renderer
 * Creates glassmorphism effects with fluid animations
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const FluidGlassRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    blur = 20,
    opacity = 0.2,
    borderOpacity = 0.3,
    borderRadius = 16,
    padding = 32,
    backgroundColor = '#ffffff',
    borderColor = '#ffffff',
    shadowIntensity = 0.3,
    fluidAnimation = true,
    animationSpeed = 2,
    gradientIntensity = 0.1
  } = parameters;

  useEffect(() => {
    if (!fluidAnimation) return;

    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + animationSpeed) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [fluidAnimation, animationSpeed]);

  const getBackgroundGradient = () => {
    if (!fluidAnimation) {
      return backgroundColor;
    }

    const offset1 = animationOffset;
    const offset2 = (animationOffset + 120) % 360;
    const offset3 = (animationOffset + 240) % 360;

    return `
      radial-gradient(
        circle at ${50 + Math.sin(offset1 * Math.PI / 180) * 20}% ${50 + Math.cos(offset1 * Math.PI / 180) * 20}%,
        ${backgroundColor}${Math.round((opacity + gradientIntensity) * 255).toString(16).padStart(2, '0')} 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at ${50 + Math.sin(offset2 * Math.PI / 180) * 15}% ${50 + Math.cos(offset2 * Math.PI / 180) * 15}%,
        ${borderColor}${Math.round(gradientIntensity * 255).toString(16).padStart(2, '0')} 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at ${50 + Math.sin(offset3 * Math.PI / 180) * 10}% ${50 + Math.cos(offset3 * Math.PI / 180) * 10}%,
        ${backgroundColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%,
        transparent 50%
      )
    `;
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    background: getBackgroundGradient(),
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${borderColor}${Math.round(borderOpacity * 255).toString(16).padStart(2, '0')}`,
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, ${shadowIntensity}),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    overflow: 'hidden',
    ...style
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.1) 100%
      )
    `,
    pointerEvents: 'none',
    borderRadius: `${borderRadius}px`
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    color: '#1f2937'
  };

  return (
    <div 
      className={`parametric-fluid-glass ${className || ''}`}
      style={containerStyle}
    >
      <div style={overlayStyle} />
      <div style={contentStyle}>
        {children || (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ 
              margin: '0 0 1rem 0',
              fontSize: '1.5rem',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Fluid Glass
            </h3>
            <p style={{ 
              margin: '0 0 1.5rem 0',
              opacity: 0.8,
              lineHeight: '1.6'
            }}>
              Glassmorphism effect with fluid background animations and backdrop blur.
            </p>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                opacity: 0.6
              }} />
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#8b5cf6',
                opacity: 0.6
              }} />
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#06b6d4',
                opacity: 0.6
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
