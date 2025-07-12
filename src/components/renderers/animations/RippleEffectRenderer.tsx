/**
 * Ripple Effect Animation Renderer
 * Creates expanding ripple effects on interaction
 */

import React, { useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  maxSize: number;
  startTime: number;
}

export const RippleEffectRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    rippleColor = '#3b82f6',
    rippleDuration = 1000,
    maxRippleSize = 200,
    rippleOpacity = 0.6,
    autoRipple = false,
    autoRippleInterval = 2000,
    multipleRipples = true,
    height = '300px'
  } = parameters;

  React.useEffect(() => {
    if (autoRipple) {
      const interval = setInterval(() => {
        createRipple(
          Math.random() * (containerRef.current?.clientWidth || 400),
          Math.random() * (containerRef.current?.clientHeight || 300)
        );
      }, autoRippleInterval);

      return () => clearInterval(interval);
    }
  }, [autoRipple, autoRippleInterval]);

  React.useEffect(() => {
    const animate = () => {
      const now = Date.now();
      
      setRipples(prevRipples => {
        const updatedRipples = prevRipples
          .map(ripple => {
            const elapsed = now - ripple.startTime;
            const progress = elapsed / rippleDuration;
            
            if (progress >= 1) {
              return null;
            }
            
            const size = ripple.maxSize * progress;
            const opacity = rippleOpacity * (1 - progress);
            
            return {
              ...ripple,
              size,
              opacity
            };
          })
          .filter(Boolean) as Ripple[];

        if (updatedRipples.length > 0) {
          animationRef.current = requestAnimationFrame(animate);
        }

        return updatedRipples;
      });
    };

    if (ripples.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [ripples.length, rippleDuration, rippleOpacity]);

  const createRipple = (x: number, y: number) => {
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: 0,
      opacity: rippleOpacity,
      maxSize: maxRippleSize,
      startTime: Date.now()
    };

    setRipples(prev => {
      if (multipleRipples) {
        return [...prev, newRipple];
      } else {
        return [newRipple];
      }
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createRipple(x, y);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  const getRippleStyle = (ripple: Ripple): React.CSSProperties => {
    return {
      position: 'absolute',
      left: `${ripple.x}px`,
      top: `${ripple.y}px`,
      width: `${ripple.size}px`,
      height: `${ripple.size}px`,
      borderRadius: '50%',
      backgroundColor: 'transparent',
      border: `2px solid ${rippleColor}`,
      opacity: ripple.opacity,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      boxShadow: `0 0 ${ripple.size * 0.1}px ${rippleColor}40`
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-ripple-effect ${className || ''}`}
      style={containerStyle}
      onClick={handleClick}
    >
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          style={getRippleStyle(ripple)}
        />
      ))}
      
      <div style={{
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Ripple Effect</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Click anywhere to create ripples
            </p>
          </>
        )}
      </div>
    </div>
  );
};
