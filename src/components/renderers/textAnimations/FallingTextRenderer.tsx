/**
 * Falling Text Animation Renderer
 * Creates text with falling/gravity animation effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface FallingChar {
  char: string;
  x: number;
  y: number;
  velocity: number;
  rotation: number;
  rotationSpeed: number;
  id: number;
}

export const FallingTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [fallingChars, setFallingChars] = useState<FallingChar[]>([]);
  const [containerHeight, setContainerHeight] = useState(400);

  const {
    text = 'Falling Text',
    fontSize = 32,
    fontWeight = 600,
    color = '#ffffff',
    gravity = 0.5,
    initialVelocity = 2,
    rotationEnabled = true,
    maxRotationSpeed = 5,
    spawnDelay = 200,
    animate = true,
    resetOnComplete = true
  } = parameters;

  const textContent = (children as string) || text;

  useEffect(() => {
    if (!animate) return;

    let charIndex = 0;
    let animationId: number;

    const spawnChar = () => {
      if (charIndex < textContent.length) {
        const newChar: FallingChar = {
          char: textContent[charIndex],
          x: 50 + (charIndex * 30) % 300, // Spread characters horizontally
          y: -50,
          velocity: initialVelocity,
          rotation: 0,
          rotationSpeed: rotationEnabled ? (Math.random() - 0.5) * maxRotationSpeed : 0,
          id: Date.now() + charIndex
        };

        setFallingChars(prev => [...prev, newChar]);
        charIndex++;

        if (charIndex < textContent.length) {
          setTimeout(spawnChar, spawnDelay);
        }
      }
    };

    const updateAnimation = () => {
      setFallingChars(prev => {
        const updated = prev.map(char => ({
          ...char,
          y: char.y + char.velocity,
          velocity: char.velocity + gravity,
          rotation: char.rotation + char.rotationSpeed
        })).filter(char => char.y < containerHeight + 100);

        // Reset animation if all characters have fallen and resetOnComplete is true
        if (updated.length === 0 && charIndex >= textContent.length && resetOnComplete) {
          charIndex = 0;
          setTimeout(spawnChar, 1000);
        }

        return updated;
      });

      animationId = requestAnimationFrame(updateAnimation);
    };

    // Start spawning characters
    spawnChar();
    
    // Start animation loop
    animationId = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animate, textContent, gravity, initialVelocity, rotationEnabled, maxRotationSpeed, spawnDelay, containerHeight, resetOnComplete]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: `${containerHeight}px`,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    ...style
  };

  const getCharStyle = (char: FallingChar): React.CSSProperties => {
    return {
      position: 'absolute',
      left: `${char.x}px`,
      top: `${char.y}px`,
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      color: color,
      transform: `rotate(${char.rotation}deg)`,
      userSelect: 'none',
      pointerEvents: 'none'
    };
  };

  return (
    <div 
      className={`parametric-falling-text ${className || ''}`}
      style={containerStyle}
    >
      {fallingChars.map(char => (
        <span
          key={char.id}
          style={getCharStyle(char)}
        >
          {char.char}
        </span>
      ))}
      
      {!animate && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          color: color,
          opacity: 0.5
        }}>
          {textContent}
        </div>
      )}
    </div>
  );
};
