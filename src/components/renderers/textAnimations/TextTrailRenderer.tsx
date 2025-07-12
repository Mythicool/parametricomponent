/**
 * Text Trail Animation Renderer
 * Creates text with trailing effect following mouse movement
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

export const TextTrailRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    text = 'Trail Text',
    fontSize = 32,
    fontWeight = 600,
    color = '#ffffff',
    trailLength = 10,
    trailDecay = 0.8,
    followMouse = true,
    trailSpacing = 20,
    animationSpeed = 50
  } = parameters;

  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [followMouse]);

  useEffect(() => {
    if (!followMouse) return;

    const interval = setInterval(() => {
      setTrailPoints(prev => {
        const now = Date.now();
        
        // Add new trail point
        const newPoint: TrailPoint = {
          x: mousePosition.x,
          y: mousePosition.y,
          opacity: 1,
          timestamp: now
        };

        // Update existing points and remove old ones
        const updatedPoints = prev
          .map(point => ({
            ...point,
            opacity: point.opacity * trailDecay
          }))
          .filter(point => point.opacity > 0.01 && (now - point.timestamp) < 2000);

        // Limit trail length
        const allPoints = [newPoint, ...updatedPoints].slice(0, trailLength);
        
        return allPoints;
      });
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [mousePosition, trailLength, trailDecay, animationSpeed, followMouse]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '400px',
    overflow: 'hidden',
    cursor: followMouse ? 'none' : 'default',
    ...style
  };

  const getTextStyle = (point: TrailPoint, index: number): React.CSSProperties => {
    return {
      position: 'absolute',
      left: `${point.x}px`,
      top: `${point.y}px`,
      fontSize: `${fontSize * (1 - index * 0.05)}px`,
      fontWeight: fontWeight,
      color: color,
      opacity: point.opacity,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: trailLength - index
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-text-trail ${className || ''}`}
      style={containerStyle}
    >
      {trailPoints.map((point, index) => (
        <div
          key={`${point.timestamp}-${index}`}
          style={getTextStyle(point, index)}
        >
          {children || text}
        </div>
      ))}
      
      {!followMouse && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          color: color,
          opacity: 0.5
        }}>
          Move mouse to see trail effect
        </div>
      )}
    </div>
  );
};
