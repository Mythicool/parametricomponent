/**
 * Glare Hover Animation Renderer
 * Creates glare effects on hover interactions
 */

import React, { useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const GlareHoverRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    glareIntensity = 0.3,
    glareSize = 200,
    glareColor = '#ffffff',
    animationDuration = 300,
    followMouse = true,
    borderRadius = 8
  } = parameters;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!followMouse || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: `${borderRadius}px`,
    cursor: 'pointer',
    ...style
  };

  const glareStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: followMouse 
      ? `radial-gradient(
          ${glareSize}px circle at ${mousePosition.x}% ${mousePosition.y}%,
          ${glareColor}${Math.round(glareIntensity * 255).toString(16).padStart(2, '0')} 0%,
          transparent 70%
        )`
      : `linear-gradient(
          45deg,
          transparent 30%,
          ${glareColor}${Math.round(glareIntensity * 255).toString(16).padStart(2, '0')} 50%,
          transparent 70%
        )`,
    opacity: isHovered ? 1 : 0,
    transition: `opacity ${animationDuration}ms ease`,
    pointerEvents: 'none',
    mixBlendMode: 'overlay'
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-glare-hover ${className || ''}`}
      style={containerStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children || (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Glare Hover Effect</h3>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Hover to see the glare animation
          </p>
        </div>
      )}
      <div style={glareStyle} />
    </div>
  );
};
