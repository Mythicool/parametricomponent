/**
 * Splash Cursor Animation Renderer
 * Creates liquid splash effects on click interactions
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface Droplet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Splash {
  id: number;
  x: number;
  y: number;
  droplets: Droplet[];
  startTime: number;
}

export const SplashCursorRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    dropletCount = 15,
    splashColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
    maxDropletSize = 8,
    minDropletSize = 3,
    splashForce = 5,
    gravity = 0.2,
    friction = 0.98,
    splashDuration = 2000,
    autoSplash = false,
    autoSplashInterval = 1000,
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

    const handleClick = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        createSplash(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('click', handleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleClick);
      }
    };
  }, []);

  useEffect(() => {
    if (autoSplash) {
      const interval = setInterval(() => {
        const x = Math.random() * (containerRef.current?.clientWidth || 400);
        const y = Math.random() * (containerRef.current?.clientHeight || 300);
        createSplash(x, y);
      }, autoSplashInterval);

      return () => clearInterval(interval);
    }
  }, [autoSplash, autoSplashInterval]);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      
      setSplashes(prevSplashes => 
        prevSplashes
          .map(splash => ({
            ...splash,
            droplets: splash.droplets
              .map(droplet => {
                // Apply physics
                const newVy = droplet.vy + gravity;
                const newVx = droplet.vx * friction;
                const newX = droplet.x + newVx;
                const newY = droplet.y + newVy;
                
                // Bounce off bottom
                let finalVy = newVy;
                let finalY = newY;
                const containerHeight = containerRef.current?.clientHeight || 400;
                
                if (newY > containerHeight - droplet.size) {
                  finalY = containerHeight - droplet.size;
                  finalVy = -newVy * 0.6; // Bounce with energy loss
                }
                
                return {
                  ...droplet,
                  x: newX,
                  y: finalY,
                  vx: newVx,
                  vy: finalVy,
                  life: droplet.life - 1,
                  size: droplet.size * 0.995 // Gradually shrink
                };
              })
              .filter(droplet => droplet.life > 0 && droplet.size > 0.5)
          }))
          .filter(splash => 
            splash.droplets.length > 0 && 
            (now - splash.startTime) < splashDuration
          )
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gravity, friction, splashDuration]);

  const createSplash = (x: number, y: number) => {
    const droplets: Droplet[] = [];
    
    for (let i = 0; i < dropletCount; i++) {
      const angle = (i / dropletCount) * Math.PI * 2;
      const force = splashForce * (0.5 + Math.random() * 0.5);
      const size = minDropletSize + Math.random() * (maxDropletSize - minDropletSize);
      
      droplets.push({
        id: Date.now() + i,
        x: x,
        y: y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force - Math.random() * 2, // Slight upward bias
        size: size,
        life: 100 + Math.random() * 100,
        maxLife: 200,
        color: splashColors[Math.floor(Math.random() * splashColors.length)]
      });
    }
    
    const newSplash: Splash = {
      id: Date.now(),
      x,
      y,
      droplets,
      startTime: Date.now()
    };
    
    setSplashes(prev => [...prev, newSplash]);
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    cursor: 'crosshair',
    ...style
  };

  const getDropletStyle = (droplet: Droplet): React.CSSProperties => {
    const opacity = droplet.life / droplet.maxLife;
    
    return {
      position: 'absolute',
      left: `${droplet.x}px`,
      top: `${droplet.y}px`,
      width: `${droplet.size}px`,
      height: `${droplet.size}px`,
      backgroundColor: droplet.color,
      borderRadius: '50%',
      opacity: opacity,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      boxShadow: `0 0 ${droplet.size * 2}px ${droplet.color}60`,
      filter: `blur(${(1 - opacity) * 2}px)`
    };
  };

  const cursorRippleStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${mousePosition.x}px`,
    top: `${mousePosition.y}px`,
    width: '40px',
    height: '40px',
    border: '2px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    opacity: 0.6
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-splash-cursor ${className || ''}`}
      style={containerStyle}
    >
      {splashes.map(splash => 
        splash.droplets.map(droplet => (
          <div
            key={droplet.id}
            style={getDropletStyle(droplet)}
          />
        ))
      )}
      
      <div style={cursorRippleStyle} />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: splashes.length === 0 ? 1 : 0.3,
        transition: 'opacity 0.3s ease'
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Splash Cursor</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Click anywhere to create liquid splashes
            </p>
          </>
        )}
      </div>
    </div>
  );
};
