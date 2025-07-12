/**
 * Scroll Velocity Text Animation Renderer
 * Text animation speed tied to scroll velocity
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const ScrollVelocityRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [animationIntensity, setAnimationIntensity] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    text = 'Velocity Driven Text',
    maxVelocity = 50,
    velocitySensitivity = 0.1,
    animationType = 'blur',
    fontSize = 32,
    fontWeight = 600,
    color = '#ffffff',
    fontFamily = 'system-ui',
    smoothing = 0.9,
    threshold = 1
  } = parameters;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      const currentTime = Date.now();
      
      const deltaY = currentScrollY - lastScrollY;
      const deltaTime = currentTime - lastScrollTime;
      
      if (deltaTime > 0) {
        const velocity = Math.abs(deltaY) / deltaTime * 100; // Scale for better visibility
        const clampedVelocity = Math.min(velocity, maxVelocity);
        
        // Apply smoothing
        setScrollVelocity(prev => prev * smoothing + clampedVelocity * (1 - smoothing));
        
        // Calculate animation intensity based on velocity
        const intensity = clampedVelocity > threshold ? clampedVelocity / maxVelocity : 0;
        setAnimationIntensity(intensity);
      }
      
      setLastScrollY(currentScrollY);
      setLastScrollTime(currentTime);
    };

    // Decay velocity when not scrolling
    const decayInterval = setInterval(() => {
      setScrollVelocity(prev => prev * 0.95);
      setAnimationIntensity(prev => prev * 0.95);
    }, 16);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(decayInterval);
    };
  }, [lastScrollY, lastScrollTime, maxVelocity, smoothing, threshold]);

  const getTextStyle = (): React.CSSProperties => {
    const intensity = animationIntensity;
    
    const baseStyle: React.CSSProperties = {
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      color: color,
      fontFamily: fontFamily,
      transition: 'all 0.1s ease-out'
    };

    switch (animationType) {
      case 'blur':
        return {
          ...baseStyle,
          filter: `blur(${intensity * 10}px)`,
          textShadow: `0 0 ${intensity * 20}px ${color}`
        };
      
      case 'scale':
        return {
          ...baseStyle,
          transform: `scale(${1 + intensity * 0.5})`,
          textShadow: `0 0 ${intensity * 15}px ${color}`
        };
      
      case 'skew':
        return {
          ...baseStyle,
          transform: `skewX(${intensity * 20}deg)`,
          filter: `blur(${intensity * 3}px)`
        };
      
      case 'stretch':
        return {
          ...baseStyle,
          transform: `scaleX(${1 + intensity}) scaleY(${1 - intensity * 0.3})`,
          letterSpacing: `${intensity * 5}px`
        };
      
      case 'glow':
        return {
          ...baseStyle,
          textShadow: `
            0 0 ${intensity * 10}px ${color},
            0 0 ${intensity * 20}px ${color},
            0 0 ${intensity * 30}px ${color}
          `,
          filter: `brightness(${1 + intensity})`
        };
      
      case 'shake':
        return {
          ...baseStyle,
          transform: `translate(${(Math.random() - 0.5) * intensity * 10}px, ${(Math.random() - 0.5) * intensity * 10}px)`
        };
      
      default:
        return baseStyle;
    }
  };

  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: '200vh', // Make page scrollable
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    ...style
  };

  const velocityBarStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    width: '200px',
    height: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 1000
  };

  const velocityFillStyle: React.CSSProperties = {
    height: '100%',
    width: `${(scrollVelocity / maxVelocity) * 100}%`,
    backgroundColor: color,
    transition: 'width 0.1s ease-out',
    borderRadius: '5px'
  };

  const debugStyle: React.CSSProperties = {
    position: 'fixed',
    top: '40px',
    left: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#ffffff',
    padding: '0.5rem',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: 1000
  };

  return (
    <>
      <div style={velocityBarStyle}>
        <div style={velocityFillStyle} />
      </div>
      
      <div style={debugStyle}>
        <div>Velocity: {scrollVelocity.toFixed(1)}</div>
        <div>Intensity: {(animationIntensity * 100).toFixed(0)}%</div>
        <div>Type: {animationType}</div>
      </div>
      
      <div 
        ref={containerRef}
        className={`parametric-scroll-velocity ${className || ''}`}
        style={containerStyle}
      >
        <div style={getTextStyle()}>
          {text}
        </div>
        
        <div style={{
          marginTop: '2rem',
          fontSize: '0.8em',
          opacity: 0.6,
          color: '#888888',
          fontFamily: 'system-ui'
        }}>
          Scroll fast to see velocity effects
        </div>
        
        {children}
      </div>
    </>
  );
};
