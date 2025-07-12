/**
 * Circular Text Animation Renderer
 * Creates text arranged in a circular pattern with rotation animation
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const CircularTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [rotation, setRotation] = useState(0);

  const {
    text = 'CIRCULAR TEXT ANIMATION • ',
    fontSize = 16,
    fontWeight = 500,
    color = '#000000',
    radius = 100,
    rotationSpeed = 30, // degrees per second
    animationDirection = 'clockwise',
    letterSpacing = 2,
    startAngle = 0,
    animate = true
  } = parameters;

  const textContent = (children as string) || text;
  const characters = textContent.split('');

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setRotation(prev => {
        const increment = rotationSpeed / 60; // 60 FPS
        return animationDirection === 'clockwise' 
          ? prev + increment 
          : prev - increment;
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [animate, rotationSpeed, animationDirection]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    margin: '0 auto',
    ...style
  };

  const getCharacterStyle = (index: number): React.CSSProperties => {
    const angleStep = 360 / characters.length;
    const angle = (startAngle + (index * angleStep) + rotation) * (Math.PI / 180);
    
    const x = radius + (radius * Math.cos(angle));
    const y = radius + (radius * Math.sin(angle));
    
    return {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      color: color,
      letterSpacing: `${letterSpacing}px`,
      transform: `translate(-50%, -50%) rotate(${angle * (180 / Math.PI) + 90}deg)`,
      transformOrigin: 'center',
      userSelect: 'none',
      pointerEvents: 'none'
    };
  };

  return (
    <div 
      className={`parametric-circular-text ${className || ''}`}
      style={containerStyle}
    >
      {characters.map((char, index) => (
        <span
          key={index}
          style={getCharacterStyle(index)}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
