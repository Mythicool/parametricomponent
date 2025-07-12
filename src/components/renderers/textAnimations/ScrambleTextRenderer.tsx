/**
 * Scramble Text Animation Renderer
 * Creates scrambling text effect with random character substitution
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const ScrambleTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);

  const {
    text = 'SCRAMBLE TEXT',
    scrambleSpeed = 50,
    revealSpeed = 100,
    scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
    fontSize = 32,
    fontWeight = 600,
    color = '#ffffff',
    scrambleColor = '#ff6b6b',
    fontFamily = 'monospace',
    autoStart = true,
    scrambleDuration = 2000,
    revealDelay = 50
  } = parameters;

  useEffect(() => {
    if (!autoStart) return;

    startScramble();
  }, [text, autoStart]);

  const startScramble = () => {
    setIsScrambling(true);
    setDisplayText(text);

    // Scramble phase
    const scrambleInterval = setInterval(() => {
      setDisplayText(prev => {
        return prev.split('').map(char => {
          if (char === ' ') return ' ';
          return Math.random() < 0.7 
            ? scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
            : char;
        }).join('');
      });
    }, scrambleSpeed);

    // Stop scrambling and reveal text
    setTimeout(() => {
      clearInterval(scrambleInterval);
      revealText();
    }, scrambleDuration);
  };

  const revealText = () => {
    let revealedCount = 0;
    const totalChars = text.length;

    const revealInterval = setInterval(() => {
      if (revealedCount >= totalChars) {
        clearInterval(revealInterval);
        setIsScrambling(false);
        return;
      }

      setDisplayText(prev => {
        const chars = prev.split('');
        const targetIndex = Math.floor(Math.random() * totalChars);
        
        if (chars[targetIndex] !== text[targetIndex] && text[targetIndex] !== ' ') {
          chars[targetIndex] = text[targetIndex];
          revealedCount++;
        }
        
        return chars.join('');
      });
    }, revealSpeed);
  };

  const containerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: isScrambling ? scrambleColor : color,
    fontFamily: fontFamily,
    letterSpacing: '1px',
    transition: 'color 0.3s ease',
    cursor: !autoStart ? 'pointer' : 'default',
    ...style
  };

  const handleClick = () => {
    if (!autoStart && !isScrambling) {
      startScramble();
    }
  };

  return (
    <div 
      className={`parametric-scramble-text ${className || ''}`}
      style={containerStyle}
      onClick={handleClick}
    >
      {displayText.split('').map((char, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            color: char === text[index] ? color : scrambleColor,
            transition: 'color 0.2s ease'
          }}
        >
          {char}
        </span>
      ))}
      {children}
    </div>
  );
};
