/**
 * Morphing Shapes Animation Renderer
 * Creates smooth morphing transitions between different shapes
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const MorphingShapesRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);

  const {
    shapes = ['circle', 'square', 'triangle', 'star', 'heart'],
    morphDuration = 2000,
    holdDuration = 1000,
    shapeSize = 100,
    shapeColor = '#3b82f6',
    strokeWidth = 2,
    animate = true,
    smoothTransition = true
  } = parameters;

  useEffect(() => {
    if (!animate) return;

    let startTime = Date.now();
    let phase: 'morphing' | 'holding' = 'holding';

    const updateAnimation = () => {
      const elapsed = Date.now() - startTime;
      
      if (phase === 'holding' && elapsed >= holdDuration) {
        phase = 'morphing';
        startTime = Date.now();
        setAnimationProgress(0);
      } else if (phase === 'morphing' && elapsed >= morphDuration) {
        phase = 'holding';
        startTime = Date.now();
        setCurrentShapeIndex(prev => (prev + 1) % shapes.length);
        setAnimationProgress(1);
      } else if (phase === 'morphing') {
        const progress = elapsed / morphDuration;
        setAnimationProgress(smoothTransition ? easeInOutCubic(progress) : progress);
      }

      requestAnimationFrame(updateAnimation);
    };

    const animationId = requestAnimationFrame(updateAnimation);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [animate, shapes, morphDuration, holdDuration, smoothTransition]);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const getShapePath = (shape: string, progress: number = 1): string => {
    const size = shapeSize;
    const center = size / 2;
    
    switch (shape) {
      case 'circle':
        const radius = (center - strokeWidth) * progress;
        return `M ${center - radius},${center} A ${radius},${radius} 0 1,1 ${center + radius},${center} A ${radius},${radius} 0 1,1 ${center - radius},${center}`;
      
      case 'square':
        const halfSize = (center - strokeWidth) * progress;
        return `M ${center - halfSize},${center - halfSize} L ${center + halfSize},${center - halfSize} L ${center + halfSize},${center + halfSize} L ${center - halfSize},${center + halfSize} Z`;
      
      case 'triangle':
        const height = (center - strokeWidth) * progress;
        return `M ${center},${center - height} L ${center + height * 0.866},${center + height * 0.5} L ${center - height * 0.866},${center + height * 0.5} Z`;
      
      case 'star':
        const outerRadius = (center - strokeWidth) * progress;
        const innerRadius = outerRadius * 0.4;
        let starPath = '';
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = center + radius * Math.cos(angle - Math.PI / 2);
          const y = center + radius * Math.sin(angle - Math.PI / 2);
          starPath += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
        }
        return starPath + ' Z';
      
      case 'heart':
        const heartSize = (center - strokeWidth) * progress * 0.8;
        return `M ${center},${center + heartSize * 0.3} C ${center - heartSize * 0.7},${center - heartSize * 0.3} ${center - heartSize},${center - heartSize * 0.1} ${center - heartSize * 0.5},${center - heartSize * 0.7} C ${center - heartSize * 0.5},${center - heartSize} ${center},${center - heartSize * 0.7} ${center},${center - heartSize * 0.4} C ${center},${center - heartSize * 0.7} ${center + heartSize * 0.5},${center - heartSize} ${center + heartSize * 0.5},${center - heartSize * 0.7} C ${center + heartSize},${center - heartSize * 0.1} ${center + heartSize * 0.7},${center - heartSize * 0.3} ${center},${center + heartSize * 0.3}`;
      
      default:
        return '';
    }
  };

  const getCurrentPath = (): string => {
    if (!animate) {
      return getShapePath(shapes[currentShapeIndex]);
    }

    const currentShape = shapes[currentShapeIndex];
    const nextShape = shapes[(currentShapeIndex + 1) % shapes.length];
    
    if (animationProgress === 0) {
      return getShapePath(currentShape);
    } else if (animationProgress === 1) {
      return getShapePath(nextShape);
    } else {
      // Simple interpolation between shapes (could be enhanced with proper path morphing)
      return getShapePath(currentShape, 1 - animationProgress * 0.3) || getShapePath(nextShape, animationProgress * 0.3);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '300px',
    backgroundColor: '#1a1a2e',
    ...style
  };

  return (
    <div 
      className={`parametric-morphing-shapes ${className || ''}`}
      style={containerStyle}
    >
      <div style={{ textAlign: 'center' }}>
        <svg
          width={shapeSize}
          height={shapeSize}
          viewBox={`0 0 ${shapeSize} ${shapeSize}`}
          style={{ marginBottom: '1rem' }}
        >
          <path
            d={getCurrentPath()}
            fill="none"
            stroke={shapeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {children || (
          <div style={{ color: '#ffffff' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Morphing Shapes</h3>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
              {shapes[currentShapeIndex]} → {shapes[(currentShapeIndex + 1) % shapes.length]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
