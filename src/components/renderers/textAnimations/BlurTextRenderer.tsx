/**
 * Blur Text Animation Renderer
 * Creates text with blur-in animation effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const BlurTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    text = 'Blur Text Animation',
    fontSize = 32,
    fontWeight = 600,
    color = '#000000',
    blurAmount = 10,
    animationDuration = 1000,
    animationDelay = 0,
    triggerOnMount = true,
    letterSpacing = 0,
    lineHeight = 1.2
  } = parameters;

  useEffect(() => {
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, animationDelay);
      return () => clearTimeout(timer);
    }
  }, [triggerOnMount, animationDelay]);

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: color,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: lineHeight,
    filter: isAnimating ? 'blur(0px)' : `blur(${blurAmount}px)`,
    opacity: isAnimating ? 1 : 0.3,
    transition: `all ${animationDuration}ms ease-out`,
    margin: 0,
    ...style
  };

  const handleTrigger = () => {
    if (!triggerOnMount) {
      setIsAnimating(!isAnimating);
    }
  };

  return (
    <div 
      className={`parametric-blur-text ${className || ''}`}
      onClick={handleTrigger}
      style={{ cursor: triggerOnMount ? 'default' : 'pointer' }}
    >
      <p style={textStyle}>
        {children || text}
      </p>
    </div>
  );
};
