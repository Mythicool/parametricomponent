import React, { useState, useRef } from 'react';

interface StackRendererProps {
  cardCount: number;
  cardContent: string;
  cardColors: string;
  stackOffset: number;
  stackRotation: number;
  stackScale: number;
  stackDirection: 'right' | 'left' | 'up' | 'down' | 'random';
  hoverEffect: 'fan' | 'lift' | 'spread' | 'rotate' | 'none';
  clickAction: 'cycle' | 'shuffle' | 'flip' | 'none';
  animationSpeed: number;
  cardWidth: string;
  cardHeight: string;
  borderRadius: number;
}

export const StackRenderer: React.FC<StackRendererProps> = ({
  cardCount,
  cardContent,
  cardColors,
  stackOffset,
  stackRotation,
  stackScale,
  stackDirection,
  hoverEffect,
  clickAction,
  animationSpeed,
  cardWidth,
  cardHeight,
  borderRadius
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const cards = cardContent.split(',').slice(0, cardCount);
  const colors = cardColors.split(',');

  const getCardColor = (index: number) => {
    return colors[index % colors.length] || '#3b82f6';
  };

  const getStackTransform = (index: number, isHovered: boolean) => {
    const reverseIndex = cardCount - 1 - index;
    let offsetX = 0;
    let offsetY = 0;
    let rotation = 0;
    let scale = Math.pow(stackScale, reverseIndex);

    if (!isHovered) {
      switch (stackDirection) {
        case 'right':
          offsetX = reverseIndex * stackOffset;
          break;
        case 'left':
          offsetX = -reverseIndex * stackOffset;
          break;
        case 'up':
          offsetY = -reverseIndex * stackOffset;
          break;
        case 'down':
          offsetY = reverseIndex * stackOffset;
          break;
        case 'random':
          offsetX = reverseIndex * stackOffset * (Math.random() - 0.5) * 2;
          offsetY = reverseIndex * stackOffset * (Math.random() - 0.5) * 2;
          break;
      }
      rotation = reverseIndex * stackRotation * (Math.random() - 0.5) * 2;
    } else {
      // Hover effects
      switch (hoverEffect) {
        case 'fan':
          rotation = (index - cardCount / 2) * 15;
          offsetX = index * 20;
          break;
        case 'lift':
          offsetY = -index * 10;
          scale = 1;
          break;
        case 'spread':
          offsetX = (index - cardCount / 2) * 40;
          scale = 1;
          break;
        case 'rotate':
          rotation = index * 10;
          break;
      }
    }

    return {
      transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`,
      zIndex: index
    };
  };

  const handleClick = () => {
    if (isAnimating || clickAction === 'none') return;

    setIsAnimating(true);
    
    switch (clickAction) {
      case 'cycle':
        setCurrentIndex((prev) => (prev + 1) % cardCount);
        break;
      case 'shuffle':
        // Trigger a shuffle animation
        break;
      case 'flip':
        // Trigger a flip animation
        break;
    }

    setTimeout(() => setIsAnimating(false), animationSpeed);
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ 
        width: cardWidth, 
        height: cardHeight,
        margin: '50px auto'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {cards.map((content, index) => (
        <div
          key={index}
          className="absolute cursor-pointer select-none"
          style={{
            width: cardWidth,
            height: cardHeight,
            backgroundColor: getCardColor(index),
            borderRadius: `${borderRadius}px`,
            transition: `all ${animationSpeed}ms ease-out`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            ...getStackTransform(index, isHovered)
          }}
        >
          {content.trim()}
        </div>
      ))}
    </div>
  );
};
