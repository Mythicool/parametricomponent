/**
 * Grid Background Renderer
 * Creates animated grid patterns with various effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const GridRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    gridSize = 50,
    lineWidth = 1,
    lineColor = '#3b82f6',
    opacity = 0.3,
    animationType = 'pulse',
    animationSpeed = 2,
    glowEffect = true,
    perspective = false,
    animate = true,
    height = '100vh'
  } = parameters;

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + animationSpeed) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [animate, animationSpeed]);

  const getAnimatedOpacity = () => {
    switch (animationType) {
      case 'pulse':
        return opacity * (0.5 + Math.sin(animationOffset * Math.PI / 180) * 0.5);
      case 'wave':
        return opacity;
      case 'static':
        return opacity;
      default:
        return opacity;
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    ...style
  };

  const gridStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `
      linear-gradient(${lineColor}${Math.round(getAnimatedOpacity() * 255).toString(16).padStart(2, '0')} ${lineWidth}px, transparent ${lineWidth}px),
      linear-gradient(90deg, ${lineColor}${Math.round(getAnimatedOpacity() * 255).toString(16).padStart(2, '0')} ${lineWidth}px, transparent ${lineWidth}px)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px`,
    filter: glowEffect ? `drop-shadow(0 0 ${lineWidth * 2}px ${lineColor})` : 'none',
    transform: perspective ? `perspective(1000px) rotateX(60deg) translateY(-50%)` : 'none',
    transformOrigin: 'center bottom'
  };

  const waveOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: animationType === 'wave' ? `
      radial-gradient(
        circle at ${50 + Math.sin(animationOffset * Math.PI / 180) * 30}% ${50 + Math.cos(animationOffset * Math.PI / 180) * 30}%,
        ${lineColor}${Math.round(opacity * 0.5 * 255).toString(16).padStart(2, '0')} 0%,
        transparent 50%
      )
    ` : 'none',
    pointerEvents: 'none'
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  };

  return (
    <div 
      className={`parametric-grid ${className || ''}`}
      style={containerStyle}
    >
      <div style={gridStyle} />
      {animationType === 'wave' && <div style={waveOverlayStyle} />}
      
      <div style={contentStyle}>
        {children || (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '2.5rem',
              fontWeight: '600',
              textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}>
              Grid Background
            </h2>
            <p style={{ 
              margin: 0, 
              opacity: 0.8,
              fontSize: '1.1rem'
            }}>
              Animated grid patterns with customizable effects
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
