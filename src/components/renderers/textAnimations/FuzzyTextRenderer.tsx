/**
 * Fuzzy Text Animation Renderer
 * Creates text with fuzzy/glitch animation effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const FuzzyTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [glitchChars, setGlitchChars] = useState<string[]>([]);
  const [isGlitching, setIsGlitching] = useState(false);

  const {
    text = 'Fuzzy Glitch Text',
    fontSize = 48,
    fontWeight = 700,
    color = '#ffffff',
    glitchIntensity = 0.3,
    glitchSpeed = 100,
    glitchDuration = 2000,
    glitchInterval = 3000,
    fuzzyChars = '!@#$%^&*()_+-=[]{}|;:,.<>?',
    animate = true
  } = parameters;

  const originalText = (children as string) || text;

  useEffect(() => {
    if (!animate) return;

    const startGlitch = () => {
      setIsGlitching(true);
      
      const glitchTimer = setInterval(() => {
        const newGlitchChars = originalText.split('').map(char => {
          if (Math.random() < glitchIntensity) {
            return fuzzyChars[Math.floor(Math.random() * fuzzyChars.length)];
          }
          return char;
        });
        setGlitchChars(newGlitchChars);
      }, glitchSpeed);

      setTimeout(() => {
        clearInterval(glitchTimer);
        setIsGlitching(false);
        setGlitchChars(originalText.split(''));
      }, glitchDuration);
    };

    // Initial glitch
    startGlitch();

    // Set up interval for repeated glitching
    const intervalId = setInterval(startGlitch, glitchInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [animate, originalText, glitchIntensity, glitchSpeed, glitchDuration, glitchInterval, fuzzyChars]);

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: color,
    fontFamily: 'monospace',
    letterSpacing: '2px',
    textShadow: isGlitching ? `
      2px 0 ${color},
      -2px 0 #ff0000,
      0 2px #00ff00,
      0 -2px #0000ff
    ` : 'none',
    filter: isGlitching ? 'blur(1px)' : 'none',
    transform: isGlitching ? `skew(${Math.random() * 2 - 1}deg)` : 'none',
    transition: 'filter 0.1s ease, transform 0.1s ease',
    margin: 0,
    ...style
  };

  const displayText = isGlitching && glitchChars.length > 0 
    ? glitchChars.join('') 
    : originalText;

  return (
    <div 
      className={`parametric-fuzzy-text ${className || ''}`}
      style={textStyle}
    >
      {displayText}
    </div>
  );
};
