/**
 * True Focus Text Animation Renderer
 * Creates focus effect where one word is sharp while others are blurred
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const TrueFocusRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [focusedWordIndex, setFocusedWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    text = 'This is a true focus text animation effect',
    focusSpeed = 1000,
    blurAmount = 4,
    focusColor = '#ffffff',
    blurColor = '#666666',
    fontSize = 32,
    fontWeight = 600,
    fontFamily = 'system-ui',
    autoFocus = true,
    loop = true,
    pauseDuration = 500
  } = parameters;

  const words = text.split(' ');

  useEffect(() => {
    if (!autoFocus || words.length <= 1) return;

    const focusNextWord = () => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setFocusedWordIndex(prev => {
          const next = prev + 1;
          return next >= words.length ? (loop ? 0 : prev) : next;
        });
        setIsAnimating(false);
      }, pauseDuration);
    };

    const interval = setInterval(focusNextWord, focusSpeed);
    return () => clearInterval(interval);
  }, [autoFocus, words.length, focusSpeed, loop, pauseDuration]);

  const getWordStyle = (index: number): React.CSSProperties => {
    const isFocused = index === focusedWordIndex;
    
    return {
      display: 'inline-block',
      marginRight: '0.3em',
      color: isFocused ? focusColor : blurColor,
      filter: isFocused ? 'blur(0px)' : `blur(${blurAmount}px)`,
      transform: isFocused ? 'scale(1.1)' : 'scale(1)',
      transition: `all ${pauseDuration}ms ease-in-out`,
      cursor: !autoFocus ? 'pointer' : 'default',
      fontWeight: isFocused ? fontWeight + 100 : fontWeight,
      textShadow: isFocused ? `0 0 20px ${focusColor}40` : 'none'
    };
  };

  const containerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    fontFamily: fontFamily,
    lineHeight: 1.4,
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    ...style
  };

  const handleWordClick = (index: number) => {
    if (!autoFocus && !isAnimating) {
      setFocusedWordIndex(index);
    }
  };

  const handleReset = () => {
    if (!autoFocus) {
      setFocusedWordIndex(0);
    }
  };

  return (
    <div 
      className={`parametric-true-focus ${className || ''}`}
      style={containerStyle}
    >
      <div style={{ marginBottom: '2rem' }}>
        {words.map((word, index) => (
          <span
            key={index}
            style={getWordStyle(index)}
            onClick={() => handleWordClick(index)}
          >
            {word}
          </span>
        ))}
      </div>
      
      {!autoFocus && (
        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: `1px solid ${focusColor}`,
            color: focusColor,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8em',
            transition: 'all 0.3s ease'
          }}
        >
          Reset Focus
        </button>
      )}
      
      <div style={{
        marginTop: '1rem',
        fontSize: '0.7em',
        opacity: 0.6,
        color: blurColor
      }}>
        {autoFocus 
          ? `Auto-focusing: ${focusedWordIndex + 1}/${words.length}`
          : 'Click words to focus'
        }
      </div>
      
      {children}
    </div>
  );
};
