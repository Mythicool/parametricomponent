/**
 * Tilted Card Component Renderer
 * Creates 3D tilted card effects with mouse tracking
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const TiltedCardRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
    glare = true,
    glareMaxOpacity = 0.7,
    backgroundColor = '#ffffff',
    borderRadius = 12,
    padding = 24,
    shadow = true,
    shadowIntensity = 0.3
  } = parameters;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

      setTilt({ x: -rotateX, y: rotateY });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [maxTilt]);

  const containerStyle: React.CSSProperties = {
    perspective: `${perspective}px`,
    ...style
  };

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: backgroundColor,
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
    boxShadow: shadow 
      ? `0 ${shadowIntensity * 50}px ${shadowIntensity * 100}px rgba(0, 0, 0, ${shadowIntensity})`
      : 'none',
    transform: `
      rotateX(${tilt.x}deg) 
      rotateY(${tilt.y}deg) 
      scale(${isHovered ? scale : 1})
    `,
    transition: `transform ${speed}ms ease-out`,
    transformStyle: 'preserve-3d',
    cursor: 'pointer',
    overflow: 'hidden'
  };

  const glareStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(
        ${Math.atan2(tilt.y, tilt.x) * (180 / Math.PI) + 90}deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, ${glareMaxOpacity * (Math.abs(tilt.x) + Math.abs(tilt.y)) / (maxTilt * 2)}) 50%,
        rgba(255, 255, 255, 0) 100%
      )
    `,
    borderRadius: `${borderRadius}px`,
    pointerEvents: 'none',
    opacity: glare && isHovered ? 1 : 0,
    transition: `opacity ${speed}ms ease-out`
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    transform: 'translateZ(50px)'
  };

  return (
    <div 
      className={`parametric-tilted-card ${className || ''}`}
      style={containerStyle}
    >
      <div 
        ref={cardRef}
        style={cardStyle}
      >
        {glare && <div style={glareStyle} />}
        <div style={contentStyle}>
          {children || (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#3b82f6',
                borderRadius: '12px',
                margin: '0 auto 1rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translateZ(25px)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#ffffff',
                  borderRadius: '4px'
                }} />
              </div>
              <h3 style={{ 
                margin: '0 0 0.5rem 0',
                color: '#1f2937',
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                3D Tilted Card
              </h3>
              <p style={{ 
                margin: 0,
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
                Move your mouse over this card to see the 3D tilt effect with glare.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
