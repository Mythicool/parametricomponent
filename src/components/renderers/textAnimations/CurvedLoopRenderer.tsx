/**
 * Curved Loop Text Animation Renderer
 * Creates text that follows a curved path with looping animation
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const CurvedLoopRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    text = 'Curved Loop Text',
    fontSize = 24,
    fontWeight = 600,
    color = '#ffffff',
    pathRadius = 150,
    loopSpeed = 1,
    curveIntensity = 0.5,
    animate = true,
    direction = 'clockwise'
  } = parameters;

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setAnimationOffset(prev => {
        const increment = loopSpeed * 2;
        return direction === 'clockwise' 
          ? (prev + increment) % 360 
          : (prev - increment + 360) % 360;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [animate, loopSpeed, direction]);

  const textContent = (children as string) || text;
  const characters = textContent.split('');

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${pathRadius * 2}px`,
    height: `${pathRadius * 2}px`,
    margin: '0 auto',
    ...style
  };

  const getCharacterStyle = (index: number): React.CSSProperties => {
    const totalChars = characters.length;
    const angleStep = 360 / totalChars;
    const baseAngle = index * angleStep + animationOffset;
    
    // Create curved path using sine wave
    const curveOffset = Math.sin((baseAngle * Math.PI) / 180) * curveIntensity * 20;
    const effectiveRadius = pathRadius + curveOffset;
    
    const angle = (baseAngle * Math.PI) / 180;
    const x = pathRadius + effectiveRadius * Math.cos(angle);
    const y = pathRadius + effectiveRadius * Math.sin(angle);
    
    return {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      color: color,
      transform: `translate(-50%, -50%) rotate(${baseAngle + 90}deg)`,
      transformOrigin: 'center',
      userSelect: 'none',
      pointerEvents: 'none'
    };
  };

  return (
    <div 
      className={`parametric-curved-loop ${className || ''}`}
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
