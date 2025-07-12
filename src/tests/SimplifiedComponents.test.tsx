/**
 * Test file for simplified components
 * Verifies that simplified components work correctly with the parametric system
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SimplifiedButtonRenderer } from '../components/renderers/simplified/SimplifiedButtonRenderer';
import { SimplifiedHeroRenderer } from '../components/renderers/simplified/SimplifiedHeroRenderer';
import { SimplifiedCardRenderer } from '../components/renderers/simplified/SimplifiedCardRenderer';
import { ComponentRenderProps } from '../types/parametric';

describe('Simplified Components', () => {
  const defaultRenderProps: ComponentRenderProps = {
    parameters: {},
    style: {},
    className: '',
    children: undefined
  };

  describe('SimplifiedButtonRenderer', () => {
    it('renders with default parameters', () => {
      render(<SimplifiedButtonRenderer {...defaultRenderProps} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Button');
    });

    it('applies custom parameters correctly', () => {
      const customProps: ComponentRenderProps = {
        ...defaultRenderProps,
        parameters: {
          backgroundColor: '#ff0000',
          textColor: '#ffffff',
          fontSize: 20,
          variant: 'outlined'
        }
      };

      render(<SimplifiedButtonRenderer {...customProps} />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveStyle({
        fontSize: '20px',
        color: '#ff0000' // outlined variant shows backgroundColor as text color
      });
    });

    it('handles hover interactions', () => {
      render(<SimplifiedButtonRenderer {...defaultRenderProps} />);
      const button = screen.getByRole('button');
      
      fireEvent.mouseEnter(button);
      // Button should have hover styles applied
      expect(button).toHaveStyle({
        transform: 'scale(1.05)' // default hoverScale
      });
      
      fireEvent.mouseLeave(button);
      expect(button).toHaveStyle({
        transform: 'scale(1)'
      });
    });

    it('supports disabled state', () => {
      const disabledProps: ComponentRenderProps = {
        ...defaultRenderProps,
        parameters: { disabled: true }
      };

      render(<SimplifiedButtonRenderer {...disabledProps} />);
      const button = screen.getByRole('button');
      
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({ opacity: '0.6' });
    });

    it('renders custom children', () => {
      const customProps: ComponentRenderProps = {
        ...defaultRenderProps,
        children: 'Custom Button Text'
      };

      render(<SimplifiedButtonRenderer {...customProps} />);
      expect(screen.getByText('Custom Button Text')).toBeInTheDocument();
    });
  });

  describe('SimplifiedHeroRenderer', () => {
    it('renders with default parameters', () => {
      render(<SimplifiedHeroRenderer {...defaultRenderProps} />);
      const hero = screen.getByText('Parametric Design System');
      expect(hero).toBeInTheDocument();
    });

    it('applies layout parameters correctly', () => {
      const customProps: ComponentRenderProps = {
        ...defaultRenderProps,
        parameters: {
          layout: 'left',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontSize: 32
        }
      };

      render(<SimplifiedHeroRenderer {...customProps} />);
      const heroContainer = screen.getByText('Parametric Design System').closest('div');
      
      expect(heroContainer).toHaveStyle({
        fontSize: '32px',
        color: '#ffffff',
        justifyContent: 'flex-start' // left layout
      });
    });

    it('supports gradient backgrounds', () => {
      const gradientProps: ComponentRenderProps = {
        ...defaultRenderProps,
        parameters: {
          gradient: true,
          backgroundColor: '#ff0000',
          gradientDirection: '45deg'
        }
      };

      render(<SimplifiedHeroRenderer {...gradientProps} />);
      const heroContainer = screen.getByText('Parametric Design System').closest('div');
      
      expect(heroContainer).toHaveStyle({
        background: 'linear-gradient(45deg, #ff0000, #ff0000dd)'
      });
    });

    it('renders custom children', () => {
      const customProps: ComponentRenderProps = {
        ...defaultRenderProps,
        children: <div>Custom Hero Content</div>
      };

      render(<SimplifiedHeroRenderer {...customProps} />);
      expect(screen.getByText('Custom Hero Content')).toBeInTheDocument();
    });
  });

  describe('SimplifiedCardRenderer', () => {
    it('renders with default parameters', () => {
      render(<SimplifiedCardRenderer {...defaultRenderProps} />);
      const card = screen.getByText('Card Title');
      expect(card).toBeInTheDocument();
    });

    it('applies layout parameters correctly', () => {
      const customProps: ComponentRenderProps = {
        ...defaultRenderProps,
        parameters: {
          layout: 'horizontal',
          backgroundColor: '#f0f0f0',
          borderRadius: 16,
          padding: 32
        }
      };

      render(<SimplifiedCardRenderer {...customProps} />);
      const cardContainer = screen.getByText('Card Title').closest('div');
      
      expect(cardContainer).toHaveStyle({
        backgroundColor: '#f0f0f0',
        borderRadius: '16px',
        padding: '32px',
        flexDirection: 'row' // horizontal layout
      });
    });

    it('handles hover interactions when interactive', () => {
      const interactiveProps: ComponentRenderProps = {
        ...defaultRenderProps,
        parameters: { interactive: true, hoverLift: 8 }
      };

      render(<SimplifiedCardRenderer {...interactiveProps} />);
      const card = screen.getByRole('button'); // interactive cards have button role
      
      fireEvent.mouseEnter(card);
      expect(card).toHaveStyle({
        transform: 'translateY(-8px)'
      });
      
      fireEvent.mouseLeave(card);
      expect(card).toHaveStyle({
        transform: 'translateY(-0px)'
      });
    });

    it('supports non-interactive mode', () => {
      const nonInteractiveProps: ComponentRenderProps = {
        ...defaultRenderProps,
        parameters: { interactive: false }
      };

      render(<SimplifiedCardRenderer {...nonInteractiveProps} />);
      const card = screen.getByRole('article'); // non-interactive cards have article role
      expect(card).toHaveStyle({ cursor: 'default' });
    });

    it('renders custom children', () => {
      const customProps: ComponentRenderProps = {
        ...defaultRenderProps,
        children: <div>Custom Card Content</div>
      };

      render(<SimplifiedCardRenderer {...customProps} />);
      expect(screen.getByText('Custom Card Content')).toBeInTheDocument();
    });
  });

  describe('Parameter Integration', () => {
    it('all components accept and apply style overrides', () => {
      const styleProps: ComponentRenderProps = {
        ...defaultRenderProps,
        style: { border: '2px solid red' },
        className: 'custom-class'
      };

      const { rerender } = render(<SimplifiedButtonRenderer {...styleProps} />);
      let element = screen.getByRole('button');
      expect(element).toHaveStyle({ border: '2px solid red' });
      expect(element).toHaveClass('custom-class');

      rerender(<SimplifiedHeroRenderer {...styleProps} />);
      element = screen.getByText('Parametric Design System').closest('div')!;
      expect(element).toHaveStyle({ border: '2px solid red' });
      expect(element).toHaveClass('custom-class');

      rerender(<SimplifiedCardRenderer {...styleProps} />);
      element = screen.getByText('Card Title').closest('div')!;
      expect(element).toHaveStyle({ border: '2px solid red' });
      expect(element).toHaveClass('custom-class');
    });
  });
});
