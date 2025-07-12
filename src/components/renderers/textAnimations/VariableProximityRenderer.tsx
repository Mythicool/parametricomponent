/**
 * Variable Proximity Text Animation Renderer
 * Text effects that change based on mouse proximity
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const VariableProximityRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [characterProximities, setCharacterProximities] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const {
    text = 'Proximity Text Effect',
    maxDistance = 100,
    effectType = 'scale',
    maxIntensity = 2,
    fontSize = 32,
    fontWeight = 600,
    color = '#ffffff',
    proximityColor = '#3b82f6',
    fontFamily = 'system-ui',
    smoothTransition = true,
    transitionSpeed = 200
  } = parameters;

  const characters = text.split('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    const proximities = characterRefs.current.map((ref, index) => {
      if (!ref) return 0;
      
      const rect = ref.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (!containerRect) return 0;
      
      const charCenterX = rect.left - containerRect.left + rect.width / 2;
      const charCenterY = rect.top - containerRect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(mousePosition.x - charCenterX, 2) + 
        Math.pow(mousePosition.y - charCenterY, 2)
      );
      
      const proximity = Math.max(0, 1 - distance / maxDistance);
      return proximity;
    });
    
    setCharacterProximities(proximities);
  }, [mousePosition, maxDistance]);

  const getCharacterStyle = (index: number, proximity: number): React.CSSProperties => {
    const intensity = proximity * maxIntensity;
    
    const baseStyle: React.CSSProperties = {
      display: 'inline-block',
      transition: smoothTransition ? `all ${transitionSpeed}ms ease-out` : 'none',
      transformOrigin: 'center bottom'
    };

    // Interpolate color based on proximity
    const colorIntensity = proximity;
    const baseColor = color;
    const targetColor = proximityColor;
    
    // Simple color interpolation (assuming hex colors)
    const interpolateColor = (color1: string, color2: string, factor: number): string => {
      if (factor === 0) return color1;
      if (factor === 1) return color2;
      
      // Simple fallback - in a real implementation, you'd parse hex colors properly
      return factor > 0.5 ? color2 : color1;
    };

    const currentColor = interpolateColor(baseColor, targetColor, colorIntensity);

    switch (effectType) {
      case 'scale':
        return {
          ...baseStyle,
          transform: `scale(${1 + intensity * 0.5})`,
          color: currentColor,
          textShadow: proximity > 0.1 ? `0 0 ${intensity * 10}px ${proximityColor}` : 'none'
        };
      
      case 'lift':
        return {
          ...baseStyle,
          transform: `translateY(-${intensity * 20}px) scale(${1 + intensity * 0.2})`,
          color: currentColor,
          textShadow: `0 ${intensity * 5}px ${intensity * 10}px rgba(0, 0, 0, 0.3)`
        };
      
      case 'blur':
        return {
          ...baseStyle,
          filter: `blur(${(1 - proximity) * 5}px)`,
          color: currentColor,
          textShadow: proximity > 0.1 ? `0 0 ${intensity * 15}px ${proximityColor}` : 'none'
        };
      
      case 'rotate':
        return {
          ...baseStyle,
          transform: `rotate(${intensity * 15}deg) scale(${1 + intensity * 0.3})`,
          color: currentColor
        };
      
      case 'skew':
        return {
          ...baseStyle,
          transform: `skewX(${intensity * 10}deg) skewY(${intensity * 5}deg)`,
          color: currentColor
        };
      
      case 'glow':
        return {
          ...baseStyle,
          color: currentColor,
          textShadow: `
            0 0 ${intensity * 5}px ${proximityColor},
            0 0 ${intensity * 10}px ${proximityColor},
            0 0 ${intensity * 20}px ${proximityColor}
          `,
          filter: `brightness(${1 + intensity})`
        };
      
      case 'wave':
        const waveOffset = Math.sin(Date.now() * 0.01 + index * 0.5) * intensity * 10;
        return {
          ...baseStyle,
          transform: `translateY(${waveOffset}px) scale(${1 + intensity * 0.2})`,
          color: currentColor
        };
      
      default:
        return {
          ...baseStyle,
          color: currentColor
        };
    }
  };

  const containerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    fontFamily: fontFamily,
    textAlign: 'center',
    padding: '2rem',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    cursor: 'none',
    ...style
  };

  const mouseIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${mousePosition.x}px`,
    top: `${mousePosition.y}px`,
    width: `${maxDistance * 2}px`,
    height: `${maxDistance * 2}px`,
    border: `1px solid ${proximityColor}40`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    opacity: 0.3
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-variable-proximity ${className || ''}`}
      style={containerStyle}
    >
      <div style={mouseIndicatorStyle} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {characters.map((char, index) => (
          <span
            key={index}
            ref={el => characterRefs.current[index] = el}
            style={getCharacterStyle(index, characterProximities[index] || 0)}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      
      <div style={{
        marginTop: '2rem',
        fontSize: '0.8em',
        opacity: 0.6,
        color: '#888888',
        fontFamily: 'system-ui'
      }}>
        Move mouse over text to see proximity effects
      </div>
      
      {children}
    </div>
  );
};
