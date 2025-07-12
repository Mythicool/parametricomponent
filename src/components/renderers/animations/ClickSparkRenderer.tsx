/**
 * Click Spark Animation Renderer
 * Creates spark effects on click interactions
 */

import React, { useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const ClickSparkRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    sparkCount = 15,
    sparkColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57'],
    sparkSize = 4,
    sparkSpeed = 5,
    sparkLife = 1000,
    gravity = 0.2,
    friction = 0.98,
    height = '400px'
  } = parameters;

  const createSparks = (x: number, y: number) => {
    const newSparks: Spark[] = [];
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.5;
      const speed = Math.random() * sparkSpeed + 2;
      
      newSparks.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: sparkLife,
        maxLife: sparkLife,
        size: sparkSize + Math.random() * sparkSize,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)]
      });
    }
    
    setSparks(prev => [...prev, ...newSparks]);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createSparks(x, y);
    }
  };

  React.useEffect(() => {
    const animate = () => {
      setSparks(prevSparks => {
        const updatedSparks = prevSparks
          .map(spark => ({
            ...spark,
            x: spark.x + spark.vx,
            y: spark.y + spark.vy,
            vx: spark.vx * friction,
            vy: spark.vy * friction + gravity,
            life: spark.life - 16 // ~60fps
          }))
          .filter(spark => spark.life > 0);

        if (updatedSparks.length > 0) {
          animationRef.current = requestAnimationFrame(animate);
        }

        return updatedSparks;
      });
    };

    if (sparks.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [sparks.length, gravity, friction]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    cursor: 'pointer',
    ...style
  };

  const sparkStyle = (spark: Spark): React.CSSProperties => {
    const opacity = spark.life / spark.maxLife;
    return {
      position: 'absolute',
      left: `${spark.x}px`,
      top: `${spark.y}px`,
      width: `${spark.size}px`,
      height: `${spark.size}px`,
      backgroundColor: spark.color,
      borderRadius: '50%',
      opacity,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      boxShadow: `0 0 ${spark.size * 2}px ${spark.color}`
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-click-spark ${className || ''}`}
      style={containerStyle}
      onClick={handleClick}
    >
      {sparks.map(spark => (
        <div
          key={spark.id}
          style={sparkStyle(spark)}
        />
      ))}
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Click Spark</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Click anywhere to create sparks
            </p>
          </>
        )}
      </div>
    </div>
  );
};
