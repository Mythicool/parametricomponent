/**
 * Fade Content Animation Renderer
 * Creates smooth fade transition effects for content
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const FadeContentRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const {
    animationDuration = 1000,
    animationDelay = 0,
    fadeDirection = 'in',
    triggerOnMount = true,
    opacity = 1,
    translateY = 0,
    translateX = 0,
    scale = 1
  } = parameters;

  useEffect(() => {
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        setIsVisible(fadeDirection === 'in');
      }, animationDelay);
      return () => clearTimeout(timer);
    }
  }, [triggerOnMount, animationDelay, fadeDirection]);

  const contentStyle: React.CSSProperties = {
    opacity: isVisible ? opacity : 0,
    transform: `translateY(${isVisible ? 0 : translateY}px) translateX(${isVisible ? 0 : translateX}px) scale(${isVisible ? scale : scale * 0.9})`,
    transition: `all ${animationDuration}ms ease-out`,
    ...style
  };

  const handleToggle = () => {
    if (!triggerOnMount) {
      setIsVisible(!isVisible);
    }
  };

  return (
    <div 
      className={`parametric-fade-content ${className || ''}`}
      style={contentStyle}
      onClick={handleToggle}
    >
      {children || (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Fade Content Animation</h3>
          <p>This content fades in with smooth transitions.</p>
        </div>
      )}
    </div>
  );
};
