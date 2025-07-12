import React, { useState, useEffect } from 'react';

interface ModalRendererProps {
  title: string;
  content: string;
  showCloseButton: boolean;
  animationType: 'fade' | 'scale' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
  animationDuration: number;
  backdropBlur: number;
  modalWidth: string;
  modalHeight: string;
  borderRadius: number;
  backgroundColor: string;
  backdropColor: string;
  backdropOpacity: number;
  closeOnBackdropClick: boolean;
}

export const ModalRenderer: React.FC<ModalRendererProps> = ({
  title,
  content,
  showCloseButton,
  animationType,
  animationDuration,
  backdropBlur,
  modalWidth,
  modalHeight,
  borderRadius,
  backgroundColor,
  backdropColor,
  backdropOpacity,
  closeOnBackdropClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), animationDuration);
  };

  const closeModal = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, animationDuration);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      closeModal();
    }
  };

  const getModalAnimation = () => {
    const baseTransition = `all ${animationDuration}ms ease-out`;
    
    if (!isOpen) {
      switch (animationType) {
        case 'fade':
          return { opacity: 0, transition: baseTransition };
        case 'scale':
          return { opacity: 0, transform: 'scale(0.8)', transition: baseTransition };
        case 'slideUp':
          return { opacity: 0, transform: 'translateY(50px)', transition: baseTransition };
        case 'slideDown':
          return { opacity: 0, transform: 'translateY(-50px)', transition: baseTransition };
        case 'slideLeft':
          return { opacity: 0, transform: 'translateX(50px)', transition: baseTransition };
        case 'slideRight':
          return { opacity: 0, transform: 'translateX(-50px)', transition: baseTransition };
        default:
          return { opacity: 0, transition: baseTransition };
      }
    }

    return {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
      transition: baseTransition
    };
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Open Modal
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: `${backdropColor}${Math.round(backdropOpacity * 255).toString(16).padStart(2, '0')}`,
            backdropFilter: `blur(${backdropBlur}px)`,
            transition: `all ${animationDuration}ms ease-out`
          }}
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <div
            className="relative bg-white shadow-2xl max-w-full max-h-full overflow-auto"
            style={{
              width: modalWidth,
              height: modalHeight,
              borderRadius: `${borderRadius}px`,
              backgroundColor,
              ...getModalAnimation()
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isAnimating}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {content}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isAnimating}
              >
                Cancel
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={isAnimating}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
