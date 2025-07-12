/**
 * Component Renderer
 * Handles the actual rendering of parametric components based on their type
 */

import React from 'react';
import { ComponentRenderProps } from '../types/parametric';

// Import component renderers
import { HeroRenderer } from './renderers/HeroRenderer';
import { ButtonRenderer } from './renderers/ButtonRenderer';
import { CardRenderer } from './renderers/CardRenderer';

// Text Animation Renderers
import { BlurTextRenderer } from './renderers/textAnimations/BlurTextRenderer';
import { SplitTextRenderer } from './renderers/textAnimations/SplitTextRenderer';
import { CircularTextRenderer } from './renderers/textAnimations/CircularTextRenderer';
import { ShinyTextRenderer } from './renderers/textAnimations/ShinyTextRenderer';
import { GradientTextRenderer } from './renderers/textAnimations/GradientTextRenderer';
import { TextPressureRenderer } from './renderers/textAnimations/TextPressureRenderer';
import { CurvedLoopRenderer } from './renderers/textAnimations/CurvedLoopRenderer';
import { FuzzyTextRenderer } from './renderers/textAnimations/FuzzyTextRenderer';
import { TextTrailRenderer } from './renderers/textAnimations/TextTrailRenderer';
import { FallingTextRenderer } from './renderers/textAnimations/FallingTextRenderer';
import { TextCursorRenderer } from './renderers/textAnimations/TextCursorRenderer';
import { DecryptedTextRenderer } from './renderers/textAnimations/DecryptedTextRenderer';
import { ScrambleTextRenderer } from './renderers/textAnimations/ScrambleTextRenderer';
import { CountUpRenderer } from './renderers/textAnimations/CountUpRenderer';
import { RotatingTextRenderer } from './renderers/textAnimations/RotatingTextRenderer';
import { GlitchTextRenderer } from './renderers/textAnimations/GlitchTextRenderer';
import { ScrollRevealRenderer } from './renderers/textAnimations/ScrollRevealRenderer';
import { TrueFocusRenderer } from './renderers/textAnimations/TrueFocusRenderer';
import { ASCIITextRenderer } from './renderers/textAnimations/ASCIITextRenderer';
import { ScrollFloatRenderer } from './renderers/textAnimations/ScrollFloatRenderer';
import { ScrollVelocityRenderer } from './renderers/textAnimations/ScrollVelocityRenderer';
import { VariableProximityRenderer } from './renderers/textAnimations/VariableProximityRenderer';

// Animation Renderers
import { FadeContentRenderer } from './renderers/animations/FadeContentRenderer';
import { PixelTransitionRenderer } from './renderers/animations/PixelTransitionRenderer';
import { GlareHoverRenderer } from './renderers/animations/GlareHoverRenderer';
import { AnimatedContentRenderer } from './renderers/animations/AnimatedContentRenderer';
import { MagnetLinesRenderer } from './renderers/animations/MagnetLinesRenderer';
import { ClickSparkRenderer } from './renderers/animations/ClickSparkRenderer';
import { MagnetRenderer } from './renderers/animations/MagnetRenderer';
import { FloatingElementsRenderer } from './renderers/animations/FloatingElementsRenderer';
import { MorphingShapesRenderer } from './renderers/animations/MorphingShapesRenderer';
import { RippleEffectRenderer } from './renderers/animations/RippleEffectRenderer';
import { ParallaxScrollRenderer } from './renderers/animations/ParallaxScrollRenderer';
import { PixelTrailRenderer } from './renderers/animations/PixelTrailRenderer';
import { CubesRenderer } from './renderers/animations/CubesRenderer';
import { MetaBallsRenderer } from './renderers/animations/MetaBallsRenderer';
import { BlobCursorRenderer } from './renderers/animations/BlobCursorRenderer';
import { StarBorderRenderer } from './renderers/animations/StarBorderRenderer';
import { MetallicPaintRenderer } from './renderers/animations/MetallicPaintRenderer';
import { NoiseRenderer } from './renderers/animations/NoiseRenderer';
import { CrosshairRenderer } from './renderers/animations/CrosshairRenderer';
import { ImageTrailRenderer } from './renderers/animations/ImageTrailRenderer';
import { RibbonsRenderer } from './renderers/animations/RibbonsRenderer';
import { SplashCursorRenderer } from './renderers/animations/SplashCursorRenderer';

// Background Renderers
import { AuroraRenderer } from './renderers/backgrounds/AuroraRenderer';
import { BeamsRenderer } from './renderers/backgrounds/BeamsRenderer';
import { ParticlesRenderer } from './renderers/backgrounds/ParticlesRenderer';
import { SilkRenderer } from './renderers/backgrounds/SilkRenderer';
import { GridRenderer } from './renderers/backgrounds/GridRenderer';
import { WavesRenderer } from './renderers/backgrounds/WavesRenderer';

// Advanced Component Renderers
import { AnimatedListRenderer } from './renderers/components/AnimatedListRenderer';
import { FluidGlassRenderer } from './renderers/components/FluidGlassRenderer';
import { TiltedCardRenderer } from './renderers/components/TiltedCardRenderer';
import { DockRenderer } from './renderers/components/DockRenderer';

export interface ComponentRendererProps {
  componentType: string;
  renderProps: ComponentRenderProps;
}

/**
 * Registry of component renderers
 */
const COMPONENT_RENDERERS: Record<string, React.ComponentType<ComponentRenderProps>> = {
  // Basic components
  'hero': HeroRenderer,
  'button': ButtonRenderer,
  'card': CardRenderer,

  // Text animations
  'blur-text': BlurTextRenderer,
  'split-text': SplitTextRenderer,
  'circular-text': CircularTextRenderer,
  'shiny-text': ShinyTextRenderer,
  'gradient-text': GradientTextRenderer,
  'text-pressure': TextPressureRenderer,
  'curved-loop': CurvedLoopRenderer,
  'fuzzy-text': FuzzyTextRenderer,
  'text-trail': TextTrailRenderer,
  'falling-text': FallingTextRenderer,
  'text-cursor': TextCursorRenderer,
  'decrypted-text': DecryptedTextRenderer,
  'scramble-text': ScrambleTextRenderer,
  'count-up': CountUpRenderer,
  'rotating-text': RotatingTextRenderer,
  'glitch-text': GlitchTextRenderer,
  'scroll-reveal': ScrollRevealRenderer,
  'true-focus': TrueFocusRenderer,
  'ascii-text': ASCIITextRenderer,
  'scroll-float': ScrollFloatRenderer,
  'scroll-velocity': ScrollVelocityRenderer,
  'variable-proximity': VariableProximityRenderer,

  // General animations
  'fade-content': FadeContentRenderer,
  'pixel-transition': PixelTransitionRenderer,
  'glare-hover': GlareHoverRenderer,
  'animated-content': AnimatedContentRenderer,
  'magnet-lines': MagnetLinesRenderer,
  'click-spark': ClickSparkRenderer,
  'magnet': MagnetRenderer,
  'floating-elements': FloatingElementsRenderer,
  'morphing-shapes': MorphingShapesRenderer,
  'ripple-effect': RippleEffectRenderer,
  'parallax-scroll': ParallaxScrollRenderer,
  'pixel-trail': PixelTrailRenderer,
  'cubes': CubesRenderer,
  'meta-balls': MetaBallsRenderer,
  'blob-cursor': BlobCursorRenderer,
  'star-border': StarBorderRenderer,
  'metallic-paint': MetallicPaintRenderer,
  'noise': NoiseRenderer,
  'crosshair': CrosshairRenderer,
  'image-trail': ImageTrailRenderer,
  'ribbons': RibbonsRenderer,
  'splash-cursor': SplashCursorRenderer,

  // Backgrounds
  'aurora': AuroraRenderer,
  'beams': BeamsRenderer,
  'particles': ParticlesRenderer,
  'silk': SilkRenderer,
  'grid': GridRenderer,
  'waves': WavesRenderer,

  // Advanced Components
  'animated-list': AnimatedListRenderer,
  'fluid-glass': FluidGlassRenderer,
  'tilted-card': TiltedCardRenderer,
  'dock': DockRenderer,
};

/**
 * Main component renderer that delegates to specific renderers
 */
export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  componentType,
  renderProps
}) => {
  const RendererComponent = COMPONENT_RENDERERS[componentType];

  if (!RendererComponent) {
    return (
      <div className="parametric-unknown-component" style={{
        padding: '16px',
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6b7280',
        backgroundColor: '#f9fafb'
      }}>
        <h4>Unknown Component Type</h4>
        <p>No renderer found for component type: <code>{componentType}</code></p>
        <details style={{ marginTop: '8px', textAlign: 'left' }}>
          <summary>Available Renderers</summary>
          <ul style={{ marginTop: '8px' }}>
            {Object.keys(COMPONENT_RENDERERS).map(type => (
              <li key={type}><code>{type}</code></li>
            ))}
          </ul>
        </details>
      </div>
    );
  }

  try {
    return <RendererComponent {...renderProps} />;
  } catch (error) {
    return (
      <div className="parametric-render-error" style={{
        padding: '16px',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
        color: '#dc2626'
      }}>
        <h4>Render Error</h4>
        <p>Failed to render component type: <code>{componentType}</code></p>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
};

/**
 * Register a new component renderer
 */
export function registerRenderer(
  componentType: string, 
  renderer: React.ComponentType<ComponentRenderProps>
): void {
  COMPONENT_RENDERERS[componentType] = renderer;
}

/**
 * Get all registered component types
 */
export function getRegisteredTypes(): string[] {
  return Object.keys(COMPONENT_RENDERERS);
}

/**
 * Check if a component type has a registered renderer
 */
export function hasRenderer(componentType: string): boolean {
  return componentType in COMPONENT_RENDERERS;
}
