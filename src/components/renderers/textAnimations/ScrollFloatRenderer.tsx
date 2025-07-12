/**
 * Scroll Float Text Animation Renderer
 * Text that floats and moves based on scroll position
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const ScrollFloatRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    text = 'Floating Text',
    floatIntensity = 50,
    floatDirection = 'vertical',
    parallaxSpeed = 0.5,
    rotationIntensity = 0.1,
    scaleIntensity = 0.1,
    fontSize = 32,
    fontWeight = 600,
    color = '#ffffff',
    fontFamily = 'system-ui',
    enableRotation = true,
    enableScale = true,
    enableParallax = true
  } = parameters;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setScrollY(scrollPosition);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const elementTop = rect.top + scrollPosition;
        const viewportHeight = window.innerHeight;
        
        // Calculate relative position in viewport
        const relativePosition = (scrollPosition - elementTop + viewportHeight) / (viewportHeight * 2);
        
        let offsetX = 0;
        let offsetY = 0;

        switch (floatDirection) {
          case 'vertical':
            offsetY = Math.sin(relativePosition * Math.PI * 2) * floatIntensity;
            break;
          case 'horizontal':
            offsetX = Math.sin(relativePosition * Math.PI * 2) * floatIntensity;
            break;
          case 'circular':
            offsetX = Math.sin(relativePosition * Math.PI * 2) * floatIntensity;
            offsetY = Math.cos(relativePosition * Math.PI * 2) * floatIntensity;
            break;
          case 'figure8':
            offsetX = Math.sin(relativePosition * Math.PI * 4) * floatIntensity;
            offsetY = Math.sin(relativePosition * Math.PI * 2) * floatIntensity;
            break;
          default:
            offsetY = Math.sin(relativePosition * Math.PI * 2) * floatIntensity;
        }

        // Add parallax effect
        if (enableParallax) {
          offsetY += scrollPosition * parallaxSpeed;
        }

        setElementOffset({ x: offsetX, y: offsetY });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [floatIntensity, floatDirection, parallaxSpeed, enableParallax]);

  const getTransform = (): string => {
    const translateX = elementOffset.x;
    const translateY = elementOffset.y;
    
    let transform = `translate(${translateX}px, ${translateY}px)`;

    if (enableRotation) {
      const rotation = elementOffset.x * rotationIntensity;
      transform += ` rotate(${rotation}deg)`;
    }

    if (enableScale) {
      const scale = 1 + (Math.abs(elementOffset.y) / 1000) * scaleIntensity;
      transform += ` scale(${scale})`;
    }

    return transform;
  };

  const containerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: color,
    fontFamily: fontFamily,
    transform: getTransform(),
    transition: 'transform 0.1s ease-out',
    textAlign: 'center',
    minHeight: '200vh', // Make page scrollable
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    ...style
  };

  const debugStyle: React.CSSProperties = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#ffffff',
    padding: '0.5rem',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: 1000
  };

  return (
    <>
      <div style={debugStyle}>
        <div>Scroll: {Math.round(scrollY)}px</div>
        <div>Offset X: {Math.round(elementOffset.x)}px</div>
        <div>Offset Y: {Math.round(elementOffset.y)}px</div>
      </div>
      
      <div 
        ref={containerRef}
        className={`parametric-scroll-float ${className || ''}`}
        style={containerStyle}
      >
        <div>
          {text.split(' ').map((word, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                marginRight: '0.3em',
                transform: `translateY(${Math.sin((scrollY + index * 100) * 0.01) * 10}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {word}
            </span>
          ))}
        </div>
        
        <div style={{
          marginTop: '2rem',
          fontSize: '0.8em',
          opacity: 0.6,
          color: '#888888'
        }}>
          Scroll to see floating effect
        </div>
        
        {children}
      </div>
    </>
  );
};
