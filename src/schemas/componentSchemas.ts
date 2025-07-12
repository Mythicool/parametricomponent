/**
 * Component Schema Definitions
 * Defines all available components with their parameters and presets
 */

import { ComponentSchema, ComponentCategory } from '../types/parametric';
import {
  textTrailSchema,
  fallingTextSchema,
  scrollRevealSchema,
  trueFocusSchema,
  scrollFloatSchema,
  scrollVelocitySchema,
  variableProximitySchema,
  glareHoverSchema,
  rippleEffectSchema,
  parallaxScrollSchema,
  pixelTrailSchema,
  cubesSchema,
  metaBallsSchema,
  blobCursorSchema,
  starBorderSchema,
  metallicPaintSchema,
  noiseSchema,
  crosshairSchema,
  imageTrailSchema,
  ribbonsSchema,
  splashCursorSchema,
  animatedListSchema,
  dockSchema,
  fluidGlassSchema,
  tiltedCardSchema,
  auroraSchema,
  particlesSchema,
  wavesSchema,
  silkSchema,
  beamsSchema,
  gridSchema,
  stackSchema,
  carouselSchema,
  modalSchema,
  tabsSchema
} from './additionalSchemas';

// Helper function to create schema
const createSchema = (
  id: string,
  name: string,
  category: ComponentCategory,
  description: string,
  groups: Record<string, string[]>,
  parameters: any,
  presets: any[] = []
): ComponentSchema => ({
  id,
  name,
  category,
  description,
  version: '1.0.0',
  groups,
  parameters,
  presets,
  responsive: {
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1440
    },
    parameters: {}
  }
});

// Hero Component Schema
export const heroSchema = createSchema(
  'hero',
  'Hero Section',
  'layout',
  'A customizable hero section with gradient backgrounds and typography controls',
  {
    'Visual': ['backgroundColor', 'textColor', 'opacity', 'gradient', 'shadowIntensity'],
    'Typography': ['fontSize'],
    'Layout': ['padding', 'spacing', 'layout'],
    'Effects': ['borderRadius', 'animationDuration']
  },
  {
    backgroundColor: { 
      type: 'color', 
      default: '#1a1a2e', 
      description: 'Background color',
      group: 'Visual'
    },
    textColor: { 
      type: 'color', 
      default: '#ffffff', 
      description: 'Text color',
      group: 'Visual'
    },
    fontSize: { 
      type: 'slider', 
      min: 24, 
      max: 72, 
      default: 48, 
      unit: 'px', 
      description: 'Font size',
      group: 'Typography'
    },
    padding: { 
      type: 'slider', 
      min: 20, 
      max: 100, 
      default: 60, 
      unit: 'px', 
      description: 'Internal padding',
      group: 'Layout'
    },
    borderRadius: { 
      type: 'slider', 
      min: 0, 
      max: 50, 
      default: 12, 
      unit: 'px', 
      description: 'Corner radius',
      group: 'Effects'
    },
    animationDuration: { 
      type: 'slider', 
      min: 100, 
      max: 2000, 
      default: 1000, 
      unit: 'ms', 
      description: 'Animation duration',
      group: 'Effects'
    },
    opacity: { 
      type: 'slider', 
      min: 0, 
      max: 1, 
      step: 0.1, 
      default: 1, 
      description: 'Opacity',
      group: 'Visual'
    },
    spacing: { 
      type: 'slider', 
      min: 8, 
      max: 48, 
      default: 24, 
      unit: 'px', 
      description: 'Element spacing',
      group: 'Layout'
    },
    layout: { 
      type: 'dropdown', 
      options: ['left', 'center', 'right'], 
      default: 'center', 
      description: 'Text alignment',
      group: 'Layout'
    },
    gradient: { 
      type: 'toggle', 
      default: true, 
      description: 'Enable gradient',
      group: 'Visual'
    },
    shadowIntensity: { 
      type: 'slider', 
      min: 0, 
      max: 1, 
      step: 0.1, 
      default: 0.3, 
      description: 'Shadow intensity',
      group: 'Visual'
    }
  },
  [
    {
      id: 'hero_modern_dark',
      name: 'Modern Dark',
      description: 'Dark theme with blue gradient',
      category: 'layout',
      componentType: 'hero',
      parameters: {
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
        fontSize: 56,
        gradient: true,
        shadowIntensity: 0.4
      },
      metadata: {
        author: 'Parametric System',
        version: '1.0.0',
        tags: ['dark', 'modern', 'gradient'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  ]
);

// Button Component Schema
export const buttonSchema = createSchema(
  'button',
  'Button',
  'interactive',
  'Interactive button with hover effects and multiple variants',
  {
    'Visual': ['backgroundColor', 'textColor', 'variant', 'shadow'],
    'Typography': ['fontSize'],
    'Layout': ['padding', 'width', 'borderRadius'],
    'Effects': ['hoverScale', 'animationDuration']
  },
  {
    backgroundColor: { 
      type: 'color', 
      default: '#4f46e5', 
      description: 'Button background',
      group: 'Visual'
    },
    textColor: { 
      type: 'color', 
      default: '#ffffff', 
      description: 'Button text color',
      group: 'Visual'
    },
    fontSize: { 
      type: 'slider', 
      min: 12, 
      max: 24, 
      default: 16, 
      unit: 'px', 
      description: 'Font size',
      group: 'Typography'
    },
    padding: { 
      type: 'slider', 
      min: 8, 
      max: 32, 
      default: 16, 
      unit: 'px', 
      description: 'Button padding',
      group: 'Layout'
    },
    borderRadius: { 
      type: 'slider', 
      min: 0, 
      max: 24, 
      default: 8, 
      unit: 'px', 
      description: 'Corner radius',
      group: 'Layout'
    },
    hoverScale: { 
      type: 'slider', 
      min: 1, 
      max: 1.2, 
      step: 0.05, 
      default: 1.05, 
      description: 'Hover scale effect',
      group: 'Effects'
    },
    animationDuration: { 
      type: 'slider', 
      min: 100, 
      max: 800, 
      default: 300, 
      unit: 'ms', 
      description: 'Animation duration',
      group: 'Effects'
    },
    width: { 
      type: 'slider', 
      min: 100, 
      max: 300, 
      default: 180, 
      unit: 'px', 
      description: 'Button width',
      group: 'Layout'
    },
    shadow: { 
      type: 'toggle', 
      default: true, 
      description: 'Drop shadow',
      group: 'Visual'
    },
    variant: { 
      type: 'dropdown', 
      options: ['filled', 'outlined', 'ghost'], 
      default: 'filled', 
      description: 'Button variant',
      group: 'Visual'
    }
  }
);

// Blur Text Schema
export const blurTextSchema = createSchema(
  'blur-text',
  'Blur Text Animation',
  'textAnimations',
  'Text that animates from blurred to sharp focus',
  {
    'Content': ['text'],
    'Typography': ['fontSize', 'fontWeight', 'color', 'letterSpacing', 'lineHeight'],
    'Animation': ['blurAmount', 'animationDuration', 'animationDelay', 'triggerOnMount']
  },
  {
    text: { 
      type: 'text', 
      default: 'Blur Text Animation', 
      description: 'Text content',
      group: 'Content'
    },
    fontSize: { 
      type: 'slider', 
      min: 12, 
      max: 72, 
      default: 32, 
      unit: 'px', 
      description: 'Font size',
      group: 'Typography'
    },
    fontWeight: { 
      type: 'slider', 
      min: 100, 
      max: 900, 
      step: 100, 
      default: 600, 
      description: 'Font weight',
      group: 'Typography'
    },
    color: { 
      type: 'color', 
      default: '#000000', 
      description: 'Text color',
      group: 'Typography'
    },
    blurAmount: { 
      type: 'slider', 
      min: 0, 
      max: 20, 
      default: 10, 
      unit: 'px', 
      description: 'Initial blur amount',
      group: 'Animation'
    },
    animationDuration: { 
      type: 'slider', 
      min: 200, 
      max: 3000, 
      default: 1000, 
      unit: 'ms', 
      description: 'Animation duration',
      group: 'Animation'
    },
    animationDelay: { 
      type: 'slider', 
      min: 0, 
      max: 2000, 
      default: 0, 
      unit: 'ms', 
      description: 'Animation delay',
      group: 'Animation'
    },
    triggerOnMount: { 
      type: 'toggle', 
      default: true, 
      description: 'Trigger animation on mount',
      group: 'Animation'
    },
    letterSpacing: { 
      type: 'slider', 
      min: -2, 
      max: 10, 
      step: 0.1, 
      default: 0, 
      unit: 'px', 
      description: 'Letter spacing',
      group: 'Typography'
    },
    lineHeight: { 
      type: 'slider', 
      min: 0.8, 
      max: 2, 
      step: 0.1, 
      default: 1.2, 
      description: 'Line height',
      group: 'Typography'
    }
  }
);

// Split Text Schema - Updated with comprehensive props matching the reference
export const splitTextSchema = createSchema(
  'split-text',
  'Split Text Animation',
  'textAnimations',
  'Text that animates character by character with various effects',
  {
    'Content': ['text', 'textAlign'],
    'Animation': ['delay', 'duration', 'ease', 'splitType', 'threshold'],
    'Effects': ['fromOpacity', 'fromY', 'toOpacity', 'toY'],
    'Layout': ['rootMargin', 'showCompletionToast']
  },
  {
    text: {
      type: 'text',
      default: 'Hello, yo',
      description: 'The text content to animate',
      group: 'Content'
    },
    delay: {
      type: 'slider',
      min: 10,
      max: 1000,
      default: 100,
      unit: 'ms',
      description: 'Delay between animations for each letter (in ms)',
      group: 'Animation'
    },
    duration: {
      type: 'slider',
      min: 0.1,
      max: 5,
      step: 0.1,
      default: 0.6,
      unit: 's',
      description: 'Duration of each letter animation (in seconds)',
      group: 'Animation'
    },
    ease: {
      type: 'dropdown',
      options: ['elastic.out(1, 0.3)', 'power3.out', 'power2.out', 'back.out(1.7)', 'bounce.out'],
      default: 'elastic.out(1, 0.3)',
      description: 'GSAP easing function for the animation',
      group: 'Animation'
    },
    splitType: {
      type: 'dropdown',
      options: ['chars', 'words', 'lines', 'words, chars'],
      default: 'chars',
      description: 'Split type: chars, words, lines, or words, chars',
      group: 'Animation'
    },
    fromOpacity: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0,
      description: 'Initial opacity for each letter/word',
      group: 'Effects'
    },
    fromY: {
      type: 'slider',
      min: -100,
      max: 100,
      default: 40,
      unit: 'px',
      description: 'Initial Y position offset',
      group: 'Effects'
    },
    toOpacity: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.1,
      default: 1,
      description: 'Target opacity for each letter/word',
      group: 'Effects'
    },
    toY: {
      type: 'slider',
      min: -100,
      max: 100,
      default: 0,
      unit: 'px',
      description: 'Target Y position',
      group: 'Effects'
    },
    threshold: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.1,
      description: 'Intersection threshold to trigger the animation (0-1)',
      group: 'Animation'
    },
    rootMargin: {
      type: 'text',
      default: '-100px',
      description: 'Root margin for the ScrollTrigger',
      group: 'Layout'
    },
    textAlign: {
      type: 'dropdown',
      options: ['left', 'center', 'right', 'justify'],
      default: 'center',
      description: 'Text alignment',
      group: 'Content'
    },
    showCompletionToast: {
      type: 'toggle',
      default: false,
      description: 'Show completion toast when animation finishes',
      group: 'Layout'
    }
  }
);

// Circular Text Schema
export const circularTextSchema = createSchema(
  'circular-text',
  'Circular Text Animation',
  'textAnimations',
  'Text arranged in a circular pattern with rotation animation',
  {
    'Content': ['text'],
    'Typography': ['fontSize', 'fontWeight', 'color', 'letterSpacing'],
    'Layout': ['radius', 'startAngle'],
    'Animation': ['rotationSpeed', 'animationDirection', 'animate']
  },
  {
    text: {
      type: 'text',
      default: 'CIRCULAR TEXT ANIMATION • ',
      description: 'Text content (repeating)',
      group: 'Content'
    },
    fontSize: {
      type: 'slider',
      min: 8,
      max: 32,
      default: 16,
      unit: 'px',
      description: 'Font size',
      group: 'Typography'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 500,
      description: 'Font weight',
      group: 'Typography'
    },
    color: {
      type: 'color',
      default: '#000000',
      description: 'Text color',
      group: 'Typography'
    },
    radius: {
      type: 'slider',
      min: 50,
      max: 300,
      default: 100,
      unit: 'px',
      description: 'Circle radius',
      group: 'Layout'
    },
    rotationSpeed: {
      type: 'slider',
      min: 5,
      max: 120,
      default: 30,
      unit: 'deg/s',
      description: 'Rotation speed',
      group: 'Animation'
    },
    animationDirection: {
      type: 'dropdown',
      options: ['clockwise', 'counterclockwise'],
      default: 'clockwise',
      description: 'Rotation direction',
      group: 'Animation'
    },
    letterSpacing: {
      type: 'slider',
      min: 0,
      max: 10,
      default: 2,
      unit: 'px',
      description: 'Letter spacing',
      group: 'Typography'
    },
    startAngle: {
      type: 'slider',
      min: 0,
      max: 360,
      default: 0,
      unit: 'deg',
      description: 'Starting angle',
      group: 'Layout'
    },
    animate: {
      type: 'toggle',
      default: true,
      description: 'Enable rotation animation',
      group: 'Animation'
    }
  }
);

// Text Pressure Schema
export const textPressureSchema = createSchema(
  'text-pressure',
  'Text Pressure Animation',
  'textAnimations',
  'Text with pressure-sensitive animation effects',
  {
    'Content': ['text'],
    'Typography': ['fontSize', 'fontWeight', 'color'],
    'Pressure': ['pressureColor', 'maxPressure', 'pressureSensitivity'],
    'Effects': ['scaleEffect', 'colorEffect', 'animationDuration']
  },
  {
    text: { type: 'text', default: 'Press Me', description: 'Text content', group: 'Content' },
    fontSize: { type: 'slider', min: 16, max: 72, default: 48, unit: 'px', description: 'Font size', group: 'Typography' },
    fontWeight: { type: 'slider', min: 100, max: 900, step: 100, default: 700, description: 'Font weight', group: 'Typography' },
    color: { type: 'color', default: '#ffffff', description: 'Base text color', group: 'Typography' },
    pressureColor: { type: 'color', default: '#ff6b6b', description: 'Pressure color', group: 'Pressure' },
    maxPressure: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 1, description: 'Maximum pressure', group: 'Pressure' },
    pressureSensitivity: { type: 'slider', min: 0.5, max: 5, step: 0.1, default: 2, description: 'Pressure sensitivity', group: 'Pressure' },
    scaleEffect: { type: 'toggle', default: true, description: 'Enable scale effect', group: 'Effects' },
    colorEffect: { type: 'toggle', default: true, description: 'Enable color effect', group: 'Effects' },
    animationDuration: { type: 'slider', min: 100, max: 1000, default: 300, unit: 'ms', description: 'Animation duration', group: 'Effects' }
  }
);

// Curved Loop Schema
export const curvedLoopSchema = createSchema(
  'curved-loop',
  'Curved Loop Text Animation',
  'textAnimations',
  'Text that follows a curved path with looping animation',
  {
    'Content': ['text'],
    'Typography': ['fontSize', 'fontWeight', 'color'],
    'Path': ['pathRadius', 'curveIntensity'],
    'Animation': ['loopSpeed', 'direction', 'animate']
  },
  {
    text: { type: 'text', default: 'Curved Loop Text', description: 'Text content', group: 'Content' },
    fontSize: { type: 'slider', min: 12, max: 48, default: 24, unit: 'px', description: 'Font size', group: 'Typography' },
    fontWeight: { type: 'slider', min: 100, max: 900, step: 100, default: 600, description: 'Font weight', group: 'Typography' },
    color: { type: 'color', default: '#ffffff', description: 'Text color', group: 'Typography' },
    pathRadius: { type: 'slider', min: 50, max: 300, default: 150, unit: 'px', description: 'Path radius', group: 'Path' },
    curveIntensity: { type: 'slider', min: 0, max: 2, step: 0.1, default: 0.5, description: 'Curve intensity', group: 'Path' },
    loopSpeed: { type: 'slider', min: 0.1, max: 5, step: 0.1, default: 1, description: 'Loop speed', group: 'Animation' },
    direction: { type: 'dropdown', options: ['clockwise', 'counterclockwise'], default: 'clockwise', description: 'Direction', group: 'Animation' },
    animate: { type: 'toggle', default: true, description: 'Enable animation', group: 'Animation' }
  }
);

// Animated Content Schema
export const animatedContentSchema = createSchema(
  'animated-content',
  'Animated Content',
  'animations',
  'Content with various entrance and exit animations',
  {
    'Animation': ['animationType', 'animationDuration', 'animationDelay', 'easing'],
    'Transform': ['scale', 'rotation', 'translateX', 'translateY'],
    'Behavior': ['triggerOnMount', 'autoReverse', 'reverseDelay']
  },
  {
    animationType: {
      type: 'dropdown',
      options: ['fadeIn', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown', 'scaleIn', 'rotateIn', 'bounceIn', 'flipIn'],
      default: 'fadeIn',
      description: 'Type of entrance animation',
      group: 'Animation'
    },
    animationDuration: {
      type: 'slider',
      min: 100,
      max: 3000,
      default: 1000,
      unit: 'ms',
      description: 'Animation duration',
      group: 'Animation'
    },
    animationDelay: {
      type: 'slider',
      min: 0,
      max: 2000,
      default: 0,
      unit: 'ms',
      description: 'Animation delay',
      group: 'Animation'
    },
    easing: {
      type: 'dropdown',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
      default: 'ease-out',
      description: 'Animation easing function',
      group: 'Animation'
    },
    scale: {
      type: 'slider',
      min: 0.1,
      max: 2,
      step: 0.1,
      default: 1,
      description: 'Scale transform',
      group: 'Transform'
    },
    rotation: {
      type: 'slider',
      min: -360,
      max: 360,
      default: 0,
      unit: 'deg',
      description: 'Rotation transform',
      group: 'Transform'
    },
    translateX: {
      type: 'slider',
      min: -200,
      max: 200,
      default: 0,
      unit: 'px',
      description: 'X translation',
      group: 'Transform'
    },
    translateY: {
      type: 'slider',
      min: -200,
      max: 200,
      default: 0,
      unit: 'px',
      description: 'Y translation',
      group: 'Transform'
    },
    triggerOnMount: {
      type: 'toggle',
      default: true,
      description: 'Trigger animation on mount',
      group: 'Behavior'
    },
    autoReverse: {
      type: 'toggle',
      default: false,
      description: 'Automatically reverse animation',
      group: 'Behavior'
    },
    reverseDelay: {
      type: 'slider',
      min: 500,
      max: 5000,
      default: 2000,
      unit: 'ms',
      description: 'Delay before reverse',
      group: 'Behavior'
    }
  }
);

// Magnet Lines Schema
export const magnetLinesSchema = createSchema(
  'magnet-lines',
  'Magnet Lines Animation',
  'animations',
  'Magnetic line effects that follow mouse movement',
  {
    'Lines': ['lineCount', 'lineColor', 'lineWidth', 'opacity'],
    'Physics': ['magnetStrength', 'maxDistance', 'animationSpeed'],
    'Layout': ['followMouse', 'height']
  },
  {
    lineCount: {
      type: 'slider',
      min: 5,
      max: 50,
      default: 20,
      description: 'Number of lines',
      group: 'Lines'
    },
    lineColor: {
      type: 'color',
      default: '#3b82f6',
      description: 'Line color',
      group: 'Lines'
    },
    lineWidth: {
      type: 'slider',
      min: 1,
      max: 10,
      default: 2,
      unit: 'px',
      description: 'Line width',
      group: 'Lines'
    },
    opacity: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.6,
      description: 'Line opacity',
      group: 'Lines'
    },
    magnetStrength: {
      type: 'slider',
      min: 10,
      max: 200,
      default: 100,
      description: 'Magnetic attraction strength',
      group: 'Physics'
    },
    maxDistance: {
      type: 'slider',
      min: 50,
      max: 400,
      default: 200,
      unit: 'px',
      description: 'Maximum attraction distance',
      group: 'Physics'
    },
    animationSpeed: {
      type: 'slider',
      min: 0.01,
      max: 0.5,
      step: 0.01,
      default: 0.1,
      description: 'Animation speed',
      group: 'Physics'
    },
    followMouse: {
      type: 'toggle',
      default: true,
      description: 'Follow mouse movement',
      group: 'Layout'
    },
    height: {
      type: 'text',
      default: '400px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Click Spark Schema
export const clickSparkSchema = createSchema(
  'click-spark',
  'Click Spark Animation',
  'animations',
  'Creates spark effects on click interactions',
  {
    'Sparks': ['sparkCount', 'sparkColors', 'sparkSize', 'sparkLife'],
    'Physics': ['sparkSpeed', 'gravity', 'friction'],
    'Layout': ['height']
  },
  {
    sparkCount: {
      type: 'slider',
      min: 5,
      max: 30,
      default: 15,
      description: 'Number of sparks per click',
      group: 'Sparks'
    },
    sparkColors: {
      type: 'text',
      default: '#ff6b6b,#4ecdc4,#45b7d1,#feca57',
      description: 'Spark colors (comma-separated)',
      group: 'Sparks'
    },
    sparkSize: {
      type: 'slider',
      min: 2,
      max: 10,
      default: 4,
      unit: 'px',
      description: 'Spark size',
      group: 'Sparks'
    },
    sparkLife: {
      type: 'slider',
      min: 500,
      max: 3000,
      default: 1000,
      unit: 'ms',
      description: 'Spark lifetime',
      group: 'Sparks'
    },
    sparkSpeed: {
      type: 'slider',
      min: 1,
      max: 10,
      default: 5,
      description: 'Initial spark speed',
      group: 'Physics'
    },
    gravity: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.2,
      description: 'Gravity effect',
      group: 'Physics'
    },
    friction: {
      type: 'slider',
      min: 0.9,
      max: 1,
      step: 0.01,
      default: 0.98,
      description: 'Air friction',
      group: 'Physics'
    },
    height: {
      type: 'text',
      default: '400px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Magnet Schema
export const magnetSchema = createSchema(
  'magnet',
  'Magnet Animation',
  'animations',
  'Creates magnetic attraction effects for elements',
  {
    'Physics': ['magnetStrength', 'maxDistance', 'returnSpeed'],
    'Effects': ['scaleEffect', 'rotationEffect', 'enableRotation', 'enableScale'],
    'Animation': ['animationDuration']
  },
  {
    magnetStrength: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.3,
      description: 'Magnetic attraction strength',
      group: 'Physics'
    },
    maxDistance: {
      type: 'slider',
      min: 50,
      max: 300,
      default: 100,
      unit: 'px',
      description: 'Maximum attraction distance',
      group: 'Physics'
    },
    returnSpeed: {
      type: 'slider',
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.15,
      description: 'Return to origin speed',
      group: 'Physics'
    },
    scaleEffect: {
      type: 'slider',
      min: 1,
      max: 2,
      step: 0.05,
      default: 1.05,
      description: 'Scale on hover',
      group: 'Effects'
    },
    rotationEffect: {
      type: 'slider',
      min: 0,
      max: 20,
      default: 5,
      unit: 'deg',
      description: 'Rotation intensity',
      group: 'Effects'
    },
    enableRotation: {
      type: 'toggle',
      default: true,
      description: 'Enable rotation effect',
      group: 'Effects'
    },
    enableScale: {
      type: 'toggle',
      default: true,
      description: 'Enable scale effect',
      group: 'Effects'
    },
    animationDuration: {
      type: 'slider',
      min: 100,
      max: 1000,
      default: 300,
      unit: 'ms',
      description: 'Animation duration',
      group: 'Animation'
    }
  }
);

// Floating Elements Schema
export const floatingElementsSchema = createSchema(
  'floating-elements',
  'Floating Elements Animation',
  'animations',
  'Physics-based floating elements with collision detection',
  {
    'Elements': ['elementCount', 'elementColors', 'minSize', 'maxSize', 'opacity'],
    'Physics': ['speed', 'gravity', 'bounce', 'rotationSpeed'],
    'Layout': ['animate', 'height']
  },
  {
    elementCount: {
      type: 'slider',
      min: 5,
      max: 50,
      default: 20,
      description: 'Number of floating elements',
      group: 'Elements'
    },
    elementColors: {
      type: 'text',
      default: '#3b82f6,#8b5cf6,#06b6d4,#10b981,#f59e0b',
      description: 'Element colors (comma-separated)',
      group: 'Elements'
    },
    minSize: {
      type: 'slider',
      min: 2,
      max: 20,
      default: 4,
      unit: 'px',
      description: 'Minimum element size',
      group: 'Elements'
    },
    maxSize: {
      type: 'slider',
      min: 5,
      max: 30,
      default: 12,
      unit: 'px',
      description: 'Maximum element size',
      group: 'Elements'
    },
    opacity: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.7,
      description: 'Element opacity',
      group: 'Elements'
    },
    speed: {
      type: 'slider',
      min: 0.1,
      max: 5,
      step: 0.1,
      default: 1,
      description: 'Movement speed',
      group: 'Physics'
    },
    gravity: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.1,
      description: 'Gravity effect',
      group: 'Physics'
    },
    bounce: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.8,
      description: 'Bounce factor',
      group: 'Physics'
    },
    rotationSpeed: {
      type: 'slider',
      min: 0,
      max: 10,
      default: 2,
      description: 'Rotation speed',
      group: 'Physics'
    },
    animate: {
      type: 'toggle',
      default: true,
      description: 'Enable animation',
      group: 'Layout'
    },
    height: {
      type: 'text',
      default: '400px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Morphing Shapes Schema
export const morphingShapesSchema = createSchema(
  'morphing-shapes',
  'Morphing Shapes Animation',
  'animations',
  'Smooth morphing transitions between different shapes',
  {
    'Shapes': ['shapes', 'shapeSize', 'shapeColor', 'strokeWidth'],
    'Animation': ['morphDuration', 'holdDuration', 'animate', 'smoothTransition']
  },
  {
    shapes: {
      type: 'text',
      default: 'circle,square,triangle,star,heart',
      description: 'Shape sequence (comma-separated)',
      group: 'Shapes'
    },
    shapeSize: {
      type: 'slider',
      min: 50,
      max: 200,
      default: 100,
      unit: 'px',
      description: 'Shape size',
      group: 'Shapes'
    },
    shapeColor: {
      type: 'color',
      default: '#3b82f6',
      description: 'Shape color',
      group: 'Shapes'
    },
    strokeWidth: {
      type: 'slider',
      min: 1,
      max: 10,
      default: 2,
      unit: 'px',
      description: 'Stroke width',
      group: 'Shapes'
    },
    morphDuration: {
      type: 'slider',
      min: 500,
      max: 5000,
      default: 2000,
      unit: 'ms',
      description: 'Morphing duration',
      group: 'Animation'
    },
    holdDuration: {
      type: 'slider',
      min: 200,
      max: 3000,
      default: 1000,
      unit: 'ms',
      description: 'Hold duration',
      group: 'Animation'
    },
    animate: {
      type: 'toggle',
      default: true,
      description: 'Enable animation',
      group: 'Animation'
    },
    smoothTransition: {
      type: 'toggle',
      default: true,
      description: 'Smooth easing',
      group: 'Animation'
    }
  }
);

// Shiny Text Schema
export const shinyTextSchema = createSchema(
  'shiny-text',
  'Shiny Text Animation',
  'textAnimations',
  'Moving shine effect across text',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color', 'fontFamily'],
    'Shine': ['shineColor', 'shineWidth', 'shineDuration', 'shineDelay'],
    'Animation': ['animate', 'loop']
  },
  {
    text: {
      type: 'text',
      default: 'Shiny Text',
      description: 'Text to display',
      group: 'Content'
    },
    fontSize: {
      type: 'slider',
      min: 12,
      max: 72,
      default: 32,
      unit: 'px',
      description: 'Font size',
      group: 'Content'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 600,
      description: 'Font weight',
      group: 'Content'
    },
    color: {
      type: 'color',
      default: '#333333',
      description: 'Text color',
      group: 'Content'
    },
    shineColor: {
      type: 'color',
      default: '#ffffff',
      description: 'Shine color',
      group: 'Shine'
    },
    shineWidth: {
      type: 'slider',
      min: 10,
      max: 100,
      default: 30,
      unit: 'px',
      description: 'Shine width',
      group: 'Shine'
    },
    shineDuration: {
      type: 'slider',
      min: 500,
      max: 3000,
      default: 1500,
      unit: 'ms',
      description: 'Shine duration',
      group: 'Shine'
    },
    shineDelay: {
      type: 'slider',
      min: 0,
      max: 2000,
      default: 500,
      unit: 'ms',
      description: 'Delay between shines',
      group: 'Shine'
    },
    animate: {
      type: 'toggle',
      default: true,
      description: 'Enable animation',
      group: 'Animation'
    },
    loop: {
      type: 'toggle',
      default: true,
      description: 'Loop animation',
      group: 'Animation'
    }
  }
);

// Gradient Text Schema
export const gradientTextSchema = createSchema(
  'gradient-text',
  'Gradient Text Animation',
  'textAnimations',
  'Animated gradient text effects',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'fontFamily'],
    'Gradient': ['gradientColors', 'gradientDirection', 'animateGradient'],
    'Animation': ['animationSpeed', 'animate']
  },
  {
    text: {
      type: 'text',
      default: 'Gradient Text',
      description: 'Text to display',
      group: 'Content'
    },
    fontSize: {
      type: 'slider',
      min: 12,
      max: 72,
      default: 32,
      unit: 'px',
      description: 'Font size',
      group: 'Content'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 700,
      description: 'Font weight',
      group: 'Content'
    },
    gradientColors: {
      type: 'text',
      default: '#3b82f6,#8b5cf6,#06b6d4',
      description: 'Gradient colors (comma-separated)',
      group: 'Gradient'
    },
    gradientDirection: {
      type: 'slider',
      min: 0,
      max: 360,
      default: 45,
      unit: 'deg',
      description: 'Gradient direction',
      group: 'Gradient'
    },
    animateGradient: {
      type: 'toggle',
      default: true,
      description: 'Animate gradient',
      group: 'Gradient'
    },
    animationSpeed: {
      type: 'slider',
      min: 1,
      max: 10,
      default: 3,
      description: 'Animation speed',
      group: 'Animation'
    },
    animate: {
      type: 'toggle',
      default: true,
      description: 'Enable animation',
      group: 'Animation'
    }
  }
);

// Text Cursor Schema
export const textCursorSchema = createSchema(
  'text-cursor',
  'Text Cursor Animation',
  'textAnimations',
  'Typewriter effect with animated cursor',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color', 'fontFamily'],
    'Cursor': ['cursorChar', 'cursorColor', 'cursorBlinkSpeed'],
    'Animation': ['typeSpeed', 'deleteSpeed', 'pauseDuration', 'loop', 'autoStart']
  },
  {
    text: {
      type: 'text',
      default: 'Typewriter Effect',
      description: 'Text to type',
      group: 'Content'
    },
    typeSpeed: {
      type: 'slider',
      min: 50,
      max: 500,
      default: 100,
      unit: 'ms',
      description: 'Typing speed',
      group: 'Animation'
    },
    deleteSpeed: {
      type: 'slider',
      min: 25,
      max: 200,
      default: 50,
      unit: 'ms',
      description: 'Delete speed',
      group: 'Animation'
    },
    pauseDuration: {
      type: 'slider',
      min: 500,
      max: 5000,
      default: 2000,
      unit: 'ms',
      description: 'Pause duration',
      group: 'Animation'
    },
    cursorChar: {
      type: 'text',
      default: '|',
      description: 'Cursor character',
      group: 'Cursor'
    },
    cursorBlinkSpeed: {
      type: 'slider',
      min: 100,
      max: 1000,
      default: 500,
      unit: 'ms',
      description: 'Cursor blink speed',
      group: 'Cursor'
    },
    loop: {
      type: 'toggle',
      default: true,
      description: 'Loop animation',
      group: 'Animation'
    },
    autoStart: {
      type: 'toggle',
      default: true,
      description: 'Auto start animation',
      group: 'Animation'
    },
    fontSize: {
      type: 'slider',
      min: 12,
      max: 72,
      default: 32,
      unit: 'px',
      description: 'Font size',
      group: 'Content'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 600,
      description: 'Font weight',
      group: 'Content'
    },
    color: {
      type: 'color',
      default: '#ffffff',
      description: 'Text color',
      group: 'Content'
    },
    cursorColor: {
      type: 'color',
      default: '#3b82f6',
      description: 'Cursor color',
      group: 'Cursor'
    }
  }
);

// Decrypted Text Schema
export const decryptedTextSchema = createSchema(
  'decrypted-text',
  'Decrypted Text Animation',
  'textAnimations',
  'Matrix-style text decryption effect',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color', 'backgroundColor'],
    'Decryption': ['decryptSpeed', 'decryptDelay', 'randomChars'],
    'Effects': ['glowEffect', 'autoStart']
  },
  {
    text: {
      type: 'text',
      default: 'DECRYPTED TEXT',
      description: 'Text to decrypt',
      group: 'Content'
    },
    decryptSpeed: {
      type: 'slider',
      min: 10,
      max: 200,
      default: 50,
      unit: 'ms',
      description: 'Decryption speed',
      group: 'Decryption'
    },
    decryptDelay: {
      type: 'slider',
      min: 50,
      max: 500,
      default: 100,
      unit: 'ms',
      description: 'Delay between characters',
      group: 'Decryption'
    },
    randomChars: {
      type: 'text',
      default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
      description: 'Random characters for scrambling',
      group: 'Decryption'
    },
    fontSize: {
      type: 'slider',
      min: 12,
      max: 72,
      default: 32,
      unit: 'px',
      description: 'Font size',
      group: 'Content'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 700,
      description: 'Font weight',
      group: 'Content'
    },
    color: {
      type: 'color',
      default: '#00ff00',
      description: 'Text color',
      group: 'Content'
    },
    backgroundColor: {
      type: 'color',
      default: '#000000',
      description: 'Background color',
      group: 'Content'
    },
    glowEffect: {
      type: 'toggle',
      default: true,
      description: 'Enable glow effect',
      group: 'Effects'
    },
    autoStart: {
      type: 'toggle',
      default: true,
      description: 'Auto start animation',
      group: 'Effects'
    }
  }
);

// Scramble Text Schema
export const scrambleTextSchema = createSchema(
  'scramble-text',
  'Scramble Text Animation',
  'textAnimations',
  'Text scrambling with random character substitution',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color', 'scrambleColor'],
    'Animation': ['scrambleSpeed', 'revealSpeed', 'scrambleDuration', 'revealDelay'],
    'Behavior': ['autoStart', 'scrambleChars']
  },
  {
    text: {
      type: 'text',
      default: 'SCRAMBLE TEXT',
      description: 'Text to scramble',
      group: 'Content'
    },
    scrambleSpeed: {
      type: 'slider',
      min: 10,
      max: 200,
      default: 50,
      unit: 'ms',
      description: 'Scramble speed',
      group: 'Animation'
    },
    revealSpeed: {
      type: 'slider',
      min: 50,
      max: 500,
      default: 100,
      unit: 'ms',
      description: 'Reveal speed',
      group: 'Animation'
    },
    scrambleDuration: {
      type: 'slider',
      min: 500,
      max: 5000,
      default: 2000,
      unit: 'ms',
      description: 'Scramble duration',
      group: 'Animation'
    },
    revealDelay: {
      type: 'slider',
      min: 10,
      max: 200,
      default: 50,
      unit: 'ms',
      description: 'Delay between reveals',
      group: 'Animation'
    },
    fontSize: {
      type: 'slider',
      min: 12,
      max: 72,
      default: 32,
      unit: 'px',
      description: 'Font size',
      group: 'Content'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 600,
      description: 'Font weight',
      group: 'Content'
    },
    color: {
      type: 'color',
      default: '#ffffff',
      description: 'Final text color',
      group: 'Content'
    },
    scrambleColor: {
      type: 'color',
      default: '#ff6b6b',
      description: 'Scramble text color',
      group: 'Content'
    },
    scrambleChars: {
      type: 'text',
      default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
      description: 'Characters for scrambling',
      group: 'Behavior'
    },
    autoStart: {
      type: 'toggle',
      default: true,
      description: 'Auto start animation',
      group: 'Behavior'
    }
  }
);

// ASCII Text Schema
export const asciiTextSchema = createSchema(
  'ascii-text',
  'ASCII Text Animation',
  'textAnimations',
  'Convert text to ASCII art with animation effects',
  {
    'Content': ['text', 'asciiStyle', 'fontSize', 'fontFamily', 'color'],
    'Animation': ['animationType', 'animationSpeed', 'animate'],
    'Effects': ['backgroundColor', 'glowEffect', 'lineHeight']
  },
  {
    text: {
      type: 'text',
      default: 'ASCII',
      description: 'Text to convert to ASCII art',
      group: 'Content'
    },
    asciiStyle: {
      type: 'dropdown',
      options: ['block', 'thin', 'dots'],
      default: 'block',
      description: 'ASCII art style',
      group: 'Content'
    },
    animationType: {
      type: 'dropdown',
      options: ['typewriter', 'fade', 'glitch', 'wave'],
      default: 'typewriter',
      description: 'Animation type',
      group: 'Animation'
    },
    animationSpeed: {
      type: 'slider',
      min: 10,
      max: 500,
      default: 100,
      unit: 'ms',
      description: 'Animation speed',
      group: 'Animation'
    },
    fontSize: {
      type: 'slider',
      min: 8,
      max: 24,
      default: 12,
      unit: 'px',
      description: 'Font size',
      group: 'Content'
    },
    fontFamily: {
      type: 'dropdown',
      options: ['monospace', 'Courier New', 'Monaco'],
      default: 'monospace',
      description: 'Font family',
      group: 'Content'
    },
    color: {
      type: 'color',
      default: '#00ff00',
      description: 'Text color',
      group: 'Content'
    },
    backgroundColor: {
      type: 'color',
      default: '#000000',
      description: 'Background color',
      group: 'Effects'
    },
    lineHeight: {
      type: 'slider',
      min: 0.8,
      max: 2,
      step: 0.1,
      default: 1,
      description: 'Line height',
      group: 'Effects'
    },
    animate: {
      type: 'toggle',
      default: true,
      description: 'Enable animation',
      group: 'Animation'
    },
    glowEffect: {
      type: 'toggle',
      default: true,
      description: 'Enable glow effect',
      group: 'Effects'
    }
  }
);

// Count Up Schema
export const countUpSchema = createSchema(
  'count-up',
  'Count Up Animation',
  'textAnimations',
  'Animated number counting effect',
  {
    'Numbers': ['startValue', 'endValue', 'decimals', 'prefix', 'suffix'],
    'Animation': ['duration', 'easing', 'autoStart'],
    'Formatting': ['separator', 'useGrouping', 'fontSize', 'fontWeight', 'color']
  },
  {
    startValue: {
      type: 'slider',
      min: 0,
      max: 1000,
      default: 0,
      description: 'Starting value',
      group: 'Numbers'
    },
    endValue: {
      type: 'slider',
      min: 1,
      max: 10000,
      default: 100,
      description: 'Ending value',
      group: 'Numbers'
    },
    duration: {
      type: 'slider',
      min: 500,
      max: 5000,
      default: 2000,
      unit: 'ms',
      description: 'Animation duration',
      group: 'Animation'
    },
    easing: {
      type: 'dropdown',
      options: ['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart'],
      default: 'easeOutQuart',
      description: 'Easing function',
      group: 'Animation'
    },
    decimals: {
      type: 'slider',
      min: 0,
      max: 3,
      default: 0,
      description: 'Decimal places',
      group: 'Numbers'
    },
    prefix: {
      type: 'text',
      default: '',
      description: 'Text before number',
      group: 'Numbers'
    },
    suffix: {
      type: 'text',
      default: '',
      description: 'Text after number',
      group: 'Numbers'
    },
    separator: {
      type: 'text',
      default: ',',
      description: 'Thousands separator',
      group: 'Formatting'
    },
    useGrouping: {
      type: 'toggle',
      default: true,
      description: 'Use number grouping',
      group: 'Formatting'
    },
    fontSize: {
      type: 'slider',
      min: 12,
      max: 72,
      default: 48,
      unit: 'px',
      description: 'Font size',
      group: 'Formatting'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 700,
      description: 'Font weight',
      group: 'Formatting'
    },
    color: {
      type: 'color',
      default: '#3b82f6',
      description: 'Text color',
      group: 'Formatting'
    },
    autoStart: {
      type: 'toggle',
      default: true,
      description: 'Auto start animation',
      group: 'Animation'
    }
  }
);

// Rotating Text Schema
export const rotatingTextSchema = createSchema(
  'rotating-text',
  'Rotating Text Animation',
  'textAnimations',
  'Text carousel with rotating transitions',
  {
    'Content': ['texts', 'fontSize', 'fontWeight', 'color'],
    'Animation': ['rotationSpeed', 'animationDuration', 'animationType'],
    'Behavior': ['autoStart', 'loop', 'pauseOnHover']
  },
  {
    texts: {
      type: 'text',
      default: 'First Text,Second Text,Third Text',
      description: 'Texts to rotate (comma-separated)',
      group: 'Content'
    },
    rotationSpeed: {
      type: 'slider',
      min: 1000,
      max: 5000,
      default: 2000,
      unit: 'ms',
      description: 'Time between rotations',
      group: 'Animation'
    },
    animationDuration: {
      type: 'slider',
      min: 200,
      max: 1000,
      default: 500,
      unit: 'ms',
      description: 'Transition duration',
      group: 'Animation'
    },
    animationType: {
      type: 'dropdown',
      options: ['slideUp', 'slideDown', 'fade', 'scale', 'rotate'],
      default: 'slideUp',
      description: 'Animation type',
      group: 'Animation'
    },
    fontSize: {
      type: 'slider',
      min: 12,
      max: 72,
      default: 32,
      unit: 'px',
      description: 'Font size',
      group: 'Content'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 600,
      description: 'Font weight',
      group: 'Content'
    },
    color: {
      type: 'color',
      default: '#ffffff',
      description: 'Text color',
      group: 'Content'
    },
    autoStart: {
      type: 'toggle',
      default: true,
      description: 'Auto start rotation',
      group: 'Behavior'
    },
    loop: {
      type: 'toggle',
      default: true,
      description: 'Loop rotation',
      group: 'Behavior'
    },
    pauseOnHover: {
      type: 'toggle',
      default: false,
      description: 'Pause on hover',
      group: 'Behavior'
    }
  }
);

// Glitch Text Schema
export const glitchTextSchema = createSchema(
  'glitch-text',
  'Glitch Text Animation',
  'textAnimations',
  'Digital glitch effects with RGB shift and distortion',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color'],
    'Glitch': ['glitchIntensity', 'glitchSpeed', 'glitchDuration', 'glitchInterval'],
    'Effects': ['rgbShift', 'rgbIntensity', 'scanlines', 'noise', 'autoStart']
  },
  {
    text: {
      type: 'text',
      default: 'GLITCH TEXT',
      description: 'Text to glitch',
      group: 'Content'
    },
    glitchIntensity: {
      type: 'slider',
      min: 1,
      max: 20,
      default: 5,
      description: 'Glitch intensity',
      group: 'Glitch'
    },
    glitchSpeed: {
      type: 'slider',
      min: 50,
      max: 500,
      default: 100,
      unit: 'ms',
      description: 'Glitch speed',
      group: 'Glitch'
    },
    glitchDuration: {
      type: 'slider',
      min: 100,
      max: 1000,
      default: 200,
      unit: 'ms',
      description: 'Glitch duration',
      group: 'Glitch'
    },
    glitchInterval: {
      type: 'slider',
      min: 1000,
      max: 5000,
      default: 2000,
      unit: 'ms',
      description: 'Time between glitches',
      group: 'Glitch'
    },
    rgbShift: {
      type: 'toggle',
      default: true,
      description: 'Enable RGB shift',
      group: 'Effects'
    },
    rgbIntensity: {
      type: 'slider',
      min: 1,
      max: 10,
      default: 3,
      description: 'RGB shift intensity',
      group: 'Effects'
    },
    scanlines: {
      type: 'toggle',
      default: true,
      description: 'Enable scanlines',
      group: 'Effects'
    },
    noise: {
      type: 'toggle',
      default: true,
      description: 'Enable noise',
      group: 'Effects'
    },
    fontSize: {
      type: 'slider',
      min: 12,
      max: 72,
      default: 32,
      unit: 'px',
      description: 'Font size',
      group: 'Content'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 700,
      description: 'Font weight',
      group: 'Content'
    },
    color: {
      type: 'color',
      default: '#ffffff',
      description: 'Text color',
      group: 'Content'
    },
    autoStart: {
      type: 'toggle',
      default: true,
      description: 'Auto start glitching',
      group: 'Effects'
    }
  }
);

// Fuzzy Text Schema
export const fuzzyTextSchema = createSchema(
  'fuzzy-text',
  'Fuzzy Text Animation',
  'textAnimations',
  'Fuzzy/glitch text effects with distortion',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color'],
    'Fuzzy': ['fuzzyIntensity', 'fuzzySpeed', 'fuzzyType'],
    'Animation': ['animate', 'autoStart']
  },
  {
    text: {
      type: 'text',
      default: 'Fuzzy Text',
      description: 'Text to make fuzzy',
      group: 'Content'
    },
    fuzzyIntensity: {
      type: 'slider',
      min: 1,
      max: 20,
      default: 5,
      description: 'Fuzzy intensity',
      group: 'Fuzzy'
    },
    fuzzySpeed: {
      type: 'slider',
      min: 50,
      max: 500,
      default: 100,
      unit: 'ms',
      description: 'Fuzzy animation speed',
      group: 'Fuzzy'
    },
    fuzzyType: {
      type: 'dropdown',
      options: ['blur', 'distort', 'shake', 'wave'],
      default: 'blur',
      description: 'Type of fuzzy effect',
      group: 'Fuzzy'
    },
    fontSize: {
      type: 'slider',
      min: 12,
      max: 72,
      default: 32,
      unit: 'px',
      description: 'Font size',
      group: 'Content'
    },
    fontWeight: {
      type: 'slider',
      min: 100,
      max: 900,
      step: 100,
      default: 600,
      description: 'Font weight',
      group: 'Content'
    },
    color: {
      type: 'color',
      default: '#ffffff',
      description: 'Text color',
      group: 'Content'
    },
    animate: {
      type: 'toggle',
      default: true,
      description: 'Enable animation',
      group: 'Animation'
    },
    autoStart: {
      type: 'toggle',
      default: true,
      description: 'Auto start animation',
      group: 'Animation'
    }
  }
);

// Fade Content Schema
export const fadeContentSchema = createSchema(
  'fade-content',
  'Fade Content Animation',
  'animations',
  'Smooth fade in/out transitions for content',
  {
    'Animation': ['fadeType', 'duration', 'delay', 'easing'],
    'Trigger': ['triggerOnMount', 'autoReverse', 'loop'],
    'Layout': ['height']
  },
  {
    fadeType: {
      type: 'dropdown',
      options: ['fadeIn', 'fadeOut', 'fadeInOut'],
      default: 'fadeIn',
      description: 'Type of fade animation',
      group: 'Animation'
    },
    duration: {
      type: 'slider',
      min: 200,
      max: 3000,
      default: 1000,
      unit: 'ms',
      description: 'Animation duration',
      group: 'Animation'
    },
    delay: {
      type: 'slider',
      min: 0,
      max: 2000,
      default: 0,
      unit: 'ms',
      description: 'Animation delay',
      group: 'Animation'
    },
    easing: {
      type: 'dropdown',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
      default: 'ease-out',
      description: 'Easing function',
      group: 'Animation'
    },
    triggerOnMount: {
      type: 'toggle',
      default: true,
      description: 'Trigger on mount',
      group: 'Trigger'
    },
    autoReverse: {
      type: 'toggle',
      default: false,
      description: 'Auto reverse animation',
      group: 'Trigger'
    },
    loop: {
      type: 'toggle',
      default: false,
      description: 'Loop animation',
      group: 'Trigger'
    },
    height: {
      type: 'text',
      default: '300px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Pixel Transition Schema
export const pixelTransitionSchema = createSchema(
  'pixel-transition',
  'Pixel Transition Animation',
  'animations',
  'Pixelated reveal/hide transitions',
  {
    'Pixels': ['pixelSize', 'transitionSpeed', 'pixelColor'],
    'Animation': ['direction', 'easing', 'autoStart'],
    'Layout': ['height']
  },
  {
    pixelSize: {
      type: 'slider',
      min: 2,
      max: 20,
      default: 8,
      unit: 'px',
      description: 'Pixel size',
      group: 'Pixels'
    },
    transitionSpeed: {
      type: 'slider',
      min: 500,
      max: 3000,
      default: 1500,
      unit: 'ms',
      description: 'Transition speed',
      group: 'Pixels'
    },
    pixelColor: {
      type: 'color',
      default: '#3b82f6',
      description: 'Pixel color',
      group: 'Pixels'
    },
    direction: {
      type: 'dropdown',
      options: ['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top', 'center-out', 'random'],
      default: 'left-to-right',
      description: 'Transition direction',
      group: 'Animation'
    },
    easing: {
      type: 'dropdown',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
      default: 'ease-out',
      description: 'Easing function',
      group: 'Animation'
    },
    autoStart: {
      type: 'toggle',
      default: true,
      description: 'Auto start animation',
      group: 'Animation'
    },
    height: {
      type: 'text',
      default: '300px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Export all schemas
export const componentSchemas = {
  hero: heroSchema,
  button: buttonSchema,
  'blur-text': blurTextSchema,
  'split-text': splitTextSchema,
  'circular-text': circularTextSchema,
  'shiny-text': shinyTextSchema,
  'gradient-text': gradientTextSchema,
  'text-pressure': textPressureSchema,
  'curved-loop': curvedLoopSchema,
  'fuzzy-text': fuzzyTextSchema,
  'text-trail': textTrailSchema,
  'falling-text': fallingTextSchema,
  'text-cursor': textCursorSchema,
  'decrypted-text': decryptedTextSchema,
  'scramble-text': scrambleTextSchema,
  'count-up': countUpSchema,
  'rotating-text': rotatingTextSchema,
  'glitch-text': glitchTextSchema,
  'scroll-reveal': scrollRevealSchema,
  'true-focus': trueFocusSchema,
  'scroll-float': scrollFloatSchema,
  'scroll-velocity': scrollVelocitySchema,
  'variable-proximity': variableProximitySchema,
  'ascii-text': asciiTextSchema,
  'animated-content': animatedContentSchema,
  'fade-content': fadeContentSchema,
  'pixel-transition': pixelTransitionSchema,
  'glare-hover': glareHoverSchema,
  'ripple-effect': rippleEffectSchema,
  'parallax-scroll': parallaxScrollSchema,
  'magnet-lines': magnetLinesSchema,
  'click-spark': clickSparkSchema,
  'magnet': magnetSchema,
  'floating-elements': floatingElementsSchema,
  'morphing-shapes': morphingShapesSchema,
  'pixel-trail': pixelTrailSchema,
  'cubes': cubesSchema,
  'meta-balls': metaBallsSchema,
  'blob-cursor': blobCursorSchema,
  'star-border': starBorderSchema,
  'metallic-paint': metallicPaintSchema,
  'noise': noiseSchema,
  'crosshair': crosshairSchema,
  'image-trail': imageTrailSchema,
  'ribbons': ribbonsSchema,
  'splash-cursor': splashCursorSchema,
  'animated-list': animatedListSchema,
  'dock': dockSchema,
  'fluid-glass': fluidGlassSchema,
  'tilted-card': tiltedCardSchema,
  'aurora': auroraSchema,
  'particles': particlesSchema,
  'waves': wavesSchema,
  'silk': silkSchema,
  'beams': beamsSchema,
  'grid': gridSchema,
  'stack': stackSchema,
  'carousel': carouselSchema,
  'modal': modalSchema,
  'tabs': tabsSchema
};

export default componentSchemas;
