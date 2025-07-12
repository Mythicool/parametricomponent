/**
 * Meta Balls Animation Renderer
 * Creates organic blob-like shapes that merge and separate
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface MetaBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const MetaBallsRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [metaBalls, setMetaBalls] = useState<MetaBall[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const {
    ballCount = 5,
    minRadius = 30,
    maxRadius = 60,
    speed = 1,
    colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
    threshold = 0.6,
    animate = true,
    height = '400px',
    width = '100%'
  } = parameters;

  useEffect(() => {
    // Initialize meta balls
    const newMetaBalls: MetaBall[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    for (let i = 0; i < ballCount; i++) {
      newMetaBalls.push({
        id: i,
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        radius: minRadius + Math.random() * (maxRadius - minRadius),
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    setMetaBalls(newMetaBalls);
  }, [ballCount, minRadius, maxRadius, speed, colors]);

  useEffect(() => {
    if (!animate) return;

    const updateMetaBalls = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      setMetaBalls(prevBalls => 
        prevBalls.map(ball => {
          let newX = ball.x + ball.vx;
          let newY = ball.y + ball.vy;
          let newVx = ball.vx;
          let newVy = ball.vy;

          // Bounce off walls
          if (newX <= ball.radius || newX >= canvasWidth - ball.radius) {
            newVx = -newVx;
            newX = Math.max(ball.radius, Math.min(canvasWidth - ball.radius, newX));
          }

          if (newY <= ball.radius || newY >= canvasHeight - ball.radius) {
            newVy = -newVy;
            newY = Math.max(ball.radius, Math.min(canvasHeight - ball.radius, newY));
          }

          return {
            ...ball,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        })
      );

      animationRef.current = requestAnimationFrame(updateMetaBalls);
    };

    animationRef.current = requestAnimationFrame(updateMetaBalls);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create image data for meta ball effect
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let x = 0; x < canvas.width; x += 2) {
      for (let y = 0; y < canvas.height; y += 2) {
        let sum = 0;
        let closestBall: MetaBall | null = null;
        let minDistance = Infinity;

        // Calculate influence from all meta balls
        metaBalls.forEach(ball => {
          const dx = x - ball.x;
          const dy = y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestBall = ball;
          }

          // Add influence based on distance
          if (distance > 0) {
            sum += (ball.radius * ball.radius) / (distance * distance);
          }
        });

        // If above threshold, draw pixel
        if (sum > threshold && closestBall) {
          const index = (y * canvas.width + x) * 4;
          const color = closestBall.color;
          
          // Parse hex color
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          
          // Set pixel color
          data[index] = r;     // Red
          data[index + 1] = g; // Green
          data[index + 2] = b; // Blue
          data[index + 3] = 255; // Alpha

          // Fill adjacent pixels for smoother appearance
          if (x + 1 < canvas.width) {
            const nextIndex = (y * canvas.width + (x + 1)) * 4;
            data[nextIndex] = r;
            data[nextIndex + 1] = g;
            data[nextIndex + 2] = b;
            data[nextIndex + 3] = 255;
          }
          
          if (y + 1 < canvas.height) {
            const belowIndex = ((y + 1) * canvas.width + x) * 4;
            data[belowIndex] = r;
            data[belowIndex + 1] = g;
            data[belowIndex + 2] = b;
            data[belowIndex + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [metaBalls, threshold]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: width,
    height: height,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    ...style
  };

  const canvasStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    filter: 'blur(1px)'
  };

  return (
    <div 
      className={`parametric-meta-balls ${className || ''}`}
      style={containerStyle}
    >
      <canvas
        ref={canvasRef}
        style={canvasStyle}
      />
      
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Meta Balls</h3>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
              Organic blob shapes that merge and separate
            </p>
          </>
        )}
      </div>
    </div>
  );
};
