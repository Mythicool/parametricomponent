/**
 * Pixel Trail Animation Renderer
 * Creates trailing pixel effects that follow mouse movement
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface Pixel {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export const PixelTrailRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    pixelCount = 20,
    pixelSize = 4,
    pixelColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
    trailLength = 15,
    fadeSpeed = 0.05,
    spawnRate = 3,
    randomness = 2,
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

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    let spawnCounter = 0;

    const animate = () => {
      // Spawn new pixels
      spawnCounter++;
      if (spawnCounter >= spawnRate) {
        spawnCounter = 0;
        
        for (let i = 0; i < Math.ceil(spawnRate / 2); i++) {
          const newPixel: Pixel = {
            id: Date.now() + Math.random(),
            x: mousePosition.x + (Math.random() - 0.5) * randomness,
            y: mousePosition.y + (Math.random() - 0.5) * randomness,
            opacity: 1,
            size: pixelSize + Math.random() * pixelSize * 0.5,
            life: trailLength,
            maxLife: trailLength,
            color: pixelColors[Math.floor(Math.random() * pixelColors.length)]
          };

          setPixels(prev => [...prev.slice(-pixelCount), newPixel]);
        }
      }

      // Update existing pixels
      setPixels(prevPixels => 
        prevPixels
          .map(pixel => ({
            ...pixel,
            life: pixel.life - 1,
            opacity: pixel.life / pixel.maxLife
          }))
          .filter(pixel => pixel.life > 0)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, pixelCount, pixelSize, pixelColors, trailLength, spawnRate, randomness]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    cursor: 'none',
    ...style
  };

  const getPixelStyle = (pixel: Pixel): React.CSSProperties => {
    return {
      position: 'absolute',
      left: `${pixel.x}px`,
      top: `${pixel.y}px`,
      width: `${pixel.size}px`,
      height: `${pixel.size}px`,
      backgroundColor: pixel.color,
      opacity: pixel.opacity,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      borderRadius: '1px',
      boxShadow: `0 0 ${pixel.size * 2}px ${pixel.color}`
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-pixel-trail ${className || ''}`}
      style={containerStyle}
    >
      {pixels.map(pixel => (
        <div
          key={pixel.id}
          style={getPixelStyle(pixel)}
        />
      ))}
      
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
            <h3 style={{ margin: '0 0 1rem 0' }}>Pixel Trail</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Move your mouse to create pixel trails
            </p>
          </>
        )}
      </div>
    </div>
  );
};
