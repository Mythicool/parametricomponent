import React, { useState } from 'react';

interface TabsRendererProps {
  tabLabels: string;
  tabContents: string;
  defaultTab: number;
  tabStyle: 'underline' | 'pills' | 'buttons' | 'minimal' | 'cards';
  activeColor: string;
  inactiveColor: string;
  borderColor: string;
  animationType: 'slide' | 'fade' | 'scale' | 'none';
  animationSpeed: number;
  smoothTransition: boolean;
  tabPosition: 'top' | 'bottom' | 'left' | 'right';
  contentHeight: string;
  tabSpacing: number;
}

export const TabsRenderer: React.FC<TabsRendererProps> = ({
  tabLabels,
  tabContents,
  defaultTab,
  tabStyle,
  activeColor,
  inactiveColor,
  borderColor,
  animationType,
  animationSpeed,
  smoothTransition,
  tabPosition,
  contentHeight,
  tabSpacing
}) => {
  const labels = tabLabels.split(',').map(label => label.trim());
  const contents = tabContents.split(',').map(content => content.trim());
  const [activeTab, setActiveTab] = useState(Math.min(defaultTab, labels.length - 1));

  const getTabStyles = (index: number, isActive: boolean) => {
    const baseStyles = {
      padding: '12px 16px',
      cursor: 'pointer',
      transition: smoothTransition ? `all ${animationSpeed}ms ease-out` : 'none',
      marginRight: tabPosition === 'top' || tabPosition === 'bottom' ? `${tabSpacing}px` : '0',
      marginBottom: tabPosition === 'left' || tabPosition === 'right' ? `${tabSpacing}px` : '0',
      color: isActive ? activeColor : inactiveColor,
      userSelect: 'none' as const
    };

    switch (tabStyle) {
      case 'underline':
        return {
          ...baseStyles,
          borderBottom: isActive ? `2px solid ${activeColor}` : `2px solid transparent`,
          backgroundColor: 'transparent'
        };
      case 'pills':
        return {
          ...baseStyles,
          borderRadius: '20px',
          backgroundColor: isActive ? activeColor : 'transparent',
          color: isActive ? 'white' : inactiveColor
        };
      case 'buttons':
        return {
          ...baseStyles,
          borderRadius: '6px',
          border: `1px solid ${isActive ? activeColor : borderColor}`,
          backgroundColor: isActive ? activeColor : 'transparent',
          color: isActive ? 'white' : inactiveColor
        };
      case 'minimal':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          fontWeight: isActive ? '600' : '400'
        };
      case 'cards':
        return {
          ...baseStyles,
          borderRadius: '8px 8px 0 0',
          border: `1px solid ${borderColor}`,
          borderBottom: isActive ? 'none' : `1px solid ${borderColor}`,
          backgroundColor: isActive ? 'white' : '#f9fafb',
          marginBottom: isActive ? '0' : '-1px'
        };
      default:
        return baseStyles;
    }
  };

  const getContentAnimation = () => {
    if (!smoothTransition || animationType === 'none') {
      return {};
    }

    const transition = `all ${animationSpeed}ms ease-out`;

    switch (animationType) {
      case 'fade':
        return { transition, opacity: 1 };
      case 'scale':
        return { transition, transform: 'scale(1)', opacity: 1 };
      case 'slide':
        return { transition, transform: 'translateX(0)', opacity: 1 };
      default:
        return { transition };
    }
  };

  const getContainerLayout = () => {
    switch (tabPosition) {
      case 'bottom':
        return 'flex-col-reverse';
      case 'left':
        return 'flex-row';
      case 'right':
        return 'flex-row-reverse';
      default:
        return 'flex-col';
    }
  };

  const getTabsLayout = () => {
    switch (tabPosition) {
      case 'left':
      case 'right':
        return 'flex-col';
      default:
        return 'flex-row';
    }
  };

  return (
    <div className={`flex ${getContainerLayout()}`} style={{ width: '100%' }}>
      {/* Tab Navigation */}
      <div 
        className={`flex ${getTabsLayout()}`}
        style={{
          borderBottom: (tabPosition === 'top' && tabStyle !== 'cards') ? `1px solid ${borderColor}` : 'none',
          borderTop: (tabPosition === 'bottom' && tabStyle !== 'cards') ? `1px solid ${borderColor}` : 'none',
          borderRight: (tabPosition === 'left' && tabStyle !== 'cards') ? `1px solid ${borderColor}` : 'none',
          borderLeft: (tabPosition === 'right' && tabStyle !== 'cards') ? `1px solid ${borderColor}` : 'none',
        }}
      >
        {labels.map((label, index) => (
          <div
            key={index}
            style={getTabStyles(index, activeTab === index)}
            onClick={() => setActiveTab(index)}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="flex-1 p-4"
        style={{
          height: contentHeight,
          border: tabStyle === 'cards' ? `1px solid ${borderColor}` : 'none',
          borderTop: (tabPosition === 'top' && tabStyle === 'cards') ? 'none' : undefined,
          borderBottom: (tabPosition === 'bottom' && tabStyle === 'cards') ? 'none' : undefined,
          borderLeft: (tabPosition === 'left' && tabStyle === 'cards') ? 'none' : undefined,
          borderRight: (tabPosition === 'right' && tabStyle === 'cards') ? 'none' : undefined,
          borderRadius: tabStyle === 'cards' ? '0 8px 8px 8px' : '0',
          backgroundColor: tabStyle === 'cards' ? 'white' : 'transparent',
          ...getContentAnimation()
        }}
      >
        <div key={activeTab} style={getContentAnimation()}>
          {contents[activeTab] || `Content for ${labels[activeTab]}`}
        </div>
      </div>
    </div>
  );
};
