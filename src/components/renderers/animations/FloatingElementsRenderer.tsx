/**
 * Floating Elements Animation Renderer
 * Creates floating elements with physics-based movement
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export const FloatingElementsRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    elementCount = 20,
    elementColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
    minSize = 4,
    maxSize = 12,
    speed = 1,
    gravity = 0.1,
    bounce = 0.8,
    opacity = 0.7,
    rotationSpeed = 2,
    animate = true,
    height = '400px'
  } = parameters;

  useEffect(() => {
    // Initialize floating elements
    const newElements: FloatingElement[] = [];
    const containerWidth = containerRef.current?.clientWidth || 400;
    const containerHeight = containerRef.current?.clientHeight || 400;

    for (let i = 0; i < elementCount; i++) {
      newElements.push({
        id: i,
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        size: minSize + Math.random() * (maxSize - minSize),
        color: elementColors[Math.floor(Math.random() * elementColors.length)],
        opacity: opacity * (0.5 + Math.random() * 0.5),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * rotationSpeed
      });
    }

    setElements(newElements);
  }, [elementCount, elementColors, minSize, maxSize, speed, opacity, rotationSpeed]);

  useEffect(() => {
    if (!animate) return;

    const updateElements = () => {
      setElements(prevElements => {
        const containerWidth = containerRef.current?.clientWidth || 400;
        const containerHeight = containerRef.current?.clientHeight || 400;

        return prevElements.map(element => {
          let newX = element.x + element.vx;
          let newY = element.y + element.vy;
          let newVx = element.vx;
          let newVy = element.vy + gravity;

          // Bounce off walls
          if (newX <= element.size / 2 || newX >= containerWidth - element.size / 2) {
            newVx = -newVx * bounce;
            newX = Math.max(element.size / 2, Math.min(containerWidth - element.size / 2, newX));
          }

          if (newY <= element.size / 2 || newY >= containerHeight - element.size / 2) {
            newVy = -newVy * bounce;
            newY = Math.max(element.size / 2, Math.min(containerHeight - element.size / 2, newY));
          }

          return {
            ...element,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: element.rotation + element.rotationSpeed
          };
        });
      });

      animationRef.current = requestAnimationFrame(updateElements);
    };

    animationRef.current = requestAnimationFrame(updateElements);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, gravity, bounce]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    ...style
  };

  const getElementStyle = (element: FloatingElement): React.CSSProperties => {
    return {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.size}px`,
      height: `${element.size}px`,
      backgroundColor: element.color,
      borderRadius: '50%',
      opacity: element.opacity,
      transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
      pointerEvents: 'none',
      boxShadow: `0 0 ${element.size}px ${element.color}40`
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-floating-elements ${className || ''}`}
      style={containerStyle}
    >
      {elements.map(element => (
        <div
          key={element.id}
          style={getElementStyle(element)}
        />
      ))}
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Floating Elements</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Physics-based floating animation
            </p>
          </>
        )}
      </div>
    </div>
  );
};
