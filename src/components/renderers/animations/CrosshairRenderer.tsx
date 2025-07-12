/**
 * Crosshair Animation Renderer
 * Creates interactive crosshair cursor effects
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const CrosshairRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    crosshairSize = 40,
    lineWidth = 2,
    color = '#ff0000',
    centerDotSize = 4,
    animationSpeed = 0.1,
    followMouse = true,
    showGrid = true,
    gridSpacing = 50,
    gridOpacity = 0.2,
    pulseEffect = true,
    pulseSpeed = 2,
    height = '400px'
  } = parameters;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newPosition = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        if (followMouse) {
          setMousePosition(newPosition);
        }
      }
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTargetPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('click', handleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('click', handleClick);
      }
    };
  }, [followMouse]);

  useEffect(() => {
    if (!followMouse) {
      // Animate crosshair to target position
      const animate = () => {
        setMousePosition(prev => ({
          x: prev.x + (targetPosition.x - prev.x) * animationSpeed,
          y: prev.y + (targetPosition.y - prev.y) * animationSpeed
        }));
      };

      const interval = setInterval(animate, 16);
      return () => clearInterval(interval);
    }
  }, [targetPosition, animationSpeed, followMouse]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    cursor: 'none',
    ...style
  };

  const gridStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: showGrid ? `
      linear-gradient(${color}${Math.round(gridOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px),
      linear-gradient(90deg, ${color}${Math.round(gridOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)
    ` : 'none',
    backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
    pointerEvents: 'none'
  };

  const getCrosshairStyle = (): React.CSSProperties => {
    const pulse = pulseEffect ? 1 + Math.sin(Date.now() * 0.01 * pulseSpeed) * 0.2 : 1;
    const scale = isActive ? 1.2 * pulse : pulse;
    
    return {
      position: 'absolute',
      left: `${mousePosition.x}px`,
      top: `${mousePosition.y}px`,
      width: `${crosshairSize * scale}px`,
      height: `${crosshairSize * scale}px`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      transition: isActive ? 'none' : 'transform 0.2s ease'
    };
  };

  const getLineStyle = (direction: 'horizontal' | 'vertical'): React.CSSProperties => {
    const isHorizontal = direction === 'horizontal';
    
    return {
      position: 'absolute',
      top: isHorizontal ? '50%' : '0',
      left: isHorizontal ? '0' : '50%',
      width: isHorizontal ? '100%' : `${lineWidth}px`,
      height: isHorizontal ? `${lineWidth}px` : '100%',
      backgroundColor: color,
      transform: isHorizontal ? 'translateY(-50%)' : 'translateX(-50%)',
      boxShadow: `0 0 ${lineWidth * 2}px ${color}`
    };
  };

  const centerDotStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${centerDotSize}px`,
    height: `${centerDotSize}px`,
    backgroundColor: color,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: `0 0 ${centerDotSize * 2}px ${color}`
  };

  const coordinatesStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: color,
    fontFamily: 'monospace',
    fontSize: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '0.5rem',
    borderRadius: '4px',
    pointerEvents: 'none'
  };

  const targetIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${targetPosition.x}px`,
    top: `${targetPosition.y}px`,
    width: '20px',
    height: '20px',
    border: `2px solid ${color}80`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    animation: 'pulse 1s ease-in-out infinite'
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-crosshair ${className || ''}`}
      style={containerStyle}
    >
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          }
        `}
      </style>
      
      <div style={gridStyle} />
      
      <div style={getCrosshairStyle()}>
        <div style={getLineStyle('horizontal')} />
        <div style={getLineStyle('vertical')} />
        <div style={centerDotStyle} />
      </div>
      
      {!followMouse && (
        <div style={targetIndicatorStyle} />
      )}
      
      <div style={coordinatesStyle}>
        X: {Math.round(mousePosition.x)}<br />
        Y: {Math.round(mousePosition.y)}
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Crosshair Cursor</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              {followMouse ? 'Move mouse to aim' : 'Click to set target'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
