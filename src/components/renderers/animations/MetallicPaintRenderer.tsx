/**
 * Metallic Paint Animation Renderer
 * Creates metallic paint brush effects with reflective surfaces
 */

import React, { useEffect, useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface PaintStroke {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  opacity: number;
  metallic: number;
}

export const MetallicPaintRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [paintStrokes, setPaintStrokes] = useState<PaintStroke[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPainting, setIsPainting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const {
    brushSize = 20,
    metallicIntensity = 0.8,
    paintColor = '#c0c0c0',
    reflectionColor = '#ffffff',
    flowSpeed = 0.5,
    viscosity = 0.95,
    autoFlow = false,
    maxStrokes = 50,
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
        setMousePosition(newPosition);

        if (isPainting) {
          addPaintStroke(newPosition.x, newPosition.y);
        }
      }
    };

    const handleMouseDown = () => setIsPainting(true);
    const handleMouseUp = () => setIsPainting(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', () => setIsPainting(false));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', () => setIsPainting(false));
      }
    };
  }, [isPainting]);

  useEffect(() => {
    if (autoFlow) {
      const interval = setInterval(() => {
        const x = Math.random() * 400;
        const y = Math.random() * 300;
        addPaintStroke(x, y);
      }, 200);

      return () => clearInterval(interval);
    }
  }, [autoFlow]);

  useEffect(() => {
    const animate = () => {
      setPaintStrokes(prevStrokes => 
        prevStrokes
          .map(stroke => ({
            ...stroke,
            opacity: stroke.opacity * viscosity,
            y: stroke.y + flowSpeed,
            metallic: stroke.metallic + Math.sin(Date.now() * 0.01 + stroke.id) * 0.1
          }))
          .filter(stroke => stroke.opacity > 0.01)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [flowSpeed, viscosity]);

  const addPaintStroke = (x: number, y: number) => {
    const newStroke: PaintStroke = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      width: brushSize + Math.random() * brushSize * 0.5,
      height: brushSize * 0.3 + Math.random() * brushSize * 0.2,
      angle: Math.random() * 360,
      opacity: 0.8 + Math.random() * 0.2,
      metallic: metallicIntensity + Math.random() * 0.2
    };

    setPaintStrokes(prev => {
      const updated = [...prev, newStroke];
      return updated.slice(-maxStrokes);
    });
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: height,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    cursor: 'crosshair',
    ...style
  };

  const getStrokeStyle = (stroke: PaintStroke): React.CSSProperties => {
    const lightAngle = Math.atan2(mousePosition.y - stroke.y, mousePosition.x - stroke.x);
    const reflection = Math.cos(lightAngle - stroke.angle * Math.PI / 180) * stroke.metallic;
    
    return {
      position: 'absolute',
      left: `${stroke.x}px`,
      top: `${stroke.y}px`,
      width: `${stroke.width}px`,
      height: `${stroke.height}px`,
      background: `
        linear-gradient(
          ${stroke.angle + reflection * 30}deg,
          ${paintColor}${Math.round(stroke.opacity * 255).toString(16).padStart(2, '0')} 0%,
          ${reflectionColor}${Math.round(stroke.opacity * reflection * 255).toString(16).padStart(2, '0')} 50%,
          ${paintColor}${Math.round(stroke.opacity * 255).toString(16).padStart(2, '0')} 100%
        )
      `,
      borderRadius: '50%',
      transform: `translate(-50%, -50%) rotate(${stroke.angle}deg)`,
      filter: `blur(${(1 - stroke.metallic) * 2}px)`,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
      boxShadow: `
        0 0 ${stroke.width * 0.5}px ${paintColor}40,
        inset 0 0 ${stroke.width * 0.3}px ${reflectionColor}60
      `
    };
  };

  const brushPreviewStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${mousePosition.x}px`,
    top: `${mousePosition.y}px`,
    width: `${brushSize}px`,
    height: `${brushSize}px`,
    border: `2px solid ${paintColor}80`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    opacity: 0.6
  };

  return (
    <div 
      ref={containerRef}
      className={`parametric-metallic-paint ${className || ''}`}
      style={containerStyle}
    >
      {paintStrokes.map(stroke => (
        <div
          key={stroke.id}
          style={getStrokeStyle(stroke)}
        />
      ))}
      
      <div style={brushPreviewStyle} />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#ffffff',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: paintStrokes.length === 0 ? 1 : 0.3,
        transition: 'opacity 0.3s ease'
      }}>
        {children || (
          <>
            <h3 style={{ margin: '0 0 1rem 0' }}>Metallic Paint</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Click and drag to paint metallic strokes
            </p>
          </>
        )}
      </div>
    </div>
  );
};
