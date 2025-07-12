/**
 * Scroll Reveal Text Animation Renderer
 * Reveals text based on scroll position
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const ScrollRevealRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    text = 'Scroll to reveal this text',
    revealType = 'character',
    animationDuration = 300,
    staggerDelay = 50,
    fontSize = 32,
    fontWeight = 600,
    color = '#ffffff',
    revealColor = '#3b82f6',
    fontFamily = 'system-ui',
    triggerOffset = 0.5,
    direction = 'left-to-right'
  } = parameters;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress based on element position
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const triggerPoint = windowHeight * triggerOffset;
      
      let progress = 0;
      
      if (elementTop <= triggerPoint) {
        progress = Math.min(1, (triggerPoint - elementTop) / (elementHeight + triggerPoint));
      }
      
      setScrollProgress(progress);
      
      // Calculate visible characters based on scroll progress
      const totalChars = text.length;
      const newVisibleChars = Math.floor(progress * totalChars);
      setVisibleChars(newVisibleChars);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [text, triggerOffset]);

  const getCharacterStyle = (index: number, char: string): React.CSSProperties => {
    const isVisible = index < visibleChars;
    const delay = direction === 'right-to-left' 
      ? (text.length - 1 - index) * staggerDelay 
      : index * staggerDelay;

    const baseStyle: React.CSSProperties = {
      display: 'inline-block',
      transition: `all ${animationDuration}ms ease`,
      transitionDelay: `${delay}ms`,
      color: isVisible ? revealColor : color,
      opacity: isVisible ? 1 : 0.3
    };

    switch (revealType) {
      case 'character':
        return {
          ...baseStyle,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
        };
      
      case 'word':
        return {
          ...baseStyle,
          transform: isVisible ? 'scale(1)' : 'scale(0.8)'
        };
      
      case 'line':
        return {
          ...baseStyle,
          transform: isVisible ? 'translateX(0)' : 'translateX(-20px)'
        };
      
      case 'fade':
        return {
          ...baseStyle,
          opacity: isVisible ? 1 : 0
        };
      
      default:
        return baseStyle;
    }
  };

  const getWordStyle = (wordIndex: number, word: string): React.CSSProperties => {
    const words = text.split(' ');
    const isVisible = wordIndex < Math.floor((visibleChars / text.length) * words.length);
    
    return {
      display: 'inline-block',
      marginRight: '0.3em',
      transition: `all ${animationDuration}ms ease`,
      transitionDelay: `${wordIndex * staggerDelay}ms`,
      color: isVisible ? revealColor : color,
      opacity: isVisible ? 1 : 0.3,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
    };
  };

  const containerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    fontFamily: fontFamily,
    lineHeight: 1.4,
    minHeight: '200vh', // Make page scrollable
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  const textContainerStyle: React.CSSProperties = {
    maxWidth: '600px',
    textAlign: 'center'
  };

  const progressBarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: `${scrollProgress * 100}%`,
    height: '4px',
    backgroundColor: revealColor,
    zIndex: 1000,
    transition: 'width 0.1s ease'
  };

  const renderByCharacter = () => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        style={getCharacterStyle(index, char)}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const renderByWord = () => {
    return text.split(' ').map((word, index) => (
      <span
        key={index}
        style={getWordStyle(index, word)}
      >
        {word}
      </span>
    ));
  };

  return (
    <>
      <div style={progressBarStyle} />
      <div 
        ref={containerRef}
        className={`parametric-scroll-reveal ${className || ''}`}
        style={containerStyle}
      >
        <div style={textContainerStyle}>
          {revealType === 'word' ? renderByWord() : renderByCharacter()}
          
          <div style={{
            marginTop: '2rem',
            fontSize: '0.8em',
            opacity: 0.6,
            color: '#888888'
          }}>
            Scroll Progress: {Math.round(scrollProgress * 100)}%
          </div>
          
          {children}
        </div>
      </div>
    </>
  );
};
