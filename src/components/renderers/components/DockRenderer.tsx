/**
 * Dock Component Renderer
 * Creates macOS-style dock with magnification effects
 */

import React, { useState, useRef } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface DockItem {
  id: number;
  label: string;
  color: string;
  scale: number;
}

export const DockRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [items, setItems] = useState<DockItem[]>([
    { id: 1, label: 'Finder', color: '#007AFF', scale: 1 },
    { id: 2, label: 'Safari', color: '#FF9500', scale: 1 },
    { id: 3, label: 'Mail', color: '#34C759', scale: 1 },
    { id: 4, label: 'Photos', color: '#FF2D92', scale: 1 },
    { id: 5, label: 'Music', color: '#FF3B30', scale: 1 },
    { id: 6, label: 'Calendar', color: '#5856D6', scale: 1 }
  ]);
  
  const dockRef = useRef<HTMLDivElement>(null);

  const {
    itemSize = 60,
    maxScale = 1.5,
    magnetDistance = 80,
    animationDuration = 300,
    backgroundColor = 'rgba(255, 255, 255, 0.2)',
    borderRadius = 16,
    padding = 8,
    blur = 20,
    itemSpacing = 8
  } = parameters;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;

    const dockRect = dockRef.current.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;

    setItems(prevItems => 
      prevItems.map((item, index) => {
        const itemCenter = (index * (itemSize + itemSpacing)) + (itemSize / 2) + padding;
        const distance = Math.abs(mouseX - itemCenter);
        
        let scale = 1;
        if (distance < magnetDistance) {
          const proximity = 1 - (distance / magnetDistance);
          scale = 1 + (proximity * (maxScale - 1));
        }
        
        return { ...item, scale };
      })
    );
  };

  const handleMouseLeave = () => {
    setItems(prevItems => 
      prevItems.map(item => ({ ...item, scale: 1 }))
    );
  };

  const dockStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'end',
    padding: `${padding}px`,
    backgroundColor: backgroundColor,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderRadius: `${borderRadius}px`,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    gap: `${itemSpacing}px`,
    width: 'fit-content',
    margin: '0 auto',
    ...style
  };

  const getItemStyle = (item: DockItem): React.CSSProperties => {
    const scaledSize = itemSize * item.scale;
    
    return {
      width: `${scaledSize}px`,
      height: `${scaledSize}px`,
      backgroundColor: item.color,
      borderRadius: `${scaledSize * 0.2}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: `all ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transformOrigin: 'bottom center',
      position: 'relative',
      boxShadow: `
        0 ${item.scale * 4}px ${item.scale * 8}px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `
    };
  };

  const getIconStyle = (item: DockItem): React.CSSProperties => {
    return {
      width: `${itemSize * item.scale * 0.6}px`,
      height: `${itemSize * item.scale * 0.6}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: `${itemSize * item.scale * 0.1}px`,
      transition: `all ${animationDuration}ms ease`
    };
  };

  return (
    <div 
      className={`parametric-dock ${className || ''}`}
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'end',
        height: '200px',
        padding: '2rem'
      }}
    >
      <div 
        ref={dockRef}
        style={dockStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {items.map(item => (
          <div
            key={item.id}
            style={getItemStyle(item)}
            title={item.label}
          >
            <div style={getIconStyle(item)} />
          </div>
        ))}
      </div>
      
      {children && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#1f2937'
        }}>
          {children}
        </div>
      )}
    </div>
  );
};
