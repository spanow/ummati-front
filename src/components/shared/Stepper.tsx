import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="py-6">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex-1">
            <div className="flex items-center">
              <button
                onClick={() => onStepClick?.(index)}
                disabled={index > currentStep}
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                  index < currentStep
                    ? 'bg-primary-500 text-white'
                    : index === currentStep
                    ? 'bg-primary-100 border-2 border-primary-500 text-primary-500'
                    : 'bg-gray-100 text-gray-400'
                } transition-colors ${onStepClick ? 'cursor-pointer' : ''}`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: index < currentStep ? '100%' : '0%' }}
                    className="h-full bg-primary-500"
                  />
                  <div className="h-full w-full bg-gray-200 -mt-0.5" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-8 left-0 w-full text-center">
              <span className={`text-sm font-medium ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stepper;