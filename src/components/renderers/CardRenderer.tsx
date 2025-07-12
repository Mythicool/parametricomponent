/**
 * Card Component Renderer
 * Renders cards with parametric controls
 */

import React, { useState } from 'react';
import { ComponentRenderProps } from '../../types/parametric';

export const CardRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    backgroundColor = '#ffffff',
    borderColor = '#e5e7eb',
    borderWidth = 1,
    borderRadius = 12,
    padding = 24,
    shadowIntensity = 0.1,
    hoverLift = 4,
    spacing = 16,
    layout = 'vertical'
  } = parameters;

  const cardStyle: React.CSSProperties = {
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    borderWidth: `${borderWidth}px`,
    borderStyle: 'solid',
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
    boxShadow: `0 ${shadowIntensity * 50}px ${shadowIntensity * 100}px rgba(0,0,0,${shadowIntensity})`,
    transform: isHovered ? `translateY(-${hoverLift}px)` : 'translateY(0)',
    transition: 'all 300ms ease',
    cursor: 'pointer',
    ...style
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    alignItems: layout === 'horizontal' ? 'center' : 'flex-start',
    gap: `${spacing}px`
  };

  return (
    <div
      className={`parametric-card ${className || ''}`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={contentStyle}>
        {children || (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: layout === 'vertical' ? `${spacing}px` : '0',
              marginRight: layout === 'horizontal' ? `${spacing}px` : '0'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#3b82f6',
                borderRadius: '4px'
              }} />
            </div>
            <div>
              <h3 style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: `${spacing}px`,
                margin: 0
              }}>
                Card Title
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Fully customizable component with parametric controls
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
