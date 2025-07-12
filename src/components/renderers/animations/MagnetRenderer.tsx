/**
 * Magnet Animation Renderer
 * Creates magnetic attraction effects for elements
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const MagnetRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    magnetStrength = 0.3,
    maxDistance = 100,
    returnSpeed = 0.15,
    scaleEffect = 1.05,
    rotationEffect = 5,
    animationDuration = 300,
    enableRotation = true,
    enableScale = true
  } = parameters;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && elementRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const elementRect = elementRef.current.getBoundingClientRect();
        
        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;
        
        const elementCenterX = elementRect.left - containerRect.left + elementRect.width / 2;
        const elementCenterY = elementRect.top - containerRect.top + elementRect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(mouseX - elementCenterX, 2) + 
          Math.pow(mouseY - elementCenterY, 2)
        );
        
        setMousePosition({ x: mouseX, y: mouseY });
        
        if (distance < maxDistance) {
          setIsHovered(true);
          
          const force = (maxDistance - distance) / maxDistance;
          const deltaX = (mouseX - elementCenterX) * magnetStrength * force;
          const deltaY = (mouseY - elementCenterY) * magnetStrength * force;
          
          setElementPosition({ x: deltaX, y: deltaY });
        } else {
          setIsHovered(false);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [magnetStrength, maxDistance]);

  useEffect(() => {
    if (!isHovered) {
      // Return to original position
      const returnAnimation = () => {
        setElementPosition(prev => ({
          x: prev.x * (1 - returnSpeed),
          y: prev.y * (1 - returnSpeed)
        }));
        
        if (Math.abs(elementPosition.x) > 0.1 || Math.abs(elementPosition.y) > 0.1) {
          requestAnimationFrame(returnAnimation);
        } else {
          setElementPosition({ x: 0, y: 0 });
        }
      };
      
      requestAnimationFrame(returnAnimation);
    }
  }, [isHovered, returnSpeed, elementPosition.x, elementPosition.y]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    overflow: 'hidden',
    ...style
  };

  const elementStyle: React.CSSProperties = {
    transform: `
      translate(${elementPosition.x}px, ${elementPosition.y}px)
      ${enableScale ? `scale(${isHovered ? scaleEffect : 1})` : ''}
      ${enableRotation ? `rotate(${elementPosition.x * rotationEffect}deg)` : ''}
    `,
    transition: isHovered 
      ? `transform ${animationDuration}ms ease-out`
      : `transform ${animationDuration * 2}ms ease-out`,
    cursor: 'pointer',
    userSelect: 'none'
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-magnet ${className || ''}`}
      style={containerStyle}
    >
      <div 
        ref={elementRef}
        style={elementStyle}
      >
        {children || (
          <div style={{
            padding: '2rem 3rem',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Magnetic Element</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Move your mouse near me
            </p>
          </div>
        )}
      </div>
      
      {/* Mouse indicator */}
      <div style={{
        position: 'absolute',
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        width: '4px',
        height: '4px',
        backgroundColor: '#ff6b6b',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.2s ease'
      }} />
    </div>
  );
};
