/**
 * Split Text Animation Renderer
 * Creates text with character-by-character animation effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const SplitTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animatedChars, setAnimatedChars] = useState<Set<number>>(new Set());

  const {
    text = 'Hello, yo',
    delay = 100,
    duration = 0.6,
    ease = 'elastic.out(1, 0.3)',
    splitType = 'chars',
    fromOpacity = 0,
    fromY = 40,
    toOpacity = 1,
    toY = 0,
    threshold = 0.1,
    rootMargin = '-100px',
    textAlign = 'center',
    showCompletionToast = false
  } = parameters;

  const textContent = (children as string) || text;
  const characters = textContent.split('');

  useEffect(() => {
    const timer = setTimeout(() => {
      characters.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedChars(prev => new Set([...prev, index]));
        }, index * delay);
      });
    }, 100); // Small initial delay
    return () => clearTimeout(timer);
  }, [delay, characters.length]);

  const getCharacterStyle = (index: number): React.CSSProperties => {
    const isAnimated = animatedChars.has(index);

    const baseStyle: React.CSSProperties = {
      display: 'inline-block',
      transition: `all ${duration * 1000}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transitionDelay: `${index * delay}ms`
    };

    return {
      ...baseStyle,
      opacity: isAnimated ? toOpacity : fromOpacity,
      transform: isAnimated ? `translateY(${toY}px)` : `translateY(${fromY}px)`
    };
  };

  const containerStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 700,
    color: '#ffffff',
    textAlign: textAlign as 'left' | 'center' | 'right' | 'justify',
    margin: 0,
    ...style
  };

  const handleTrigger = () => {
    setAnimatedChars(new Set());
    setTimeout(() => {
      characters.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedChars(prev => new Set([...prev, index]));
        }, index * delay);
      });
    }, 50);
  };

  return (
    <div
      className={`parametric-split-text ${className || ''}`}
      onClick={handleTrigger}
      style={{ cursor: 'pointer' }}
    >
      <p style={containerStyle}>
        {characters.map((char, index) => (
          <span
            key={index}
            style={getCharacterStyle(index)}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>
      {showCompletionToast && animatedChars.size === characters.length && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          Animation Complete!
        </div>
      )}
    </div>
  );
};
