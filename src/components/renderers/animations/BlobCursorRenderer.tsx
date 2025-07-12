/**
 * Blob Cursor Animation Renderer
 * Creates an organic blob that follows the mouse cursor
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const BlobCursorRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [blobPosition, setBlobPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    blobSize = 40,
    followSpeed = 0.1,
    morphSpeed = 0.05,
    color = '#3b82f6',
    opacity = 0.8,
    blur = 10,
    hoverScale = 1.5,
    morphIntensity = 0.3,
    height = '400px'
  } = parameters;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      setBlobPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * followSpeed,
        y: prev.y + (mousePosition.y - prev.y) * followSpeed
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, followSpeed]);

  const getBlobPath = (): string => {
    const time = Date.now() * morphSpeed;
    const size = blobSize * (isHovering ? hoverScale : 1);
    const x = blobPosition.x;
    const y = blobPosition.y;

    // Create organic blob shape using sine waves
    const points = 8;
    let path = '';

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const radius = size + Math.sin(time + angle * 3) * size * morphIntensity;
      
      const pointX = x + Math.cos(angle) * radius;
      const pointY = y + Math.sin(angle) * radius;

      if (i === 0) {
        path += `M ${pointX} ${pointY}`;
      } else {
        // Use quadratic curves for smooth organic shape
        const prevAngle = ((i - 1) / points) * Math.PI * 2;
        const prevRadius = size + Math.sin(time + prevAngle * 3) * size * morphIntensity;
        const prevX = x + Math.cos(prevAngle) * prevRadius;
        const prevY = y + Math.sin(prevAngle) * prevRadius;
        
        const cpX = (prevX + pointX) / 2 + Math.sin(time + i) * size * 0.1;
        const cpY = (prevY + pointY) / 2 + Math.cos(time + i) * size * 0.1;
        
        path += ` Q ${cpX} ${cpY} ${pointX} ${pointY}`;
      }
    }

    path += ' Z';
    return path;
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    cursor: 'none',
    ...style
  };

  const svgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-blob-cursor ${className || ''}`}
      style={containerStyle}
    >
      <svg style={svgStyle}>
        <defs>
          <filter id="blob-blur">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>
        
        <path
          d={getBlobPath()}
          fill={color}
          opacity={opacity}
          filter="url(#blob-blur)"
        />
      </svg>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Blob Cursor</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Move your mouse to see the organic blob follow
            </p>
          </>
        )}
      </div>
    </div>
  );
};
