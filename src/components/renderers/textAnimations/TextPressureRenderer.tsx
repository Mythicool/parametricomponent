/**
 * Text Pressure Animation Renderer
 * Creates text with pressure-sensitive animation effects
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const TextPressureRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [pressure, setPressure] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const {
    text = 'Press Me',
    fontSize = 48,
    fontWeight = 700,
    color = '#ffffff',
    pressureColor = '#ff6b6b',
    maxPressure = 1,
    pressureSensitivity = 2,
    animationDuration = 300,
    scaleEffect = true,
    colorEffect = true
  } = parameters;

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      setIsPressed(true);
      const currentPressure = e.pressure || 0.5;
      setPressure(Math.min(currentPressure * pressureSensitivity, maxPressure));
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isPressed) {
        const currentPressure = e.pressure || 0.5;
        setPressure(Math.min(currentPressure * pressureSensitivity, maxPressure));
      }
    };

    const handlePointerUp = () => {
      setIsPressed(false);
      setPressure(0);
    };

    const element = textRef.current;
    if (element) {
      element.addEventListener('pointerdown', handlePointerDown);
      element.addEventListener('pointermove', handlePointerMove);
      element.addEventListener('pointerup', handlePointerUp);
      element.addEventListener('pointerleave', handlePointerUp);
    }

    return () => {
      if (element) {
        element.removeEventListener('pointerdown', handlePointerDown);
        element.removeEventListener('pointermove', handlePointerMove);
        element.removeEventListener('pointerup', handlePointerUp);
        element.removeEventListener('pointerleave', handlePointerUp);
      }
    };
  }, [isPressed, pressureSensitivity, maxPressure]);

  const getTextColor = () => {
    if (!colorEffect) return color;
    
    const ratio = pressure / maxPressure;
    const baseColor = color.replace('#', '');
    const pressColor = pressureColor.replace('#', '');
    
    const r1 = parseInt(baseColor.substr(0, 2), 16);
    const g1 = parseInt(baseColor.substr(2, 2), 16);
    const b1 = parseInt(baseColor.substr(4, 2), 16);
    
    const r2 = parseInt(pressColor.substr(0, 2), 16);
    const g2 = parseInt(pressColor.substr(2, 2), 16);
    const b2 = parseInt(pressColor.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: getTextColor(),
    transform: scaleEffect ? `scale(${1 + pressure * 0.2})` : 'scale(1)',
    transition: `all ${animationDuration}ms ease-out`,
    cursor: 'pointer',
    userSelect: 'none',
    touchAction: 'none',
    margin: 0,
    ...style
  };

  return (
    <div 
      ref={textRef}
      className={`parametric-text-pressure ${className || ''}`}
      style={textStyle}
    >
      {children || text}
    </div>
  );
};
