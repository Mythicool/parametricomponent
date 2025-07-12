/**
 * Rotating Text Animation Renderer
 * Creates rotating text carousel effect
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const RotatingTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    texts = ['First Text', 'Second Text', 'Third Text'],
    rotationSpeed = 2000,
    animationDuration = 500,
    animationType = 'slideUp',
    fontSize = 32,
    fontWeight = 600,
    color = '#ffffff',
    fontFamily = 'system-ui',
    autoStart = true,
    loop = true,
    pauseOnHover = false
  } = parameters;

  const textArray = Array.isArray(texts) ? texts : texts.split(',').map(t => t.trim());

  useEffect(() => {
    if (!autoStart || textArray.length <= 1) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        
        setTimeout(() => {
          setCurrentIndex(prev => {
            const next = prev + 1;
            return next >= textArray.length ? (loop ? 0 : prev) : next;
          });
          
          setTimeout(() => {
            setIsAnimating(false);
          }, animationDuration / 2);
        }, animationDuration / 2);
      }
    }, rotationSpeed);

    return () => clearInterval(interval);
  }, [autoStart, textArray.length, rotationSpeed, animationDuration, loop, isAnimating]);

  const getAnimationStyle = (isExiting: boolean): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transition: `all ${animationDuration}ms ease-in-out`,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    switch (animationType) {
      case 'slideUp':
        return {
          ...baseStyle,
          transform: isExiting 
            ? 'translateY(-100%)' 
            : isAnimating 
              ? 'translateY(100%)' 
              : 'translateY(0)',
          opacity: isExiting ? 0 : 1
        };
      
      case 'slideDown':
        return {
          ...baseStyle,
          transform: isExiting 
            ? 'translateY(100%)' 
            : isAnimating 
              ? 'translateY(-100%)' 
              : 'translateY(0)',
          opacity: isExiting ? 0 : 1
        };
      
      case 'fade':
        return {
          ...baseStyle,
          opacity: isExiting ? 0 : 1
        };
      
      case 'scale':
        return {
          ...baseStyle,
          transform: isExiting 
            ? 'scale(0.8)' 
            : isAnimating 
              ? 'scale(1.2)' 
              : 'scale(1)',
          opacity: isExiting ? 0 : 1
        };
      
      case 'rotate':
        return {
          ...baseStyle,
          transform: isExiting 
            ? 'rotateX(90deg)' 
            : isAnimating 
              ? 'rotateX(-90deg)' 
              : 'rotateX(0deg)',
          opacity: isExiting ? 0 : 1
        };
      
      default:
        return {
          ...baseStyle,
          opacity: isExiting ? 0 : 1
        };
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: color,
    fontFamily: fontFamily,
    height: '1.2em',
    overflow: 'hidden',
    cursor: !autoStart ? 'pointer' : 'default',
    ...style
  };

  const handleClick = () => {
    if (!autoStart && !isAnimating && textArray.length > 1) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex(prev => {
          const next = prev + 1;
          return next >= textArray.length ? 0 : next;
        });
        
        setTimeout(() => {
          setIsAnimating(false);
        }, animationDuration / 2);
      }, animationDuration / 2);
    }
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      // Implementation would require ref to interval
    }
  };

  return (
    <div 
      className={`parametric-rotating-text ${className || ''}`}
      style={containerStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <div style={getAnimationStyle(false)}>
        {textArray[currentIndex]}
      </div>
      {children}
    </div>
  );
};
