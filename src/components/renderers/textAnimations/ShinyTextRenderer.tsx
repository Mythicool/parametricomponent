/**
 * Shiny Text Animation Renderer
 * Creates text with a moving shine/highlight effect
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const ShinyTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  const {
    text = 'Shiny Text Effect',
    fontSize = 48,
    fontWeight = 700,
    baseColor = '#333333',
    shineColor = '#ffffff',
    backgroundColor = 'transparent',
    animationDuration = 2000,
    animationDelay = 0,
    shineWidth = 30,
    shineAngle = 45,
    repeat = true,
    letterSpacing = 0,
    lineHeight = 1.2
  } = parameters;

  useEffect(() => {
    const animate = () => {
      const startTime = Date.now() + animationDelay;
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.max(0, Math.min(1, elapsed / animationDuration));
        
        setAnimationProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(updateProgress);
        } else if (repeat) {
          setTimeout(() => {
            setAnimationProgress(0);
            animate();
          }, 500);
        }
      };
      
      requestAnimationFrame(updateProgress);
    };

    animate();
  }, [animationDuration, animationDelay, repeat]);

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: baseColor,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: lineHeight,
    backgroundColor: backgroundColor,
    background: `linear-gradient(
      ${shineAngle}deg,
      ${baseColor} 0%,
      ${baseColor} ${Math.max(0, (animationProgress * 100) - shineWidth)}%,
      ${shineColor} ${animationProgress * 100}%,
      ${baseColor} ${Math.min(100, (animationProgress * 100) + shineWidth)}%,
      ${baseColor} 100%
    )`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textFillColor: 'transparent',
    margin: 0,
    position: 'relative',
    display: 'inline-block',
    ...style
  };

  // Fallback for browsers that don't support background-clip: text
  const fallbackStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: baseColor,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: lineHeight,
    backgroundColor: backgroundColor,
    margin: 0,
    position: 'relative',
    display: 'inline-block',
    ...style
  };

  const shineOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: `${(animationProgress * 120) - 20}%`,
    width: `${shineWidth}%`,
    height: '100%',
    background: `linear-gradient(
      ${shineAngle}deg,
      transparent 0%,
      ${shineColor}40 50%,
      transparent 100%
    )`,
    transform: `skew(${shineAngle - 90}deg)`,
    pointerEvents: 'none',
    transition: animationProgress === 0 ? 'none' : undefined
  };

  // Check if browser supports background-clip: text
  const supportsBackgroundClip = CSS.supports('background-clip', 'text') || 
                                 CSS.supports('-webkit-background-clip', 'text');

  return (
    <div className={`parametric-shiny-text ${className || ''}`}>
      <div style={supportsBackgroundClip ? textStyle : fallbackStyle}>
        {children || text}
        {!supportsBackgroundClip && (
          <div style={shineOverlayStyle} />
        )}
      </div>
    </div>
  );
};
