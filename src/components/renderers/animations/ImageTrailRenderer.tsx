/**
 * Image Trail Animation Renderer
 * Creates trailing image effects following mouse movement
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface TrailImage {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
  life: number;
  maxLife: number;
}

export const ImageTrailRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [trailImages, setTrailImages] = useState<TrailImage[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjM2I4MmY2Ii8+Cjwvc3ZnPgo=',
    trailLength = 10,
    spawnRate = 3,
    imageSize = 24,
    fadeSpeed = 0.05,
    scaleVariation = 0.3,
    rotationSpeed = 5,
    randomOffset = 10,
    blendMode = 'normal',
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
      // Spawn new trail images
      spawnCounter++;
      if (spawnCounter >= spawnRate) {
        spawnCounter = 0;
        
        const newImage: TrailImage = {
          id: Date.now() + Math.random(),
          x: mousePosition.x + (Math.random() - 0.5) * randomOffset,
          y: mousePosition.y + (Math.random() - 0.5) * randomOffset,
          opacity: 1,
          scale: 1 + (Math.random() - 0.5) * scaleVariation,
          rotation: Math.random() * 360,
          life: 1,
          maxLife: 1
        };

        setTrailImages(prev => [...prev.slice(-trailLength), newImage]);
      }

      // Update existing images
      setTrailImages(prevImages => 
        prevImages
          .map(image => ({
            ...image,
            life: image.life - fadeSpeed,
            opacity: image.life,
            rotation: image.rotation + rotationSpeed,
            scale: image.scale * 0.99
          }))
          .filter(image => image.life > 0)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, trailLength, spawnRate, fadeSpeed, rotationSpeed, randomOffset, scaleVariation]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    cursor: 'none',
    ...style
  };

  const getImageStyle = (image: TrailImage): React.CSSProperties => {
    return {
      position: 'absolute',
      left: `${image.x}px`,
      top: `${image.y}px`,
      width: `${imageSize * image.scale}px`,
      height: `${imageSize * image.scale}px`,
      opacity: image.opacity,
      transform: `translate(-50%, -50%) rotate(${image.rotation}deg)`,
      pointerEvents: 'none',
      mixBlendMode: blendMode as any,
      filter: `blur(${(1 - image.life) * 2}px)`
    };
  };

  const cursorStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${mousePosition.x}px`,
    top: `${mousePosition.y}px`,
    width: `${imageSize}px`,
    height: `${imageSize}px`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    opacity: 0.8,
    filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-image-trail ${className || ''}`}
      style={containerStyle}
    >
      {trailImages.map(image => (
        <img
          key={image.id}
          src={imageUrl}
          alt="Trail"
          style={getImageStyle(image)}
          draggable={false}
        />
      ))}
      
      {/* Current cursor image */}
      <img
        src={imageUrl}
        alt="Cursor"
        style={cursorStyle}
        draggable={false}
      />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: trailImages.length === 0 ? 1 : 0.3,
        transition: 'opacity 0.3s ease'
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Image Trail</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Move your mouse to create image trails
            </p>
          </>
        )}
      </div>
    </div>
  );
};
