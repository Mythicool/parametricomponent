/**
 * Particles Background Renderer
 * Creates animated particle system backgrounds
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export const ParticlesRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    particleCount = 50,
    particleColor = '#3b82f6',
    particleSize = 2,
    speed = 1,
    opacity = 0.6,
    animate = true,
    height = '100vh',
    connectionDistance = 100,
    showConnections = true
  } = parameters;

  useEffect(() => {
    if (!animate) return;

    const createParticle = (id: number): Particle => ({
      id,
      x: Math.random() * (containerRef.current?.clientWidth || 800),
      y: Math.random() * (containerRef.current?.clientHeight || 600),
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: particleSize + Math.random() * particleSize,
      opacity: opacity * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife: 1000 + Math.random() * 2000
    });

    // Initialize particles
    const initialParticles = Array.from({ length: particleCount }, (_, i) => createParticle(i));
    setParticles(initialParticles);

    const updateParticles = () => {
      setParticles(prevParticles => {
        const containerWidth = containerRef.current?.clientWidth || 800;
        const containerHeight = containerRef.current?.clientHeight || 600;

        return prevParticles.map(particle => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          let newVx = particle.vx;
          let newVy = particle.vy;

          // Bounce off walls
          if (newX <= 0 || newX >= containerWidth) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(containerWidth, newX));
          }
          if (newY <= 0 || newY >= containerHeight) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(containerHeight, newY));
          }

          const newLife = particle.life + 16; // ~60fps
          
          // Respawn particle if it's too old
          if (newLife > particle.maxLife) {
            return createParticle(particle.id);
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            life: newLife
          };
        });
      });

      animationRef.current = requestAnimationFrame(updateParticles);
    };

    animationRef.current = requestAnimationFrame(updateParticles);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, particleCount, speed, particleSize, opacity]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    ...style
  };

  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  };

  const getConnections = () => {
    if (!showConnections) return [];
    
    const connections = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          const connectionOpacity = (1 - distance / connectionDistance) * 0.3;
          connections.push({
            x1: particles[i].x,
            y1: particles[i].y,
            x2: particles[j].x,
            y2: particles[j].y,
            opacity: connectionOpacity
          });
        }
      }
    }
    return connections;
  };

  const connections = getConnections();

  return (
    <div 
      ref={containerRef}
      className={`parametric-particles ${className || ''}`}
      style={containerStyle}
    >
      <svg style={canvasStyle}>
        {/* Render connections */}
        {connections.map((connection, index) => (
          <line
            key={index}
            x1={connection.x1}
            y1={connection.y1}
            x2={connection.x2}
            y2={connection.y2}
            stroke={particleColor}
            strokeWidth="1"
            opacity={connection.opacity}
          />
        ))}
        
        {/* Render particles */}
        {particles.map(particle => (
          <circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={particleColor}
            opacity={particle.opacity}
          />
        ))}
      </svg>
      
      <div style={contentStyle}>
        {children || (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem' }}>
              Particle System
            </h2>
            <p style={{ margin: 0, opacity: 0.8 }}>
              Dynamic particle background with connections
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
