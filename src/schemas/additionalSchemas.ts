/**
 * Additional Component Schemas
 * Contains schemas for remaining components
 */

import { ComponentSchema, ComponentCategory } from '../types/parametric';

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
  groups,
  parameters,
  presets
});

// Text Trail Schema
export const textTrailSchema = createSchema(
  'text-trail',
  'Text Trail Animation',
  'textAnimations',
  'Text that follows mouse movement with trailing effect',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color'],
    'Trail': ['trailLength', 'trailOpacity', 'trailSpeed'],
    'Mouse': ['followMouse', 'mouseOffset']
  },
  {
    text: {
      type: 'text',
      default: 'Trail Text',
      description: 'Text to display',
      group: 'Content'
    },
    trailLength: {
      type: 'slider',
      min: 3,
      max: 20,
      default: 8,
      description: 'Trail length',
      group: 'Trail'
    },
    trailOpacity: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.7,
      description: 'Trail opacity',
      group: 'Trail'
    },
    trailSpeed: {
      type: 'slider',
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.15,
      description: 'Trail follow speed',
      group: 'Trail'
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
      default: '#3b82f6',
      description: 'Text color',
      group: 'Content'
    },
    followMouse: {
      type: 'toggle',
      default: true,
      description: 'Follow mouse movement',
      group: 'Mouse'
    },
    mouseOffset: {
      type: 'slider',
      min: 0,
      max: 50,
      default: 20,
      unit: 'px',
      description: 'Offset from mouse',
      group: 'Mouse'
    }
  }
);

// Falling Text Schema
export const fallingTextSchema = createSchema(
  'falling-text',
  'Falling Text Animation',
  'textAnimations',
  'Text with gravity-based falling animation',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color'],
    'Physics': ['gravity', 'bounce', 'friction', 'windForce'],
    'Animation': ['autoStart', 'resetOnComplete']
  },
  {
    text: {
      type: 'text',
      default: 'Falling Text',
      description: 'Text to animate',
      group: 'Content'
    },
    gravity: {
      type: 'slider',
      min: 0.1,
      max: 2,
      step: 0.1,
      default: 0.5,
      description: 'Gravity strength',
      group: 'Physics'
    },
    bounce: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.7,
      description: 'Bounce factor',
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
    windForce: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.1,
      description: 'Wind force',
      group: 'Physics'
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
      description: 'Auto start animation',
      group: 'Animation'
    },
    resetOnComplete: {
      type: 'toggle',
      default: true,
      description: 'Reset when complete',
      group: 'Animation'
    }
  }
);

// Scroll Reveal Schema
export const scrollRevealSchema = createSchema(
  'scroll-reveal',
  'Scroll Reveal Text Animation',
  'textAnimations',
  'Text that reveals based on scroll position',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color', 'revealColor'],
    'Reveal': ['revealType', 'triggerOffset', 'direction'],
    'Animation': ['animationDuration', 'staggerDelay']
  },
  {
    text: {
      type: 'text',
      default: 'Scroll to reveal this text',
      description: 'Text to reveal',
      group: 'Content'
    },
    revealType: {
      type: 'dropdown',
      options: ['character', 'word', 'line', 'fade'],
      default: 'character',
      description: 'Reveal animation type',
      group: 'Reveal'
    },
    triggerOffset: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.5,
      description: 'Scroll trigger point',
      group: 'Reveal'
    },
    direction: {
      type: 'dropdown',
      options: ['left-to-right', 'right-to-left'],
      default: 'left-to-right',
      description: 'Reveal direction',
      group: 'Reveal'
    },
    animationDuration: {
      type: 'slider',
      min: 100,
      max: 1000,
      default: 300,
      unit: 'ms',
      description: 'Animation duration',
      group: 'Animation'
    },
    staggerDelay: {
      type: 'slider',
      min: 10,
      max: 200,
      default: 50,
      unit: 'ms',
      description: 'Stagger delay',
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
    revealColor: {
      type: 'color',
      default: '#3b82f6',
      description: 'Revealed text color',
      group: 'Content'
    }
  }
);

// Scroll Float Schema
export const scrollFloatSchema = createSchema(
  'scroll-float',
  'Scroll Float Text Animation',
  'textAnimations',
  'Text that floats and moves based on scroll position',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color'],
    'Float': ['floatIntensity', 'floatDirection', 'parallaxSpeed'],
    'Effects': ['rotationIntensity', 'scaleIntensity', 'enableRotation', 'enableScale', 'enableParallax']
  },
  {
    text: {
      type: 'text',
      default: 'Floating Text',
      description: 'Text to float',
      group: 'Content'
    },
    floatIntensity: {
      type: 'slider',
      min: 10,
      max: 100,
      default: 50,
      unit: 'px',
      description: 'Float movement intensity',
      group: 'Float'
    },
    floatDirection: {
      type: 'dropdown',
      options: ['vertical', 'horizontal', 'circular', 'figure8'],
      default: 'vertical',
      description: 'Float movement pattern',
      group: 'Float'
    },
    parallaxSpeed: {
      type: 'slider',
      min: 0,
      max: 2,
      step: 0.1,
      default: 0.5,
      description: 'Parallax scroll speed',
      group: 'Float'
    },
    rotationIntensity: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.1,
      description: 'Rotation intensity',
      group: 'Effects'
    },
    scaleIntensity: {
      type: 'slider',
      min: 0,
      max: 0.5,
      step: 0.1,
      default: 0.1,
      description: 'Scale variation intensity',
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
    enableParallax: {
      type: 'toggle',
      default: true,
      description: 'Enable parallax effect',
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
      default: 600,
      description: 'Font weight',
      group: 'Content'
    },
    color: {
      type: 'color',
      default: '#ffffff',
      description: 'Text color',
      group: 'Content'
    }
  }
);

// Scroll Velocity Schema
export const scrollVelocitySchema = createSchema(
  'scroll-velocity',
  'Scroll Velocity Text Animation',
  'textAnimations',
  'Text animation speed tied to scroll velocity',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color'],
    'Velocity': ['maxVelocity', 'velocitySensitivity', 'smoothing', 'threshold'],
    'Animation': ['animationType']
  },
  {
    text: {
      type: 'text',
      default: 'Velocity Driven Text',
      description: 'Text to animate',
      group: 'Content'
    },
    maxVelocity: {
      type: 'slider',
      min: 20,
      max: 100,
      default: 50,
      description: 'Maximum velocity threshold',
      group: 'Velocity'
    },
    velocitySensitivity: {
      type: 'slider',
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.1,
      description: 'Velocity sensitivity',
      group: 'Velocity'
    },
    smoothing: {
      type: 'slider',
      min: 0.8,
      max: 0.99,
      step: 0.01,
      default: 0.9,
      description: 'Velocity smoothing',
      group: 'Velocity'
    },
    threshold: {
      type: 'slider',
      min: 0.5,
      max: 5,
      step: 0.5,
      default: 1,
      description: 'Activation threshold',
      group: 'Velocity'
    },
    animationType: {
      type: 'dropdown',
      options: ['blur', 'scale', 'skew', 'stretch', 'glow', 'shake'],
      default: 'blur',
      description: 'Animation effect type',
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
    }
  }
);

// Variable Proximity Schema
export const variableProximitySchema = createSchema(
  'variable-proximity',
  'Variable Proximity Text Animation',
  'textAnimations',
  'Text effects that change based on mouse proximity',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'color', 'proximityColor'],
    'Proximity': ['maxDistance', 'effectType', 'maxIntensity'],
    'Animation': ['smoothTransition', 'transitionSpeed']
  },
  {
    text: {
      type: 'text',
      default: 'Proximity Text Effect',
      description: 'Text to affect',
      group: 'Content'
    },
    maxDistance: {
      type: 'slider',
      min: 50,
      max: 200,
      default: 100,
      unit: 'px',
      description: 'Maximum effect distance',
      group: 'Proximity'
    },
    effectType: {
      type: 'dropdown',
      options: ['scale', 'lift', 'blur', 'rotate', 'skew', 'glow', 'wave'],
      default: 'scale',
      description: 'Proximity effect type',
      group: 'Proximity'
    },
    maxIntensity: {
      type: 'slider',
      min: 1,
      max: 5,
      step: 0.5,
      default: 2,
      description: 'Maximum effect intensity',
      group: 'Proximity'
    },
    smoothTransition: {
      type: 'toggle',
      default: true,
      description: 'Smooth transitions',
      group: 'Animation'
    },
    transitionSpeed: {
      type: 'slider',
      min: 100,
      max: 500,
      default: 200,
      unit: 'ms',
      description: 'Transition speed',
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
    proximityColor: {
      type: 'color',
      default: '#3b82f6',
      description: 'Proximity effect color',
      group: 'Content'
    }
  }
);

// Glare Hover Schema
export const glareHoverSchema = createSchema(
  'glare-hover',
  'Glare Hover Animation',
  'animations',
  'Interactive glare effect that follows mouse movement',
  {
    'Glare': ['glareColor', 'glareIntensity', 'glareSize', 'glareSpeed'],
    'Interaction': ['followMouse', 'hoverOnly', 'autoGlare'],
    'Layout': ['height']
  },
  {
    glareColor: {
      type: 'color',
      default: '#ffffff',
      description: 'Glare color',
      group: 'Glare'
    },
    glareIntensity: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.6,
      description: 'Glare intensity',
      group: 'Glare'
    },
    glareSize: {
      type: 'slider',
      min: 50,
      max: 300,
      default: 150,
      unit: 'px',
      description: 'Glare size',
      group: 'Glare'
    },
    glareSpeed: {
      type: 'slider',
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.15,
      description: 'Glare follow speed',
      group: 'Glare'
    },
    followMouse: {
      type: 'toggle',
      default: true,
      description: 'Follow mouse movement',
      group: 'Interaction'
    },
    hoverOnly: {
      type: 'toggle',
      default: false,
      description: 'Show only on hover',
      group: 'Interaction'
    },
    autoGlare: {
      type: 'toggle',
      default: false,
      description: 'Auto-moving glare',
      group: 'Interaction'
    },
    height: {
      type: 'text',
      default: '300px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Ripple Effect Schema
export const rippleEffectSchema = createSchema(
  'ripple-effect',
  'Ripple Effect Animation',
  'animations',
  'Expanding ripple effects on interaction',
  {
    'Ripple': ['rippleColor', 'rippleDuration', 'maxRippleSize', 'rippleOpacity'],
    'Behavior': ['autoRipple', 'autoRippleInterval', 'multipleRipples'],
    'Layout': ['height']
  },
  {
    rippleColor: {
      type: 'color',
      default: '#3b82f6',
      description: 'Ripple color',
      group: 'Ripple'
    },
    rippleDuration: {
      type: 'slider',
      min: 500,
      max: 3000,
      default: 1000,
      unit: 'ms',
      description: 'Ripple duration',
      group: 'Ripple'
    },
    maxRippleSize: {
      type: 'slider',
      min: 100,
      max: 400,
      default: 200,
      unit: 'px',
      description: 'Maximum ripple size',
      group: 'Ripple'
    },
    rippleOpacity: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.6,
      description: 'Ripple opacity',
      group: 'Ripple'
    },
    autoRipple: {
      type: 'toggle',
      default: false,
      description: 'Auto-generate ripples',
      group: 'Behavior'
    },
    autoRippleInterval: {
      type: 'slider',
      min: 1000,
      max: 5000,
      default: 2000,
      unit: 'ms',
      description: 'Auto ripple interval',
      group: 'Behavior'
    },
    multipleRipples: {
      type: 'toggle',
      default: true,
      description: 'Allow multiple ripples',
      group: 'Behavior'
    },
    height: {
      type: 'text',
      default: '300px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Parallax Scroll Schema
export const parallaxScrollSchema = createSchema(
  'parallax-scroll',
  'Parallax Scroll Animation',
  'animations',
  'Multi-layer parallax scrolling effects',
  {
    'Layers': ['layerCount', 'baseSpeed', 'speedMultiplier'],
    'Effects': ['enableBlur', 'enableOpacity', 'enableMouseParallax'],
    'Appearance': ['backgroundColor', 'height', 'mouseIntensity']
  },
  {
    layerCount: {
      type: 'slider',
      min: 2,
      max: 6,
      default: 3,
      description: 'Number of parallax layers',
      group: 'Layers'
    },
    baseSpeed: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.5,
      description: 'Base scroll speed',
      group: 'Layers'
    },
    speedMultiplier: {
      type: 'slider',
      min: 0.1,
      max: 0.8,
      step: 0.1,
      default: 0.3,
      description: 'Speed difference between layers',
      group: 'Layers'
    },
    enableBlur: {
      type: 'toggle',
      default: true,
      description: 'Enable depth blur',
      group: 'Effects'
    },
    enableOpacity: {
      type: 'toggle',
      default: true,
      description: 'Enable depth opacity',
      group: 'Effects'
    },
    enableMouseParallax: {
      type: 'toggle',
      default: false,
      description: 'Enable mouse parallax',
      group: 'Effects'
    },
    backgroundColor: {
      type: 'color',
      default: '#0a0a0a',
      description: 'Background color',
      group: 'Appearance'
    },
    mouseIntensity: {
      type: 'slider',
      min: 0.05,
      max: 0.3,
      step: 0.05,
      default: 0.1,
      description: 'Mouse parallax intensity',
      group: 'Appearance'
    },
    height: {
      type: 'text',
      default: '600px',
      description: 'Container height',
      group: 'Appearance'
    }
  }
);

// Pixel Trail Schema
export const pixelTrailSchema = createSchema(
  'pixel-trail',
  'Pixel Trail Animation',
  'animations',
  'Trailing pixel effects that follow mouse movement',
  {
    'Pixels': ['pixelCount', 'pixelSize', 'pixelColors', 'trailLength'],
    'Animation': ['fadeSpeed', 'spawnRate', 'randomness'],
    'Layout': ['height']
  },
  {
    pixelCount: {
      type: 'slider',
      min: 10,
      max: 50,
      default: 20,
      description: 'Maximum pixel count',
      group: 'Pixels'
    },
    pixelSize: {
      type: 'slider',
      min: 2,
      max: 10,
      default: 4,
      unit: 'px',
      description: 'Pixel size',
      group: 'Pixels'
    },
    pixelColors: {
      type: 'text',
      default: '#3b82f6,#8b5cf6,#06b6d4,#10b981',
      description: 'Pixel colors (comma-separated)',
      group: 'Pixels'
    },
    trailLength: {
      type: 'slider',
      min: 5,
      max: 30,
      default: 15,
      description: 'Trail length',
      group: 'Pixels'
    },
    fadeSpeed: {
      type: 'slider',
      min: 0.01,
      max: 0.1,
      step: 0.01,
      default: 0.05,
      description: 'Fade speed',
      group: 'Animation'
    },
    spawnRate: {
      type: 'slider',
      min: 1,
      max: 10,
      default: 3,
      description: 'Spawn rate',
      group: 'Animation'
    },
    randomness: {
      type: 'slider',
      min: 0,
      max: 10,
      default: 2,
      unit: 'px',
      description: 'Position randomness',
      group: 'Animation'
    },
    height: {
      type: 'text',
      default: '400px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Cubes Schema
export const cubesSchema = createSchema(
  'cubes',
  '3D Cubes Animation',
  'animations',
  '3D rotating cubes with various effects',
  {
    'Cubes': ['cubeCount', 'cubeSize', 'cubeColors', 'spacing'],
    'Animation': ['rotationSpeed', 'floatSpeed', 'animate', 'randomRotation'],
    '3D': ['perspective', 'height']
  },
  {
    cubeCount: {
      type: 'slider',
      min: 4,
      max: 20,
      default: 12,
      description: 'Number of cubes',
      group: 'Cubes'
    },
    cubeSize: {
      type: 'slider',
      min: 20,
      max: 80,
      default: 40,
      unit: 'px',
      description: 'Cube size',
      group: 'Cubes'
    },
    cubeColors: {
      type: 'text',
      default: '#3b82f6,#8b5cf6,#06b6d4,#10b981,#f59e0b',
      description: 'Cube colors (comma-separated)',
      group: 'Cubes'
    },
    spacing: {
      type: 'slider',
      min: 50,
      max: 120,
      default: 80,
      unit: 'px',
      description: 'Spacing between cubes',
      group: 'Cubes'
    },
    rotationSpeed: {
      type: 'slider',
      min: 0.5,
      max: 3,
      step: 0.5,
      default: 1,
      description: 'Rotation speed',
      group: 'Animation'
    },
    floatSpeed: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.5,
      description: 'Float speed',
      group: 'Animation'
    },
    animate: {
      type: 'toggle',
      default: true,
      description: 'Enable animation',
      group: 'Animation'
    },
    randomRotation: {
      type: 'toggle',
      default: true,
      description: 'Random initial rotation',
      group: 'Animation'
    },
    perspective: {
      type: 'slider',
      min: 500,
      max: 2000,
      default: 1000,
      unit: 'px',
      description: '3D perspective',
      group: '3D'
    },
    height: {
      type: 'text',
      default: '400px',
      description: 'Container height',
      group: '3D'
    }
  }
);

// Meta Balls Schema
export const metaBallsSchema = createSchema(
  'meta-balls',
  'Meta Balls Animation',
  'animations',
  'Organic blob-like shapes that merge and separate',
  {
    'Balls': ['ballCount', 'minRadius', 'maxRadius', 'colors'],
    'Physics': ['speed', 'threshold'],
    'Layout': ['animate', 'height', 'width']
  },
  {
    ballCount: {
      type: 'slider',
      min: 3,
      max: 8,
      default: 5,
      description: 'Number of meta balls',
      group: 'Balls'
    },
    minRadius: {
      type: 'slider',
      min: 20,
      max: 50,
      default: 30,
      unit: 'px',
      description: 'Minimum radius',
      group: 'Balls'
    },
    maxRadius: {
      type: 'slider',
      min: 40,
      max: 100,
      default: 60,
      unit: 'px',
      description: 'Maximum radius',
      group: 'Balls'
    },
    colors: {
      type: 'text',
      default: '#3b82f6,#8b5cf6,#06b6d4,#10b981',
      description: 'Ball colors (comma-separated)',
      group: 'Balls'
    },
    speed: {
      type: 'slider',
      min: 0.5,
      max: 3,
      step: 0.5,
      default: 1,
      description: 'Movement speed',
      group: 'Physics'
    },
    threshold: {
      type: 'slider',
      min: 0.3,
      max: 1,
      step: 0.1,
      default: 0.6,
      description: 'Merge threshold',
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
    },
    width: {
      type: 'text',
      default: '100%',
      description: 'Container width',
      group: 'Layout'
    }
  }
);

// Blob Cursor Schema
export const blobCursorSchema = createSchema(
  'blob-cursor',
  'Blob Cursor Animation',
  'animations',
  'Organic blob that follows the mouse cursor',
  {
    'Blob': ['blobSize', 'followSpeed', 'morphSpeed', 'color'],
    'Effects': ['opacity', 'blur', 'hoverScale', 'morphIntensity'],
    'Layout': ['height']
  },
  {
    blobSize: {
      type: 'slider',
      min: 20,
      max: 80,
      default: 40,
      unit: 'px',
      description: 'Blob size',
      group: 'Blob'
    },
    followSpeed: {
      type: 'slider',
      min: 0.05,
      max: 0.3,
      step: 0.05,
      default: 0.1,
      description: 'Follow speed',
      group: 'Blob'
    },
    morphSpeed: {
      type: 'slider',
      min: 0.01,
      max: 0.1,
      step: 0.01,
      default: 0.05,
      description: 'Morph speed',
      group: 'Blob'
    },
    color: {
      type: 'color',
      default: '#3b82f6',
      description: 'Blob color',
      group: 'Blob'
    },
    opacity: {
      type: 'slider',
      min: 0.3,
      max: 1,
      step: 0.1,
      default: 0.8,
      description: 'Blob opacity',
      group: 'Effects'
    },
    blur: {
      type: 'slider',
      min: 0,
      max: 20,
      default: 10,
      unit: 'px',
      description: 'Blur amount',
      group: 'Effects'
    },
    hoverScale: {
      type: 'slider',
      min: 1,
      max: 2,
      step: 0.1,
      default: 1.5,
      description: 'Hover scale factor',
      group: 'Effects'
    },
    morphIntensity: {
      type: 'slider',
      min: 0.1,
      max: 0.5,
      step: 0.1,
      default: 0.3,
      description: 'Morph intensity',
      group: 'Effects'
    },
    height: {
      type: 'text',
      default: '400px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Star Border Schema
export const starBorderSchema = createSchema(
  'star-border',
  'Star Border Animation',
  'animations',
  'Animated star border effects around content',
  {
    'Stars': ['starCount', 'starSize', 'starColor', 'borderWidth'],
    'Animation': ['animationSpeed', 'twinkleSpeed', 'animate'],
    'Layout': ['borderRadius', 'padding', 'backgroundColor']
  },
  {
    starCount: {
      type: 'slider',
      min: 10,
      max: 40,
      default: 20,
      description: 'Number of stars',
      group: 'Stars'
    },
    starSize: {
      type: 'slider',
      min: 4,
      max: 16,
      default: 8,
      unit: 'px',
      description: 'Star size',
      group: 'Stars'
    },
    starColor: {
      type: 'color',
      default: '#ffd700',
      description: 'Star color',
      group: 'Stars'
    },
    borderWidth: {
      type: 'slider',
      min: 2,
      max: 10,
      default: 4,
      unit: 'px',
      description: 'Border width',
      group: 'Stars'
    },
    animationSpeed: {
      type: 'slider',
      min: 0.5,
      max: 3,
      step: 0.5,
      default: 1,
      description: 'Animation speed',
      group: 'Animation'
    },
    twinkleSpeed: {
      type: 'slider',
      min: 1,
      max: 5,
      default: 2,
      description: 'Twinkle speed',
      group: 'Animation'
    },
    animate: {
      type: 'toggle',
      default: true,
      description: 'Enable animation',
      group: 'Animation'
    },
    borderRadius: {
      type: 'slider',
      min: 0,
      max: 20,
      default: 12,
      unit: 'px',
      description: 'Border radius',
      group: 'Layout'
    },
    padding: {
      type: 'slider',
      min: 16,
      max: 64,
      default: 32,
      unit: 'px',
      description: 'Content padding',
      group: 'Layout'
    },
    backgroundColor: {
      type: 'color',
      default: 'rgba(0, 0, 0, 0.8)',
      description: 'Background color',
      group: 'Layout'
    }
  }
);

// Metallic Paint Schema
export const metallicPaintSchema = createSchema(
  'metallic-paint',
  'Metallic Paint Animation',
  'animations',
  'Metallic paint brush effects with reflective surfaces',
  {
    'Brush': ['brushSize', 'metallicIntensity', 'paintColor', 'reflectionColor'],
    'Physics': ['flowSpeed', 'viscosity', 'maxStrokes'],
    'Behavior': ['autoFlow', 'height']
  },
  {
    brushSize: {
      type: 'slider',
      min: 10,
      max: 40,
      default: 20,
      unit: 'px',
      description: 'Brush size',
      group: 'Brush'
    },
    metallicIntensity: {
      type: 'slider',
      min: 0.3,
      max: 1,
      step: 0.1,
      default: 0.8,
      description: 'Metallic intensity',
      group: 'Brush'
    },
    paintColor: {
      type: 'color',
      default: '#c0c0c0',
      description: 'Paint color',
      group: 'Brush'
    },
    reflectionColor: {
      type: 'color',
      default: '#ffffff',
      description: 'Reflection color',
      group: 'Brush'
    },
    flowSpeed: {
      type: 'slider',
      min: 0.1,
      max: 2,
      step: 0.1,
      default: 0.5,
      description: 'Flow speed',
      group: 'Physics'
    },
    viscosity: {
      type: 'slider',
      min: 0.9,
      max: 0.99,
      step: 0.01,
      default: 0.95,
      description: 'Paint viscosity',
      group: 'Physics'
    },
    maxStrokes: {
      type: 'slider',
      min: 20,
      max: 100,
      default: 50,
      description: 'Maximum strokes',
      group: 'Physics'
    },
    autoFlow: {
      type: 'toggle',
      default: false,
      description: 'Auto paint flow',
      group: 'Behavior'
    },
    height: {
      type: 'text',
      default: '400px',
      description: 'Container height',
      group: 'Behavior'
    }
  }
);

// Noise Schema
export const noiseSchema = createSchema(
  'noise',
  'Noise Animation',
  'animations',
  'Animated noise/grain effects with various patterns',
  {
    'Noise': ['noiseType', 'intensity', 'animationSpeed', 'scale'],
    'Appearance': ['color', 'backgroundColor', 'blendMode'],
    'Layout': ['animate', 'height', 'width']
  },
  {
    noiseType: {
      type: 'dropdown',
      options: ['white', 'perlin', 'static', 'grain', 'digital'],
      default: 'white',
      description: 'Type of noise',
      group: 'Noise'
    },
    intensity: {
      type: 'slider',
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.5,
      description: 'Noise intensity',
      group: 'Noise'
    },
    animationSpeed: {
      type: 'slider',
      min: 10,
      max: 200,
      default: 50,
      unit: 'ms',
      description: 'Animation speed',
      group: 'Noise'
    },
    scale: {
      type: 'slider',
      min: 0.5,
      max: 2,
      step: 0.1,
      default: 1,
      description: 'Noise scale',
      group: 'Noise'
    },
    color: {
      type: 'color',
      default: '#ffffff',
      description: 'Noise color',
      group: 'Appearance'
    },
    backgroundColor: {
      type: 'color',
      default: '#000000',
      description: 'Background color',
      group: 'Appearance'
    },
    blendMode: {
      type: 'dropdown',
      options: ['normal', 'multiply', 'screen', 'overlay', 'difference'],
      default: 'normal',
      description: 'Blend mode',
      group: 'Appearance'
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
    },
    width: {
      type: 'text',
      default: '100%',
      description: 'Container width',
      group: 'Layout'
    }
  }
);

// Crosshair Schema
export const crosshairSchema = createSchema(
  'crosshair',
  'Crosshair Animation',
  'animations',
  'Interactive crosshair cursor effects',
  {
    'Crosshair': ['crosshairSize', 'lineWidth', 'color', 'centerDotSize'],
    'Animation': ['animationSpeed', 'followMouse', 'pulseEffect', 'pulseSpeed'],
    'Grid': ['showGrid', 'gridSpacing', 'gridOpacity'],
    'Layout': ['height']
  },
  {
    crosshairSize: {
      type: 'slider',
      min: 20,
      max: 80,
      default: 40,
      unit: 'px',
      description: 'Crosshair size',
      group: 'Crosshair'
    },
    lineWidth: {
      type: 'slider',
      min: 1,
      max: 5,
      default: 2,
      unit: 'px',
      description: 'Line width',
      group: 'Crosshair'
    },
    color: {
      type: 'color',
      default: '#ff0000',
      description: 'Crosshair color',
      group: 'Crosshair'
    },
    centerDotSize: {
      type: 'slider',
      min: 2,
      max: 10,
      default: 4,
      unit: 'px',
      description: 'Center dot size',
      group: 'Crosshair'
    },
    animationSpeed: {
      type: 'slider',
      min: 0.05,
      max: 0.3,
      step: 0.05,
      default: 0.1,
      description: 'Animation speed',
      group: 'Animation'
    },
    followMouse: {
      type: 'toggle',
      default: true,
      description: 'Follow mouse',
      group: 'Animation'
    },
    pulseEffect: {
      type: 'toggle',
      default: true,
      description: 'Pulse effect',
      group: 'Animation'
    },
    pulseSpeed: {
      type: 'slider',
      min: 1,
      max: 5,
      default: 2,
      description: 'Pulse speed',
      group: 'Animation'
    },
    showGrid: {
      type: 'toggle',
      default: true,
      description: 'Show grid',
      group: 'Grid'
    },
    gridSpacing: {
      type: 'slider',
      min: 25,
      max: 100,
      default: 50,
      unit: 'px',
      description: 'Grid spacing',
      group: 'Grid'
    },
    gridOpacity: {
      type: 'slider',
      min: 0.1,
      max: 0.5,
      step: 0.1,
      default: 0.2,
      description: 'Grid opacity',
      group: 'Grid'
    },
    height: {
      type: 'text',
      default: '400px',
      description: 'Container height',
      group: 'Layout'
    }
  }
);

// Image Trail Schema
export const imageTrailSchema = createSchema(
  'image-trail',
  'Image Trail Animation',
  'animations',
  'Trailing image effects following mouse movement',
  {
    'Images': ['imageUrl', 'imageSize', 'trailLength', 'spawnRate'],
    'Effects': ['fadeSpeed', 'scaleVariation', 'rotationSpeed', 'blendMode'],
    'Layout': ['randomOffset', 'height']
  },
  {
    imageUrl: {
      type: 'text',
      default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjM2I4MmY2Ii8+Cjwvc3ZnPgo=',
      description: 'Image URL or data URI',
      group: 'Images'
    },
    imageSize: {
      type: 'slider',
      min: 12,
      max: 48,
      default: 24,
      unit: 'px',
      description: 'Image size',
      group: 'Images'
    },
    trailLength: {
      type: 'slider',
      min: 5,
      max: 20,
      default: 10,
      description: 'Trail length',
      group: 'Images'
    },
    spawnRate: {
      type: 'slider',
      min: 1,
      max: 10,
      default: 3,
      description: 'Spawn rate',
      group: 'Images'
    },
    fadeSpeed: {
      type: 'slider',
      min: 0.01,
      max: 0.1,
      step: 0.01,
      default: 0.05,
      description: 'Fade speed',
      group: 'Effects'
    },
    scaleVariation: {
      type: 'slider',
      min: 0,
      max: 0.5,
      step: 0.1,
      default: 0.3,
      description: 'Scale variation',
      group: 'Effects'
    },
    rotationSpeed: {
      type: 'slider',
      min: 0,
      max: 10,
      default: 5,
      description: 'Rotation speed',
      group: 'Effects'
    },
    blendMode: {
      type: 'dropdown',
      options: ['normal', 'multiply', 'screen', 'overlay'],
      default: 'normal',
      description: 'Blend mode',
      group: 'Effects'
    },
    randomOffset: {
      type: 'slider',
      min: 0,
      max: 20,
      default: 10,
      unit: 'px',
      description: 'Random offset',
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

// Ribbons Schema
export const ribbonsSchema = createSchema(
  'ribbons',
  'Ribbons Animation',
  'animations',
  'Flowing ribbon animations with physics',
  {
    'Ribbons': ['ribbonCount', 'segmentCount', 'ribbonColors', 'ribbonWidth'],
    'Physics': ['flowSpeed', 'damping', 'springStrength', 'mouseInfluence'],
    'Layout': ['animate', 'height']
  },
  {
    ribbonCount: {
      type: 'slider',
      min: 1,
      max: 5,
      default: 3,
      description: 'Number of ribbons',
      group: 'Ribbons'
    },
    segmentCount: {
      type: 'slider',
      min: 10,
      max: 30,
      default: 20,
      description: 'Segments per ribbon',
      group: 'Ribbons'
    },
    ribbonColors: {
      type: 'text',
      default: '#3b82f6,#8b5cf6,#06b6d4,#10b981',
      description: 'Ribbon colors (comma-separated)',
      group: 'Ribbons'
    },
    ribbonWidth: {
      type: 'slider',
      min: 4,
      max: 16,
      default: 8,
      unit: 'px',
      description: 'Ribbon width',
      group: 'Ribbons'
    },
    flowSpeed: {
      type: 'slider',
      min: 0.01,
      max: 0.05,
      step: 0.01,
      default: 0.02,
      description: 'Flow speed',
      group: 'Physics'
    },
    damping: {
      type: 'slider',
      min: 0.95,
      max: 0.99,
      step: 0.01,
      default: 0.98,
      description: 'Damping factor',
      group: 'Physics'
    },
    springStrength: {
      type: 'slider',
      min: 0.05,
      max: 0.2,
      step: 0.05,
      default: 0.1,
      description: 'Spring strength',
      group: 'Physics'
    },
    mouseInfluence: {
      type: 'slider',
      min: 25,
      max: 100,
      default: 50,
      unit: 'px',
      description: 'Mouse influence radius',
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

// Splash Cursor Schema
export const splashCursorSchema = createSchema(
  'splash-cursor',
  'Splash Cursor Animation',
  'animations',
  'Liquid splash effects on click interactions',
  {
    'Droplets': ['dropletCount', 'maxDropletSize', 'minDropletSize', 'splashColors'],
    'Physics': ['splashForce', 'gravity', 'friction', 'splashDuration'],
    'Behavior': ['autoSplash', 'autoSplashInterval', 'height']
  },
  {
    dropletCount: {
      type: 'slider',
      min: 8,
      max: 25,
      default: 15,
      description: 'Number of droplets',
      group: 'Droplets'
    },
    maxDropletSize: {
      type: 'slider',
      min: 6,
      max: 16,
      default: 8,
      unit: 'px',
      description: 'Maximum droplet size',
      group: 'Droplets'
    },
    minDropletSize: {
      type: 'slider',
      min: 2,
      max: 6,
      default: 3,
      unit: 'px',
      description: 'Minimum droplet size',
      group: 'Droplets'
    },
    splashColors: {
      type: 'text',
      default: '#3b82f6,#8b5cf6,#06b6d4,#10b981',
      description: 'Splash colors (comma-separated)',
      group: 'Droplets'
    },
    splashForce: {
      type: 'slider',
      min: 2,
      max: 10,
      default: 5,
      description: 'Splash force',
      group: 'Physics'
    },
    gravity: {
      type: 'slider',
      min: 0.1,
      max: 0.5,
      step: 0.1,
      default: 0.2,
      description: 'Gravity strength',
      group: 'Physics'
    },
    friction: {
      type: 'slider',
      min: 0.95,
      max: 0.99,
      step: 0.01,
      default: 0.98,
      description: 'Air friction',
      group: 'Physics'
    },
    splashDuration: {
      type: 'slider',
      min: 1000,
      max: 5000,
      default: 2000,
      unit: 'ms',
      description: 'Splash duration',
      group: 'Physics'
    },
    autoSplash: {
      type: 'toggle',
      default: false,
      description: 'Auto splash',
      group: 'Behavior'
    },
    autoSplashInterval: {
      type: 'slider',
      min: 500,
      max: 2000,
      default: 1000,
      unit: 'ms',
      description: 'Auto splash interval',
      group: 'Behavior'
    },
    height: {
      type: 'text',
      default: '400px',
      description: 'Container height',
      group: 'Behavior'
    }
  }
);

// True Focus Schema
export const trueFocusSchema = createSchema(
  'true-focus',
  'True Focus Text Animation',
  'textAnimations',
  'Focus effect where one word is sharp while others are blurred',
  {
    'Content': ['text', 'fontSize', 'fontWeight', 'focusColor', 'blurColor'],
    'Focus': ['focusSpeed', 'blurAmount', 'autoFocus', 'loop'],
    'Animation': ['pauseDuration']
  },
  {
    text: {
      type: 'text',
      default: 'This is a true focus text animation effect',
      description: 'Text to focus',
      group: 'Content'
    },
    focusSpeed: {
      type: 'slider',
      min: 500,
      max: 3000,
      default: 1000,
      unit: 'ms',
      description: 'Focus transition speed',
      group: 'Focus'
    },
    blurAmount: {
      type: 'slider',
      min: 1,
      max: 10,
      default: 4,
      unit: 'px',
      description: 'Blur amount',
      group: 'Focus'
    },
    autoFocus: {
      type: 'toggle',
      default: true,
      description: 'Auto focus words',
      group: 'Focus'
    },
    loop: {
      type: 'toggle',
      default: true,
      description: 'Loop focus animation',
      group: 'Focus'
    },
    pauseDuration: {
      type: 'slider',
      min: 200,
      max: 2000,
      default: 500,
      unit: 'ms',
      description: 'Pause between focus',
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
    focusColor: {
      type: 'color',
      default: '#ffffff',
      description: 'Focused text color',
      group: 'Content'
    },
    blurColor: {
      type: 'color',
      default: '#666666',
      description: 'Blurred text color',
      group: 'Content'
    }
  }
);
