/**
 * ASCII Text Animation Renderer
 * Converts text to ASCII art with animation effects
 */

import React, { useEffect, useState } from 'react';
import { ComponentRenderProps } from '../../../types/parametric';

export const ASCIITextRenderer: React.FC<ComponentRenderProps> = ({
  parameters,
  style,
  className,
  children
}) => {
  const [asciiText, setAsciiText] = useState('');
  const [animationFrame, setAnimationFrame] = useState(0);

  const {
    text = 'ASCII',
    asciiStyle = 'block',
    animationType = 'typewriter',
    animationSpeed = 100,
    fontSize = 12,
    fontFamily = 'monospace',
    color = '#00ff00',
    backgroundColor = '#000000',
    lineHeight = 1,
    animate = true,
    glowEffect = true
  } = parameters;

  // ASCII art patterns for different styles
  const asciiPatterns = {
    block: {
      'A': ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██', '██  ██'],
      'S': ['██████', '██    ', '██████', '    ██', '    ██', '██████'],
      'C': ['██████', '██    ', '██    ', '██    ', '██    ', '██████'],
      'I': ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '██████'],
      ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
    },
    thin: {
      'A': [' ▄▄ ', '▄  ▄', '████', '█  █', '█  █', '    '],
      'S': ['████', '█   ', '███ ', '  █ ', '  █ ', '███ '],
      'C': ['████', '█   ', '█   ', '█   ', '█   ', '████'],
      'I': ['████', ' ██ ', ' ██ ', ' ██ ', ' ██ ', '████'],
      ' ': ['    ', '    ', '    ', '    ', '    ', '    ']
    },
    dots: {
      'A': [' ●● ', '●  ●', '●●●●', '●  ●', '●  ●', '    '],
      'S': ['●●●●', '●   ', '●●● ', '  ● ', '  ● ', '●●● '],
      'C': ['●●●●', '●   ', '●   ', '●   ', '●   ', '●●●●'],
      'I': ['●●●●', ' ●● ', ' ●● ', ' ●● ', ' ●● ', '●●●●'],
      ' ': ['    ', '    ', '    ', '    ', '    ', '    ']
    }
  };

  const generateASCII = (inputText: string): string => {
    const pattern = asciiPatterns[asciiStyle as keyof typeof asciiPatterns] || asciiPatterns.block;
    const chars = inputText.toUpperCase().split('');
    const lines: string[] = ['', '', '', '', '', ''];

    chars.forEach(char => {
      const charPattern = pattern[char as keyof typeof pattern] || pattern[' '];
      charPattern.forEach((line, index) => {
        lines[index] += line + ' ';
      });
    });

    return lines.join('\n');
  };

  useEffect(() => {
    const fullASCII = generateASCII(text);
    
    if (!animate) {
      setAsciiText(fullASCII);
      return;
    }

    switch (animationType) {
      case 'typewriter':
        let currentLength = 0;
        const typewriterInterval = setInterval(() => {
          if (currentLength <= fullASCII.length) {
            setAsciiText(fullASCII.substring(0, currentLength));
            currentLength++;
          } else {
            clearInterval(typewriterInterval);
          }
        }, animationSpeed);
        return () => clearInterval(typewriterInterval);

      case 'fade':
        setAsciiText(fullASCII);
        break;

      case 'glitch':
        const glitchChars = '█▓▒░▄▀■□▪▫';
        let glitchCount = 0;
        const glitchInterval = setInterval(() => {
          if (glitchCount < 10) {
            const glitched = fullASCII.split('').map(char => 
              Math.random() < 0.3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
            ).join('');
            setAsciiText(glitched);
            glitchCount++;
          } else {
            setAsciiText(fullASCII);
            clearInterval(glitchInterval);
          }
        }, animationSpeed);
        return () => clearInterval(glitchInterval);

      case 'wave':
        const waveInterval = setInterval(() => {
          setAnimationFrame(prev => prev + 1);
        }, animationSpeed);
        return () => clearInterval(waveInterval);

      default:
        setAsciiText(fullASCII);
    }
  }, [text, asciiStyle, animationType, animationSpeed, animate]);

  useEffect(() => {
    if (animationType === 'wave') {
      const fullASCII = generateASCII(text);
      const lines = fullASCII.split('\n');
      const waveLines = lines.map((line, lineIndex) => {
        return line.split('').map((char, charIndex) => {
          const wave = Math.sin((animationFrame + charIndex + lineIndex) * 0.1);
          return wave > 0 ? char : (char === ' ' ? ' ' : '░');
        }).join('');
      });
      setAsciiText(waveLines.join('\n'));
    }
  }, [animationFrame, animationType, text]);

  const containerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    color: color,
    backgroundColor: backgroundColor,
    lineHeight: lineHeight,
    whiteSpace: 'pre',
    padding: '1rem',
    borderRadius: '4px',
    textShadow: glowEffect ? `0 0 10px ${color}` : 'none',
    overflow: 'auto',
    ...style
  };

  const handleRestart = () => {
    if (!animate) return;
    setAsciiText('');
    setAnimationFrame(0);
  };

  return (
    <div 
      className={`parametric-ascii-text ${className || ''}`}
      style={containerStyle}
      onClick={handleRestart}
    >
      {asciiText}
      {children}
    </div>
  );
};
