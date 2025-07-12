/**
 * Noise Animation Renderer
 * Creates animated noise/grain effects with various patterns
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const NoiseRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [noiseData, setNoiseData] = useState<ImageData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const {
    noiseType = 'white',
    intensity = 0.5,
    animationSpeed = 50,
    scale = 1,
    color = '#ffffff',
    backgroundColor = '#000000',
    animate = true,
    blendMode = 'normal',
    height = '400px',
    width = '100%'
  } = parameters;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width / scale;
    canvas.height = rect.height / scale;

    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      // Parse colors
      const bgColor = hexToRgb(backgroundColor);
      const fgColor = hexToRgb(color);

      for (let i = 0; i < data.length; i += 4) {
        let noiseValue = 0;

        switch (noiseType) {
          case 'white':
            noiseValue = Math.random();
            break;
          
          case 'perlin':
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
            noiseValue = perlinNoise(x * 0.01, y * 0.01, Date.now() * 0.001);
            break;
          
          case 'static':
            noiseValue = Math.random() > 0.5 ? 1 : 0;
            break;
          
          case 'grain':
            noiseValue = Math.random() * 0.3 + 0.7;
            break;
          
          case 'digital':
            const pixelIndex = i / 4;
            noiseValue = (pixelIndex + Date.now()) % 2 === 0 ? 1 : 0;
            break;
          
          default:
            noiseValue = Math.random();
        }

        // Apply intensity
        noiseValue = noiseValue * intensity;

        // Interpolate between background and foreground colors
        const r = bgColor.r + (fgColor.r - bgColor.r) * noiseValue;
        const g = bgColor.g + (fgColor.g - bgColor.g) * noiseValue;
        const b = bgColor.b + (fgColor.b - bgColor.b) * noiseValue;

        data[i] = r;     // Red
        data[i + 1] = g; // Green
        data[i + 2] = b; // Blue
        data[i + 3] = 255; // Alpha
      }

      ctx.putImageData(imageData, 0, 0);
      setNoiseData(imageData);
    };

    if (animate) {
      const animateNoise = () => {
        generateNoise();
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animateNoise);
        }, animationSpeed);
      };

      animationRef.current = requestAnimationFrame(animateNoise);
    } else {
      generateNoise();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [noiseType, intensity, animationSpeed, scale, color, backgroundColor, animate]);

  // Simple Perlin noise implementation
  const perlinNoise = (x: number, y: number, z: number): number => {
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t: number, a: number, b: number) => a + t * (b - a);
    
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    
    // Simplified gradient function
    const grad = (hash: number, x: number, y: number, z: number) => {
      const h = hash & 15;
      const u = h < 8 ? x : y;
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };
    
    // Simplified permutation table
    const p = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5);
    const P = [...p, ...p];
    
    const A = P[X] + Y;
    const AA = P[A] + Z;
    const AB = P[A + 1] + Z;
    const B = P[X + 1] + Y;
    const BA = P[B] + Z;
    const BB = P[B + 1] + Z;
    
    return lerp(w, lerp(v, lerp(u, grad(P[AA], x, y, z),
                                   grad(P[BA], x - 1, y, z)),
                           lerp(u, grad(P[AB], x, y - 1, z),
                                   grad(P[BB], x - 1, y - 1, z))),
                   lerp(v, lerp(u, grad(P[AA + 1], x, y, z - 1),
                                   grad(P[BA + 1], x - 1, y, z - 1)),
                           lerp(u, grad(P[AB + 1], x, y - 1, z - 1),
                                   grad(P[BB + 1], x - 1, y - 1, z - 1))));
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: width,
    height: height,
    overflow: 'hidden',
    ...style
  };

  const canvasStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    imageRendering: 'pixelated',
    mixBlendMode: blendMode as any
  };

  return (
    <div 
      className={`parametric-noise ${className || ''}`}
      style={containerStyle}
    >
      <canvas
        ref={canvasRef}
        style={canvasStyle}
      />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: intensity > 0.5 ? '#000000' : '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'difference'
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Noise Animation</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>
              {noiseType} noise pattern
            </p>
          </>
        )}
      </div>
    </div>
  );
};
