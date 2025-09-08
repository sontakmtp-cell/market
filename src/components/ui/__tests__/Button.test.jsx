import { describe, it, expect, vi } from 'vitest';
import { render, screen, checkA11y } from '../../utils/test-utils';
import Button from '../Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button loading loadingText="Saving...">Save</Button>);
    
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('disables button when loading', () => {
    render(<Button loading>Save</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
    
    rerender(<Button variant="outline">Cancel</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border');
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('h-8');
    
    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-12');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Button 
        pressed={true} 
        label="Toggle button" 
        describedBy="help-text"
      >
        Toggle
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', 'Toggle button');
    expect(button).toHaveAttribute('aria-describedby', 'help-text');
  });

  it('meets accessibility standards', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    await checkA11y(container);
  });

  it('handles keyboard navigation', async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>Press me</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('prevents action when disabled', async () => {
    const handleClick = vi.fn();
    const { user } = render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
