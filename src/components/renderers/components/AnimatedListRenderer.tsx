/**
 * Animated List Component Renderer
 * Creates lists with staggered entrance animations
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

interface ListItem {
  id: number;
  title: string;
  description: string;
  isVisible: boolean;
}

export const AnimatedListRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [items, setItems] = useState<ListItem[]>([]);

  const {
    itemCount = 5,
    staggerDelay = 150,
    animationDuration = 600,
    animationType = 'slideUp',
    triggerOnMount = true,
    itemSpacing = 16,
    backgroundColor = '#ffffff',
    borderRadius = 8,
    shadow = true
  } = parameters;

  useEffect(() => {
    // Initialize items
    const initialItems: ListItem[] = [];
    for (let i = 0; i < itemCount; i++) {
      initialItems.push({
        id: i,
        title: `Item ${i + 1}`,
        description: `Description for item ${i + 1}`,
        isVisible: false
      });
    }
    setItems(initialItems);
  }, [itemCount]);

  useEffect(() => {
    if (triggerOnMount && items.length > 0) {
      items.forEach((_, index) => {
        setTimeout(() => {
          setItems(prev => 
            prev.map((item, i) => 
              i === index ? { ...item, isVisible: true } : item
            )
          );
        }, index * staggerDelay);
      });
    }
  }, [triggerOnMount, items.length, staggerDelay]);

  const getItemStyle = (item: ListItem, index: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: '1rem',
      marginBottom: `${itemSpacing}px`,
      backgroundColor: backgroundColor,
      borderRadius: `${borderRadius}px`,
      boxShadow: shadow ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
      transition: `all ${animationDuration}ms ease-out`,
      transitionDelay: `${index * staggerDelay}ms`
    };

    switch (animationType) {
      case 'slideUp':
        return {
          ...baseStyle,
          opacity: item.isVisible ? 1 : 0,
          transform: item.isVisible ? 'translateY(0)' : 'translateY(30px)'
        };
      
      case 'slideLeft':
        return {
          ...baseStyle,
          opacity: item.isVisible ? 1 : 0,
          transform: item.isVisible ? 'translateX(0)' : 'translateX(-30px)'
        };
      
      case 'slideRight':
        return {
          ...baseStyle,
          opacity: item.isVisible ? 1 : 0,
          transform: item.isVisible ? 'translateX(0)' : 'translateX(30px)'
        };
      
      case 'scaleIn':
        return {
          ...baseStyle,
          opacity: item.isVisible ? 1 : 0,
          transform: item.isVisible ? 'scale(1)' : 'scale(0.8)'
        };
      
      case 'fadeIn':
        return {
          ...baseStyle,
          opacity: item.isVisible ? 1 : 0
        };
      
      default:
        return {
          ...baseStyle,
          opacity: item.isVisible ? 1 : 0,
          transform: item.isVisible ? 'translateY(0)' : 'translateY(30px)'
        };
    }
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    ...style
  };

  const handleReset = () => {
    setItems(prev => prev.map(item => ({ ...item, isVisible: false })));
    
    setTimeout(() => {
      items.forEach((_, index) => {
        setTimeout(() => {
          setItems(prev => 
            prev.map((item, i) => 
              i === index ? { ...item, isVisible: true } : item
            )
          );
        }, index * staggerDelay);
      });
    }, 100);
  };

  return (
    <div 
      className={`parametric-animated-list ${className || ''}`}
      style={containerStyle}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: 0, color: '#1f2937' }}>Animated List</h3>
        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Replay
        </button>
      </div>
      
      {items.map((item, index) => (
        <div
          key={item.id}
          style={getItemStyle(item, index)}
        >
          <h4 style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#1f2937',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            {item.title}
          </h4>
          <p style={{ 
            margin: 0, 
            color: '#6b7280',
            fontSize: '0.875rem',
            lineHeight: '1.4'
          }}>
            {item.description}
          </p>
        </div>
      ))}
      
      {children}
    </div>
  );
};
