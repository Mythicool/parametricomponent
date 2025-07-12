/**
 * Cubes Animation Renderer
 * Creates 3D rotating cubes with various effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface Cube {
  id: number;
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  size: number;
  color: string;
  opacity: number;
}

export const CubesRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [animationOffset, setAnimationOffset] = useState(0);

  const {
    cubeCount = 12,
    cubeSize = 40,
    cubeColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
    rotationSpeed = 1,
    floatSpeed = 0.5,
    spacing = 80,
    perspective = 1000,
    animate = true,
    randomRotation = true,
    height = '400px'
  } = parameters;

  useEffect(() => {
    // Initialize cubes in a grid pattern
    const newCubes: Cube[] = [];
    const cols = Math.ceil(Math.sqrt(cubeCount));
    const rows = Math.ceil(cubeCount / cols);

    for (let i = 0; i < cubeCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      newCubes.push({
        id: i,
        x: (col - cols / 2) * spacing,
        y: (row - rows / 2) * spacing,
        z: 0,
        rotationX: randomRotation ? Math.random() * 360 : 0,
        rotationY: randomRotation ? Math.random() * 360 : 0,
        rotationZ: randomRotation ? Math.random() * 360 : 0,
        size: cubeSize + Math.random() * cubeSize * 0.3,
        color: cubeColors[Math.floor(Math.random() * cubeColors.length)],
        opacity: 0.8 + Math.random() * 0.2
      });
    }

    setCubes(newCubes);
  }, [cubeCount, cubeSize, cubeColors, spacing, randomRotation]);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setAnimationOffset(prev => prev + rotationSpeed);
    }, 16);

    return () => clearInterval(interval);
  }, [animate, rotationSpeed]);

  useEffect(() => {
    if (!animate) return;

    setCubes(prevCubes => 
      prevCubes.map((cube, index) => ({
        ...cube,
        rotationX: cube.rotationX + rotationSpeed,
        rotationY: cube.rotationY + rotationSpeed * 0.7,
        rotationZ: cube.rotationZ + rotationSpeed * 0.3,
        y: cube.y + Math.sin((animationOffset + index * 30) * 0.01) * floatSpeed,
        z: Math.sin((animationOffset + index * 45) * 0.008) * 50
      }))
    );
  }, [animationOffset, rotationSpeed, floatSpeed]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    perspective: `${perspective}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  const getCubeStyle = (cube: Cube): React.CSSProperties => {
    return {
      position: 'absolute',
      width: `${cube.size}px`,
      height: `${cube.size}px`,
      transformStyle: 'preserve-3d',
      transform: `
        translate3d(${cube.x}px, ${cube.y}px, ${cube.z}px)
        rotateX(${cube.rotationX}deg)
        rotateY(${cube.rotationY}deg)
        rotateZ(${cube.rotationZ}deg)
      `,
      opacity: cube.opacity
    };
  };

  const getFaceStyle = (face: string, cube: Cube): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: cube.color,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: `inset 0 0 20px rgba(255, 255, 255, 0.1)`
    };

    const halfSize = cube.size / 2;

    switch (face) {
      case 'front':
        return { ...baseStyle, transform: `translateZ(${halfSize}px)` };
      case 'back':
        return { ...baseStyle, transform: `translateZ(-${halfSize}px) rotateY(180deg)` };
      case 'right':
        return { ...baseStyle, transform: `rotateY(90deg) translateZ(${halfSize}px)` };
      case 'left':
        return { ...baseStyle, transform: `rotateY(-90deg) translateZ(${halfSize}px)` };
      case 'top':
        return { ...baseStyle, transform: `rotateX(90deg) translateZ(${halfSize}px)` };
      case 'bottom':
        return { ...baseStyle, transform: `rotateX(-90deg) translateZ(${halfSize}px)` };
      default:
        return baseStyle;
    }
  };

  return (
    <div 
      className={`parametric-cubes ${className || ''}`}
      style={containerStyle}
    >
      {cubes.map(cube => (
        <div key={cube.id} style={getCubeStyle(cube)}>
          <div style={getFaceStyle('front', cube)} />
          <div style={getFaceStyle('back', cube)} />
          <div style={getFaceStyle('right', cube)} />
          <div style={getFaceStyle('left', cube)} />
          <div style={getFaceStyle('top', cube)} />
          <div style={getFaceStyle('bottom', cube)} />
        </div>
      ))}
      
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>3D Cubes</h3>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
              Floating 3D cubes with rotation
            </p>
          </>
        )}
      </div>
    </div>
  );
};
