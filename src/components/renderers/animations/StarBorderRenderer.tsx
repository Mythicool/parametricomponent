/**
 * Star Border Animation Renderer
 * Creates animated star border effects around content
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  speed: number;
}

export const StarBorderRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    starCount = 20,
    starSize = 8,
    borderWidth = 4,
    starColor = '#ffd700',
    animationSpeed = 1,
    twinkleSpeed = 2,
    borderRadius = 12,
    padding = 32,
    backgroundColor = 'rgba(0, 0, 0, 0.8)',
    animate = true
  } = parameters;

  useEffect(() => {
    // Create stars around the border
    const newStars: Star[] = [];
    const perimeter = 2 * (400 + 300); // Approximate perimeter
    
    for (let i = 0; i < starCount; i++) {
      const progress = i / starCount;
      const position = progress * perimeter;
      
      let x, y;
      
      // Distribute stars around rectangle perimeter
      if (position < 400) {
        // Top edge
        x = position;
        y = -borderWidth;
      } else if (position < 400 + 300) {
        // Right edge
        x = 400 + borderWidth;
        y = position - 400;
      } else if (position < 400 + 300 + 400) {
        // Bottom edge
        x = 400 - (position - 400 - 300);
        y = 300 + borderWidth;
      } else {
        // Left edge
        x = -borderWidth;
        y = 300 - (position - 400 - 300 - 400);
      }
      
      newStars.push({
        id: i,
        x,
        y,
        size: starSize + Math.random() * starSize * 0.5,
        opacity: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
        speed: 0.5 + Math.random() * animationSpeed
      });
    }
    
    setStars(newStars);
  }, [starCount, starSize, borderWidth, animationSpeed]);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setAnimationOffset(prev => prev + 1);
      
      setStars(prevStars => 
        prevStars.map(star => ({
          ...star,
          rotation: star.rotation + star.speed,
          opacity: 0.3 + Math.sin((animationOffset + star.id * 10) * 0.1 * twinkleSpeed) * 0.4 + 0.3
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [animate, twinkleSpeed, animationOffset]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    padding: `${padding}px`,
    backgroundColor: backgroundColor,
    borderRadius: `${borderRadius}px`,
    ...style
  };

  const getStarPath = (size: number): string => {
    const outerRadius = size;
    const innerRadius = size * 0.4;
    let path = '';
    
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = radius * Math.cos(angle - Math.PI / 2);
      const y = radius * Math.sin(angle - Math.PI / 2);
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    return path + ' Z';
  };

  const getStarStyle = (star: Star): React.CSSProperties => {
    return {
      position: 'absolute',
      left: `${star.x}px`,
      top: `${star.y}px`,
      transform: `translate(-50%, -50%) rotate(${star.rotation}deg)`,
      opacity: star.opacity,
      filter: `drop-shadow(0 0 ${star.size}px ${starColor})`,
      pointerEvents: 'none'
    };
  };

  return (
    <div 
      className={`parametric-star-border ${className || ''}`}
      style={containerStyle}
    >
      {/* Stars */}
      {stars.map(star => (
        <div key={star.id} style={getStarStyle(star)}>
          <svg width={star.size * 2} height={star.size * 2}>
            <path
              d={getStarPath(star.size)}
              fill={starColor}
              transform={`translate(${star.size}, ${star.size})`}
            />
          </svg>
        </div>
      ))}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children || (
          <div style={{ 
            color: '#ffffff', 
            textAlign: 'center',
            minWidth: '200px',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Star Border</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>
              Twinkling stars around the border
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
