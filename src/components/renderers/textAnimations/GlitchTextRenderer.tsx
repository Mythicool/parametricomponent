/**
 * Glitch Text Animation Renderer
 * Creates digital glitch effects with RGB shift and distortion
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const GlitchTextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });

  const {
    text = 'GLITCH TEXT',
    glitchIntensity = 5,
    glitchSpeed = 100,
    glitchDuration = 200,
    glitchInterval = 2000,
    rgbShift = true,
    rgbIntensity = 3,
    fontSize = 32,
    fontWeight = 700,
    color = '#ffffff',
    fontFamily = 'monospace',
    autoStart = true,
    scanlines = true,
    noise = true
  } = parameters;

  useEffect(() => {
    if (!autoStart) return;

    const triggerGlitch = () => {
      setIsGlitching(true);
      
      const glitchTimer = setInterval(() => {
        setGlitchOffset({
          x: (Math.random() - 0.5) * glitchIntensity,
          y: (Math.random() - 0.5) * glitchIntensity
        });
      }, glitchSpeed);

      setTimeout(() => {
        clearInterval(glitchTimer);
        setIsGlitching(false);
        setGlitchOffset({ x: 0, y: 0 });
      }, glitchDuration);
    };

    const interval = setInterval(triggerGlitch, glitchInterval);
    return () => clearInterval(interval);
  }, [autoStart, glitchIntensity, glitchSpeed, glitchDuration, glitchInterval]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    color: color,
    fontFamily: fontFamily,
    display: 'inline-block',
    cursor: !autoStart ? 'pointer' : 'default',
    ...style
  };

  const textStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    transform: isGlitching ? `translate(${glitchOffset.x}px, ${glitchOffset.y}px)` : 'none',
    transition: isGlitching ? 'none' : 'transform 0.1s ease'
  };

  const redLayerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#ff0000',
    transform: rgbShift && isGlitching ? `translate(${rgbIntensity}px, 0)` : 'none',
    opacity: isGlitching ? 0.8 : 0,
    mixBlendMode: 'screen',
    transition: 'opacity 0.1s ease'
  };

  const blueLayerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#00ffff',
    transform: rgbShift && isGlitching ? `translate(-${rgbIntensity}px, 0)` : 'none',
    opacity: isGlitching ? 0.8 : 0,
    mixBlendMode: 'screen',
    transition: 'opacity 0.1s ease'
  };

  const scanlinesStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: scanlines ? `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 255, 0, 0.03) 2px,
        rgba(0, 255, 0, 0.03) 4px
      )
    ` : 'none',
    pointerEvents: 'none',
    opacity: isGlitching ? 1 : 0.3,
    transition: 'opacity 0.1s ease'
  };

  const noiseStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: noise && isGlitching ? `
      radial-gradient(circle, transparent 20%, rgba(255, 255, 255, 0.1) 20.5%, rgba(255, 255, 255, 0.1) 21%, transparent 21.5%),
      radial-gradient(circle at 20% 80%, transparent 20%, rgba(255, 255, 255, 0.1) 20.5%, rgba(255, 255, 255, 0.1) 21%, transparent 21.5%),
      radial-gradient(circle at 80% 20%, transparent 20%, rgba(255, 255, 255, 0.1) 20.5%, rgba(255, 255, 255, 0.1) 21%, transparent 21.5%)
    ` : 'none',
    backgroundSize: '4px 4px, 6px 6px, 8px 8px',
    opacity: isGlitching ? 0.5 : 0,
    pointerEvents: 'none',
    transition: 'opacity 0.1s ease'
  };

  const handleClick = () => {
    if (!autoStart && !isGlitching) {
      setIsGlitching(true);
      
      const glitchTimer = setInterval(() => {
        setGlitchOffset({
          x: (Math.random() - 0.5) * glitchIntensity,
          y: (Math.random() - 0.5) * glitchIntensity
        });
      }, glitchSpeed);

      setTimeout(() => {
        clearInterval(glitchTimer);
        setIsGlitching(false);
        setGlitchOffset({ x: 0, y: 0 });
      }, glitchDuration);
    }
  };

  return (
    <div 
      className={`parametric-glitch-text ${className || ''}`}
      style={containerStyle}
      onClick={handleClick}
    >
      <div style={textStyle}>
        <span>{text}</span>
        {rgbShift && (
          <>
            <span style={redLayerStyle}>{text}</span>
            <span style={blueLayerStyle}>{text}</span>
          </>
        )}
      </div>
      {scanlines && <div style={scanlinesStyle} />}
      {noise && <div style={noiseStyle} />}
      {children}
    </div>
  );
};
