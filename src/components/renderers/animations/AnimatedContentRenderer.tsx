/**
 * Animated Content Renderer
 * Creates content with various entrance and exit animations
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const AnimatedContentRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const {
    animationType = 'fadeIn',
    animationDuration = 1000,
    animationDelay = 0,
    triggerOnMount = true,
    easing = 'ease-out',
    scale = 1,
    rotation = 0,
    translateX = 0,
    translateY = 0,
    autoReverse = false,
    reverseDelay = 2000
  } = parameters;

  useEffect(() => {
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setAnimationClass(animationType);
      }, animationDelay);

      return () => clearTimeout(timer);
    }
  }, [triggerOnMount, animationDelay, animationType]);

  useEffect(() => {
    if (autoReverse && isVisible) {
      const reverseTimer = setTimeout(() => {
        setIsVisible(false);
        setAnimationClass('');
      }, reverseDelay);

      return () => clearTimeout(reverseTimer);
    }
  }, [autoReverse, isVisible, reverseDelay]);

  const getAnimationStyles = (): React.CSSProperties => {
    const baseTransform = `scale(${scale}) rotate(${rotation}deg) translateX(${translateX}px) translateY(${translateY}px)`;
    
    switch (animationType) {
      case 'fadeIn':
        return {
          opacity: isVisible ? 1 : 0,
          transform: baseTransform,
          transition: `all ${animationDuration}ms ${easing}`
        };
      
      case 'slideInLeft':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? baseTransform : `${baseTransform} translateX(-100px)`,
          transition: `all ${animationDuration}ms ${easing}`
        };
      
      case 'slideInRight':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? baseTransform : `${baseTransform} translateX(100px)`,
          transition: `all ${animationDuration}ms ${easing}`
        };
      
      case 'slideInUp':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? baseTransform : `${baseTransform} translateY(100px)`,
          transition: `all ${animationDuration}ms ${easing}`
        };
      
      case 'slideInDown':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? baseTransform : `${baseTransform} translateY(-100px)`,
          transition: `all ${animationDuration}ms ${easing}`
        };
      
      case 'scaleIn':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? baseTransform : `${baseTransform} scale(0)`,
          transition: `all ${animationDuration}ms ${easing}`
        };
      
      case 'rotateIn':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? baseTransform : `${baseTransform} rotate(180deg)`,
          transition: `all ${animationDuration}ms ${easing}`
        };
      
      case 'bounceIn':
        return {
          opacity: isVisible ? 1 : 0,
          transform: baseTransform,
          transition: `all ${animationDuration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`
        };
      
      case 'flipIn':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? baseTransform : `${baseTransform} rotateY(90deg)`,
          transition: `all ${animationDuration}ms ${easing}`
        };
      
      default:
        return {
          opacity: isVisible ? 1 : 0,
          transform: baseTransform,
          transition: `all ${animationDuration}ms ${easing}`
        };
    }
  };

  const containerStyle: React.CSSProperties = {
    ...getAnimationStyles(),
    ...style
  };

  const handleTrigger = () => {
    if (!triggerOnMount) {
      setIsVisible(!isVisible);
    }
  };

  return (
    <div 
      className={`parametric-animated-content ${animationClass} ${className || ''}`}
      style={containerStyle}
      onClick={handleTrigger}
    >
      {children || (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Animated Content</h3>
          <p style={{ margin: 0 }}>
            Content with customizable entrance animations
          </p>
        </div>
      )}
    </div>
  );
};
