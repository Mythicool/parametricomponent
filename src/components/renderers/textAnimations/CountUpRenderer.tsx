/**
 * Count Up Animation Renderer
 * Creates animated number counting effect
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const CountUpRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    startValue = 0,
    endValue = 100,
    duration = 2000,
    easing = 'easeOutQuart',
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    fontSize = 48,
    fontWeight = 700,
    color = '#3b82f6',
    fontFamily = 'system-ui',
    autoStart = true,
    useGrouping = true
  } = parameters;

  const easingFunctions = {
    linear: (t: number) => t,
    easeInQuad: (t: number) => t * t,
    easeOutQuad: (t: number) => t * (2 - t),
    easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => (--t) * t * t + 1,
    easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: (t: number) => t * t * t * t,
    easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
    easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  };

  useEffect(() => {
    if (!autoStart) return;

    startAnimation();
  }, [autoStart, startValue, endValue, duration, easing]);

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentValue(startValue);

    const startTime = Date.now();
    const valueRange = endValue - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easingFunction = easingFunctions[easing as keyof typeof easingFunctions] || easingFunctions.easeOutQuart;
      const easedProgress = easingFunction(progress);
      
      const newValue = startValue + (valueRange * easedProgress);
      setCurrentValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentValue(endValue);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const formatNumber = (value: number): string => {
    const rounded = Number(value.toFixed(decimals));
    
    if (useGrouping && separator) {
      return rounded.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).replace(/,/g, separator);
    }
    
    return rounded.toFixed(decimals);
  };

  const containerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: color,
    fontFamily: fontFamily,
    display: 'inline-block',
    cursor: !autoStart ? 'pointer' : 'default',
    ...style
  };

  const handleClick = () => {
    if (!autoStart && !isAnimating) {
      startAnimation();
    }
  };

  return (
    <div 
      className={`parametric-count-up ${className || ''}`}
      style={containerStyle}
      onClick={handleClick}
    >
      <span>{prefix}</span>
      <span style={{ 
        fontVariantNumeric: 'tabular-nums',
        transition: isAnimating ? 'none' : 'all 0.3s ease'
      }}>
        {formatNumber(currentValue)}
      </span>
      <span>{suffix}</span>
      {children}
    </div>
  );
};
