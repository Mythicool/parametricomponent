/**
 * Magnet Lines Animation Renderer
 * Creates magnetic line effects that follow mouse movement
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface Line {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

export const MagnetLinesRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [lines, setLines] = useState<Line[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    lineCount = 20,
    lineColor = '#3b82f6',
    lineWidth = 2,
    magnetStrength = 100,
    maxDistance = 200,
    animationSpeed = 0.1,
    opacity = 0.6,
    followMouse = true,
    height = '400px'
  } = parameters;

  useEffect(() => {
    // Initialize lines
    const initialLines: Line[] = [];
    for (let i = 0; i < lineCount; i++) {
      initialLines.push({
        id: i,
        x1: Math.random() * 400,
        y1: Math.random() * 300,
        x2: Math.random() * 400,
        y2: Math.random() * 300,
        opacity: Math.random() * opacity
      });
    }
    setLines(initialLines);
  }, [lineCount, opacity]);

  useEffect(() => {
    if (!followMouse) return;

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
  }, [followMouse]);

  useEffect(() => {
    if (!followMouse) return;

    const animate = () => {
      setLines(prevLines => 
        prevLines.map(line => {
          // Calculate distance from mouse to line endpoints
          const dist1 = Math.sqrt(
            Math.pow(mousePosition.x - line.x1, 2) + 
            Math.pow(mousePosition.y - line.y1, 2)
          );
          const dist2 = Math.sqrt(
            Math.pow(mousePosition.x - line.x2, 2) + 
            Math.pow(mousePosition.y - line.y2, 2)
          );

          let newX1 = line.x1;
          let newY1 = line.y1;
          let newX2 = line.x2;
          let newY2 = line.y2;

          // Apply magnetic effect if within range
          if (dist1 < maxDistance) {
            const force = (maxDistance - dist1) / maxDistance * magnetStrength;
            const angle1 = Math.atan2(mousePosition.y - line.y1, mousePosition.x - line.x1);
            newX1 += Math.cos(angle1) * force * animationSpeed;
            newY1 += Math.sin(angle1) * force * animationSpeed;
          }

          if (dist2 < maxDistance) {
            const force = (maxDistance - dist2) / maxDistance * magnetStrength;
            const angle2 = Math.atan2(mousePosition.y - line.y2, mousePosition.x - line.x2);
            newX2 += Math.cos(angle2) * force * animationSpeed;
            newY2 += Math.sin(angle2) * force * animationSpeed;
          }

          return {
            ...line,
            x1: newX1,
            y1: newY1,
            x2: newX2,
            y2: newY2
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, magnetStrength, maxDistance, animationSpeed, followMouse]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    cursor: followMouse ? 'none' : 'default',
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
      className={`parametric-magnet-lines ${className || ''}`}
      style={containerStyle}
    >
      <svg style={svgStyle}>
        {lines.map(line => (
          <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={line.opacity}
          />
        ))}
        
        {/* Mouse indicator */}
        {followMouse && (
          <circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="5"
            fill={lineColor}
            opacity="0.8"
          />
        )}
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
            <h3 style={{ margin: '0 0 1rem 0' }}>Magnet Lines</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Move mouse to attract the lines
            </p>
          </>
        )}
      </div>
    </div>
  );
};
