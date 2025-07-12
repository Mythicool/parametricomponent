/**
 * Beams Background Renderer
 * Creates animated light beam effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const BeamsRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    beamColor = '#3b82f6',
    beamCount = 5,
    beamWidth = 2,
    animationSpeed = 1,
    opacity = 0.6,
    angle = 45,
    spacing = 100,
    animate = true,
    height = '100vh'
  } = parameters;

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + animationSpeed) % spacing);
    }, 50);

    return () => clearInterval(interval);
  }, [animate, animationSpeed, spacing]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    ...style
  };

  const beamsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '200%',
    transform: `rotate(${angle}deg) translateX(${animationOffset}px)`,
    transformOrigin: 'center',
    transition: animate ? 'none' : 'transform 0.3s ease'
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

  const renderBeams = () => {
    const beams = [];
    for (let i = 0; i < beamCount; i++) {
      const beamStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${(i * spacing) - spacing}px`,
        top: '-50%',
        width: `${beamWidth}px`,
        height: '200%',
        background: `linear-gradient(
          to bottom,
          transparent 0%,
          ${beamColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 20%,
          ${beamColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 80%,
          transparent 100%
        )`,
        boxShadow: `0 0 ${beamWidth * 2}px ${beamColor}${Math.round(opacity * 0.5 * 255).toString(16).padStart(2, '0')}`
      };
      
      beams.push(<div key={i} style={beamStyle} />);
    }
    return beams;
  };

  return (
    <div 
      className={`parametric-beams ${className || ''}`}
      style={containerStyle}
    >
      <div style={beamsContainerStyle}>
        {renderBeams()}
      </div>
      <div style={contentStyle}>
        {children || (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem' }}>
              Light Beams
            </h2>
            <p style={{ margin: 0, opacity: 0.8 }}>
              Animated light beam background
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
