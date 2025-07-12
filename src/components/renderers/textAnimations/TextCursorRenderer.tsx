/**
 * Text Cursor Animation Renderer
 * Creates typewriter effect with animated cursor
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const TextCursorRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const {
    text = 'Typewriter Effect',
    typeSpeed = 100,
    deleteSpeed = 50,
    pauseDuration = 2000,
    cursorChar = '|',
    cursorBlinkSpeed = 500,
    loop = true,
    autoStart = true,
    fontSize = 32,
    fontWeight = 600,
    color = '#ffffff',
    cursorColor = '#3b82f6'
  } = parameters;

  useEffect(() => {
    if (!autoStart) return;

    const typeText = () => {
      if (isTyping) {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        } else {
          if (loop) {
            setTimeout(() => {
              setIsTyping(false);
            }, pauseDuration);
          }
        }
      } else {
        if (currentIndex > 0) {
          setDisplayText(text.slice(0, currentIndex - 1));
          setCurrentIndex(prev => prev - 1);
        } else {
          setIsTyping(true);
        }
      }
    };

    const timer = setTimeout(typeText, isTyping ? typeSpeed : deleteSpeed);
    return () => clearTimeout(timer);
  }, [currentIndex, isTyping, text, typeSpeed, deleteSpeed, pauseDuration, loop, autoStart]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, cursorBlinkSpeed);

    return () => clearInterval(cursorTimer);
  }, [cursorBlinkSpeed]);

  const containerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: color,
    fontFamily: 'monospace',
    display: 'inline-flex',
    alignItems: 'center',
    ...style
  };

  const cursorStyle: React.CSSProperties = {
    color: cursorColor,
    opacity: showCursor ? 1 : 0,
    transition: 'opacity 0.1s ease',
    marginLeft: '2px'
  };

  const handleRestart = () => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsTyping(true);
  };

  return (
    <div 
      className={`parametric-text-cursor ${className || ''}`}
      style={containerStyle}
      onClick={!autoStart ? handleRestart : undefined}
    >
      <span>{displayText}</span>
      <span style={cursorStyle}>{cursorChar}</span>
      {children}
    </div>
  );
};
