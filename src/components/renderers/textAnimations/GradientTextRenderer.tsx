/**
 * Gradient Text Animation Renderer
 * Creates text with animated gradient effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const GradientTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    text = 'Gradient Text',
    fontSize = 48,
    fontWeight = 700,
    gradientColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
    gradientDirection = 45,
    animationSpeed = 2,
    animate = true,
    letterSpacing = 0,
    lineHeight = 1.2,
    gradientSize = 200
  } = parameters;

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + animationSpeed) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [animate, animationSpeed]);

  const createGradient = () => {
    const colors = Array.isArray(gradientColors) ? gradientColors : [gradientColors];
    const colorStops = colors.map((color, index) => {
      const position = (index / (colors.length - 1)) * 100;
      return `${color} ${position}%`;
    }).join(', ');

    if (animate) {
      return `linear-gradient(
        ${gradientDirection}deg,
        ${colorStops},
        ${colors[0]} 100%
      )`;
    }

    return `linear-gradient(${gradientDirection}deg, ${colorStops})`;
  };

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: lineHeight,
    background: createGradient(),
    backgroundSize: animate ? `${gradientSize}% ${gradientSize}%` : '100% 100%',
    backgroundPosition: animate ? `${animationOffset}% 50%` : '0% 50%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textFillColor: 'transparent',
    margin: 0,
    display: 'inline-block',
    transition: animate ? 'none' : 'background-position 0.3s ease',
    ...style
  };

  // Fallback for browsers that don't support background-clip: text
  const fallbackStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: lineHeight,
    color: Array.isArray(gradientColors) ? gradientColors[0] : gradientColors,
    margin: 0,
    display: 'inline-block',
    ...style
  };

  // Check if browser supports background-clip: text
  const supportsBackgroundClip = CSS.supports('background-clip', 'text') || 
                                 CSS.supports('-webkit-background-clip', 'text');

  return (
    <div className={`parametric-gradient-text ${className || ''}`}>
      <div style={supportsBackgroundClip ? textStyle : fallbackStyle}>
        {children || text}
      </div>
    </div>
  );
};
