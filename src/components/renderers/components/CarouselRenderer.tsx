import React, { useState, useEffect, useRef } from 'react';

interface CarouselRendererProps {
  items: string;
  itemType: 'image' | 'text' | 'mixed';
  showThumbnails: boolean;
  showArrows: boolean;
  showDots: boolean;
  autoPlay: boolean;
  autoPlaySpeed: number;
  transitionType: 'slide' | 'fade' | 'scale' | 'flip' | 'cube';
  transitionSpeed: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
  itemsPerView: number;
  spacing: number;
  height: string;
  width: string;
}

export const CarouselRenderer: React.FC<CarouselRendererProps> = ({
  items,
  itemType,
  showThumbnails,
  showArrows,
  showDots,
  autoPlay,
  autoPlaySpeed,
  transitionType,
  transitionSpeed,
  easing,
  itemsPerView,
  spacing,
  height,
  width
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const itemList = items.split(',').map(item => item.trim());
  const totalItems = itemList.length;

  // Auto play functionality
  useEffect(() => {
    if (autoPlay && totalItems > 1) {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, autoPlaySpeed);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlaySpeed, currentIndex]);

  const goToNext = () => {
    if (isTransitioning) return;
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setCurrentIndex(index);
  };

  const getTransitionStyle = () => {
    const baseTransition = `all ${transitionSpeed}ms ${easing}`;
    
    switch (transitionType) {
      case 'slide':
        return {
          transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          transition: baseTransition
        };
      case 'fade':
        return {
          opacity: 1,
          transition: baseTransition
        };
      case 'scale':
        return {
          transform: `scale(1)`,
          transition: baseTransition
        };
      default:
        return {
          transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          transition: baseTransition
        };
    }
  };

  const renderItem = (item: string, index: number) => {
    const isImage = itemType === 'image' || (itemType === 'mixed' && item.startsWith('http'));
    
    return (
      <div
        key={index}
        className="flex-shrink-0"
        style={{
          width: `calc(${100 / itemsPerView}% - ${spacing}px)`,
          marginRight: index < itemList.length - 1 ? `${spacing}px` : '0',
          height: '100%'
        }}
      >
        {isImage ? (
          <img
            src={item}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
            style={{ borderRadius: '8px' }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg"
            style={{ borderRadius: '8px' }}
          >
            <span className="text-lg font-semibold text-center px-4">
              {item}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="relative overflow-hidden"
      style={{ width, height }}
    >
      {/* Main carousel container */}
      <div 
        className="flex h-full"
        style={getTransitionStyle()}
        onTransitionStart={() => setIsTransitioning(true)}
        onTransitionEnd={() => setIsTransitioning(false)}
      >
        {itemList.map((item, index) => renderItem(item, index))}
      </div>

      {/* Navigation arrows */}
      {showArrows && totalItems > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            disabled={isTransitioning}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            disabled={isTransitioning}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {showDots && totalItems > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {itemList.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-70'
              }`}
              disabled={isTransitioning}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && totalItems > 1 && itemType === 'image' && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
          <div className="flex space-x-2 overflow-x-auto">
            {itemList.map((item, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex ? 'border-white' : 'border-transparent'
                }`}
                disabled={isTransitioning}
              >
                <img
                  src={item}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
