import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Stepper from '../../../components/shared/Stepper';

describe('Stepper', () => {
  const mockSteps = [
    { id: '1', title: 'Step 1' },
    { id: '2', title: 'Step 2' },
    { id: '3', title: 'Step 3' },
  ];

  it('renders all steps', () => {
    render(<Stepper steps={mockSteps} currentStep={0} />);
    
    mockSteps.forEach(step => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it('shows correct active step', () => {
    render(<Stepper steps={mockSteps} currentStep={1} />);
    
    const steps = screen.getAllByRole('button');
    expect(steps[1]).toHaveClass('bg-primary-100');
  });

  it('calls onStepClick when clicking a step', () => {
    const onStepClick = vi.fn();
    render(<Stepper steps={mockSteps} currentStep={1} onStepClick={onStepClick} />);
    
    const steps = screen.getAllByRole('button');
    fireEvent.click(steps[0]);
    
    expect(onStepClick).toHaveBeenCalledWith(0);
  });

  it('disables steps after current step', () => {
    render(<Stepper steps={mockSteps} currentStep={1} />);
    
    const steps = screen.getAllByRole('button');
    expect(steps[2]).toBeDisabled();
  });
});