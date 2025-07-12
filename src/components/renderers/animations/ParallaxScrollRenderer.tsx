/**
 * Parallax Scroll Animation Renderer
 * Creates parallax scrolling effects with multiple layers
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface ParallaxLayer {
  id: number;
  content: string;
  speed: number;
  offset: number;
  opacity: number;
  blur: number;
}

export const ParallaxScrollRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    layerCount = 3,
    baseSpeed = 0.5,
    speedMultiplier = 0.3,
    enableBlur = true,
    enableOpacity = true,
    backgroundColor = '#0a0a0a',
    height = '600px',
    enableMouseParallax = false,
    mouseIntensity = 0.1
  } = parameters;

  const [layers] = useState<ParallaxLayer[]>(() => {
    const newLayers: ParallaxLayer[] = [];
    for (let i = 0; i < layerCount; i++) {
      newLayers.push({
        id: i,
        content: `Layer ${i + 1}`,
        speed: baseSpeed + (i * speedMultiplier),
        offset: 0,
        opacity: enableOpacity ? 1 - (i * 0.2) : 1,
        blur: enableBlur ? i * 2 : 0
      });
    }
    return newLayers;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, -rect.top / window.innerHeight);
        setScrollY(scrollProgress * 100);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableMouseParallax || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * mouseIntensity;
      const deltaY = (e.clientY - centerY) * mouseIntensity;
      
      setScrollY(prev => prev + deltaY * 0.1);
    };

    window.addEventListener('scroll', handleScroll);
    if (enableMouseParallax) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (enableMouseParallax) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [enableMouseParallax, mouseIntensity]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: backgroundColor,
    ...style
  };

  const getLayerStyle = (layer: ParallaxLayer): React.CSSProperties => {
    const translateY = scrollY * layer.speed;
    
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '120%', // Extra height for parallax movement
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `translateY(${translateY}px)`,
      opacity: layer.opacity,
      filter: layer.blur > 0 ? `blur(${layer.blur}px)` : 'none',
      fontSize: `${2 + layer.id * 0.5}rem`,
      fontWeight: 300 + layer.id * 100,
      color: `hsl(${200 + layer.id * 30}, 70%, ${70 - layer.id * 10}%)`,
      textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
      pointerEvents: 'none'
    };
  };

  const foregroundStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#ffffff',
    textAlign: 'center'
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-parallax-scroll ${className || ''}`}
      style={containerStyle}
    >
      {layers.map(layer => (
        <div
          key={layer.id}
          style={getLayerStyle(layer)}
        >
          <div style={{
            fontSize: 'inherit',
            fontWeight: 'inherit',
            opacity: 0.6,
            userSelect: 'none'
          }}>
            {layer.content}
          </div>
        </div>
      ))}
      
      <div style={foregroundStyle}>
        {children || (
          <div>
            <h2 style={{ 
              margin: '0 0 1rem 0',
              fontSize: '2.5rem',
              fontWeight: '600'
            }}>
              Parallax Scroll
            </h2>
            <p style={{ 
              margin: 0,
              opacity: 0.8,
              fontSize: '1.1rem'
            }}>
              Scroll to see the parallax effect
            </p>
            <div style={{
              marginTop: '2rem',
              fontSize: '0.9rem',
              opacity: 0.6
            }}>
              Scroll Progress: {Math.round(scrollY)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
