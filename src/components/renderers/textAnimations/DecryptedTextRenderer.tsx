/**
 * Decrypted Text Animation Renderer
 * Creates text decryption effect with random characters
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const DecryptedTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [displayText, setDisplayText] = useState('');
  const [decryptedIndices, setDecryptedIndices] = useState<Set<number>>(new Set());

  const {
    text = 'DECRYPTED TEXT',
    decryptSpeed = 50,
    decryptDelay = 100,
    randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
    fontSize = 32,
    fontWeight = 700,
    color = '#00ff00',
    backgroundColor = '#000000',
    fontFamily = 'monospace',
    autoStart = true,
    glowEffect = true
  } = parameters;

  useEffect(() => {
    if (!autoStart) return;

    setDisplayText(text.split('').map(() => 
      randomChars[Math.floor(Math.random() * randomChars.length)]
    ).join(''));

    const decryptCharacter = (index: number) => {
      setTimeout(() => {
        setDecryptedIndices(prev => new Set([...prev, index]));
        
        // Update display text with correct character
        setDisplayText(prev => {
          const chars = prev.split('');
          chars[index] = text[index];
          return chars.join('');
        });
      }, index * decryptDelay);
    };

    // Start decryption process
    text.split('').forEach((_, index) => {
      decryptCharacter(index);
    });

    // Continue scrambling non-decrypted characters
    const scrambleInterval = setInterval(() => {
      setDisplayText(prev => {
        const chars = prev.split('');
        chars.forEach((char, index) => {
          if (!decryptedIndices.has(index) && char !== ' ') {
            chars[index] = randomChars[Math.floor(Math.random() * randomChars.length)];
          }
        });
        return chars.join('');
      });
    }, decryptSpeed);

    return () => clearInterval(scrambleInterval);
  }, [text, decryptSpeed, decryptDelay, randomChars, autoStart]);

  const containerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: color,
    backgroundColor: backgroundColor,
    fontFamily: fontFamily,
    padding: '1rem',
    borderRadius: '4px',
    textShadow: glowEffect ? `0 0 10px ${color}` : 'none',
    letterSpacing: '2px',
    ...style
  };

  const handleRestart = () => {
    setDecryptedIndices(new Set());
    setDisplayText(text.split('').map(() => 
      randomChars[Math.floor(Math.random() * randomChars.length)]
    ).join(''));

    text.split('').forEach((_, index) => {
      setTimeout(() => {
        setDecryptedIndices(prev => new Set([...prev, index]));
        setDisplayText(prev => {
          const chars = prev.split('');
          chars[index] = text[index];
          return chars.join('');
        });
      }, index * decryptDelay);
    });
  };

  return (
    <div 
      className={`parametric-decrypted-text ${className || ''}`}
      style={containerStyle}
      onClick={!autoStart ? handleRestart : undefined}
    >
      {displayText.split('').map((char, index) => (
        <span
          key={index}
          style={{
            color: decryptedIndices.has(index) ? color : '#666666',
            textShadow: decryptedIndices.has(index) && glowEffect ? `0 0 10px ${color}` : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {char}
        </span>
      ))}
      {children}
    </div>
  );
};
