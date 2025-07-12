/**
 * Silk Background Renderer
 * Creates smooth, flowing silk-like background animations
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const SilkRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
    animationSpeed = 1,
    waveCount = 3,
    waveHeight = 100,
    opacity = 0.6,
    blur = 40,
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

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    ...style
  };

  const getSilkWave = (index: number) => {
    const offset = (animationOffset + index * 120) % 360;
    const waveOffset = Math.sin(offset * Math.PI / 180) * 50;
    const scaleOffset = 0.8 + Math.cos(offset * Math.PI / 180) * 0.2;
    
    return {
      transform: `
        translateY(${waveOffset}px) 
        scale(${scaleOffset}) 
        rotate(${offset * 0.1}deg)
      `,
      background: `
        radial-gradient(
          ellipse 120% ${waveHeight}% at 50% ${50 + waveOffset * 0.1}%,
          ${colors[index % colors.length]}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%,
          transparent 70%
        )
      `,
      filter: `blur(${blur}px)`,
      transition: animate ? 'none' : 'transform 0.3s ease'
    };
  };

  const waveStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
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
      className={`parametric-silk ${className || ''}`}
      style={containerStyle}
    >
      {Array.from({ length: waveCount }, (_, index) => (
        <div
          key={index}
          style={{
            ...waveStyle,
            ...getSilkWave(index)
          }}
        />
      ))}
      
      <div style={contentStyle}>
        {children || (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '2.5rem',
              fontWeight: '300',
              letterSpacing: '2px'
            }}>
              Silk Background
            </h2>
            <p style={{ 
              margin: 0, 
              opacity: 0.8,
              fontSize: '1.1rem',
              fontWeight: '300'
            }}>
              Smooth flowing silk-like animations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
