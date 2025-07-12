/**
 * Waves Background Renderer
 * Creates animated wave patterns with layered effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const WavesRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    waveCount = 4,
    waveColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
    waveHeight = 60,
    waveSpeed = 1,
    opacity = 0.6,
    direction = 'horizontal',
    animate = true,
    height = '100vh'
  } = parameters;

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + waveSpeed) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [animate, waveSpeed]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    ...style
  };

  const getWavePath = (index: number) => {
    const offset = (animationOffset + index * 90) % 360;
    const amplitude = waveHeight;
    const frequency = 0.02;
    
    let path = '';
    
    if (direction === 'horizontal') {
      path = `M 0,${300 + index * 20}`;
      for (let x = 0; x <= 400; x += 10) {
        const y = 300 + index * 20 + Math.sin((x * frequency) + (offset * Math.PI / 180)) * amplitude;
        path += ` L ${x},${y}`;
      }
      path += ` L 400,400 L 0,400 Z`;
    } else {
      path = `M ${200 + index * 20},0`;
      for (let y = 0; y <= 400; y += 10) {
        const x = 200 + index * 20 + Math.sin((y * frequency) + (offset * Math.PI / 180)) * amplitude;
        path += ` L ${x},${y}`;
      }
      path += ` L 400,400 L 400,0 Z`;
    }
    
    return path;
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
      className={`parametric-waves ${className || ''}`}
      style={containerStyle}
    >
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        viewBox="0 0 400 400"
        preserveAspectRatio="none"
      >
        {Array.from({ length: waveCount }, (_, index) => (
          <path
            key={index}
            d={getWavePath(index)}
            fill={`${waveColors[index % waveColors.length]}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
            style={{
              filter: `blur(${index}px)`,
              mixBlendMode: 'screen'
            }}
          />
        ))}
      </svg>
      
      <div style={contentStyle}>
        {children || (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '2.5rem',
              fontWeight: '600',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
            }}>
              Wave Background
            </h2>
            <p style={{ 
              margin: 0, 
              opacity: 0.8,
              fontSize: '1.1rem'
            }}>
              Layered wave animations with blend modes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
