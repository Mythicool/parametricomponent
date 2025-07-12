/**
 * Pixel Transition Animation Renderer
 * Creates pixel-based transition effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const PixelTransitionRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  const {
    pixelSize = 4,
    animationDuration = 2000,
    animationDelay = 0,
    direction = 'reveal',
    backgroundColor = '#000000',
    triggerOnMount = true
  } = parameters;

  useEffect(() => {
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / animationDuration, 1);
          
          setAnimationProgress(direction === 'reveal' ? progress : 1 - progress);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }, animationDelay);
      
      return () => clearTimeout(timer);
    }
  }, [triggerOnMount, animationDuration, animationDelay, direction]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const pixelOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      repeating-linear-gradient(
        0deg,
        ${backgroundColor} 0px,
        ${backgroundColor} ${pixelSize}px,
        transparent ${pixelSize}px,
        transparent ${pixelSize * 2}px
      ),
      repeating-linear-gradient(
        90deg,
        ${backgroundColor} 0px,
        ${backgroundColor} ${pixelSize}px,
        transparent ${pixelSize}px,
        transparent ${pixelSize * 2}px
      )
    `,
    opacity: 1 - animationProgress,
    pointerEvents: 'none',
    transition: 'opacity 0.1s ease'
  };

  return (
    <div 
      className={`parametric-pixel-transition ${className || ''}`}
      style={containerStyle}
    >
      {children || (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Pixel Transition</h3>
          <p>Content revealed through pixel-based animation.</p>
        </div>
      )}
      <div style={pixelOverlayStyle} />
    </div>
  );
};
