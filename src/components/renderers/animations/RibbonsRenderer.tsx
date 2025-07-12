/**
 * Ribbons Animation Renderer
 * Creates flowing ribbon animations with physics
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface RibbonSegment {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Ribbon {
  id: number;
  segments: RibbonSegment[];
  color: string;
  width: number;
  opacity: number;
}

export const RibbonsRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [ribbons, setRibbons] = useState<Ribbon[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    ribbonCount = 3,
    segmentCount = 20,
    ribbonColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
    ribbonWidth = 8,
    flowSpeed = 0.02,
    damping = 0.98,
    springStrength = 0.1,
    mouseInfluence = 50,
    animate = true,
    height = '400px'
  } = parameters;

  useEffect(() => {
    // Initialize ribbons
    const newRibbons: Ribbon[] = [];
    
    for (let r = 0; r < ribbonCount; r++) {
      const segments: RibbonSegment[] = [];
      const startX = (r + 1) * (400 / (ribbonCount + 1));
      
      for (let s = 0; s < segmentCount; s++) {
        segments.push({
          x: startX,
          y: s * 10 + 50,
          vx: 0,
          vy: 0
        });
      }
      
      newRibbons.push({
        id: r,
        segments,
        color: ribbonColors[r % ribbonColors.length],
        width: ribbonWidth + Math.random() * ribbonWidth * 0.5,
        opacity: 0.8 + Math.random() * 0.2
      });
    }
    
    setRibbons(newRibbons);
  }, [ribbonCount, segmentCount, ribbonColors, ribbonWidth]);

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
    if (!animate) return;

    const updateRibbons = () => {
      setRibbons(prevRibbons => 
        prevRibbons.map(ribbon => {
          const updatedSegments = ribbon.segments.map((segment, index) => {
            let newVx = segment.vx;
            let newVy = segment.vy;
            
            // Apply flow force
            newVy += flowSpeed;
            
            // Mouse influence
            const mouseDistance = Math.sqrt(
              Math.pow(mousePosition.x - segment.x, 2) + 
              Math.pow(mousePosition.y - segment.y, 2)
            );
            
            if (mouseDistance < mouseInfluence) {
              const force = (mouseInfluence - mouseDistance) / mouseInfluence;
              const angle = Math.atan2(segment.y - mousePosition.y, segment.x - mousePosition.x);
              newVx += Math.cos(angle) * force * 0.5;
              newVy += Math.sin(angle) * force * 0.5;
            }
            
            // Spring forces to previous segment
            if (index > 0) {
              const prevSegment = ribbon.segments[index - 1];
              const dx = prevSegment.x - segment.x;
              const dy = prevSegment.y - segment.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const targetDistance = 10;
              
              if (distance > 0) {
                const force = (distance - targetDistance) * springStrength;
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
              }
            }
            
            // Apply damping
            newVx *= damping;
            newVy *= damping;
            
            // Update position
            let newX = segment.x + newVx;
            let newY = segment.y + newVy;
            
            // Boundary constraints
            const containerWidth = containerRef.current?.clientWidth || 400;
            const containerHeight = containerRef.current?.clientHeight || 400;
            
            if (newX < 0 || newX > containerWidth) {
              newVx *= -0.5;
              newX = Math.max(0, Math.min(containerWidth, newX));
            }
            
            if (newY > containerHeight) {
              newY = -10;
              newVy = 0;
            }
            
            return {
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy
            };
          });
          
          return {
            ...ribbon,
            segments: updatedSegments
          };
        })
      );

      animationRef.current = requestAnimationFrame(updateRibbons);
    };

    animationRef.current = requestAnimationFrame(updateRibbons);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, mousePosition, flowSpeed, damping, springStrength, mouseInfluence]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    ...style
  };

  const getRibbonPath = (ribbon: Ribbon): string => {
    if (ribbon.segments.length < 2) return '';
    
    let path = `M ${ribbon.segments[0].x} ${ribbon.segments[0].y}`;
    
    for (let i = 1; i < ribbon.segments.length; i++) {
      const segment = ribbon.segments[i];
      const prevSegment = ribbon.segments[i - 1];
      
      // Create smooth curves using quadratic bezier
      const cpX = (prevSegment.x + segment.x) / 2;
      const cpY = (prevSegment.y + segment.y) / 2;
      
      path += ` Q ${prevSegment.x} ${prevSegment.y} ${cpX} ${cpY}`;
    }
    
    return path;
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-ribbons ${className || ''}`}
      style={containerStyle}
    >
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <defs>
          {ribbons.map(ribbon => (
            <linearGradient key={`gradient-${ribbon.id}`} id={`ribbon-gradient-${ribbon.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={ribbon.color} stopOpacity={ribbon.opacity} />
              <stop offset="50%" stopColor={ribbon.color} stopOpacity={ribbon.opacity * 0.8} />
              <stop offset="100%" stopColor={ribbon.color} stopOpacity={ribbon.opacity * 0.4} />
            </linearGradient>
          ))}
        </defs>
        
        {ribbons.map(ribbon => (
          <path
            key={ribbon.id}
            d={getRibbonPath(ribbon)}
            stroke={`url(#ribbon-gradient-${ribbon.id})`}
            strokeWidth={ribbon.width}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 ${ribbon.width}px ${ribbon.color}40)`}
          />
        ))}
      </svg>
      
      {/* Mouse influence indicator */}
      <div style={{
        position: 'absolute',
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        width: `${mouseInfluence * 2}px`,
        height: `${mouseInfluence * 2}px`,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        opacity: 0.3
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Flowing Ribbons</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Move mouse to influence ribbon flow
            </p>
          </>
        )}
      </div>
    </div>
  );
};
