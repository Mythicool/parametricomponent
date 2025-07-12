/**
 * Aurora Background Renderer
 * Creates aurora borealis-like background effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const AuroraRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    colors = ['#00ff88', '#0088ff', '#8800ff', '#ff0088'],
    animationSpeed = 2,
    intensity = 0.6,
    blur = 40,
    height = '100vh',
    animate = true
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

  const auroraStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      radial-gradient(
        ellipse 80% 50% at 50% -20%,
        ${colors[0]}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse 60% 40% at 80% 10%,
        ${colors[1]}${Math.round(intensity * 0.8 * 255).toString(16).padStart(2, '0')} 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse 70% 30% at 20% 30%,
        ${colors[2]}${Math.round(intensity * 0.6 * 255).toString(16).padStart(2, '0')} 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse 50% 60% at 60% 70%,
        ${colors[3]}${Math.round(intensity * 0.4 * 255).toString(16).padStart(2, '0')} 0%,
        transparent 50%
      )
    `,
    filter: `blur(${blur}px)`,
    transform: `rotate(${animationOffset * 0.1}deg) scale(1.1)`,
    transition: animate ? 'none' : 'transform 0.3s ease',
    opacity: intensity
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
      className={`parametric-aurora ${className || ''}`}
      style={containerStyle}
    >
      <div style={auroraStyle} />
      <div style={contentStyle}>
        {children || (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem' }}>
              Aurora Background
            </h2>
            <p style={{ margin: 0, opacity: 0.8 }}>
              Dynamic aurora borealis effect
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
