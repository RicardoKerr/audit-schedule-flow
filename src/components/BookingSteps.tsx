
import React from 'react';
import { BookingStep } from '../types/booking';
import { cn } from '@/lib/utils';

interface BookingStepsProps {
  currentStep: BookingStep;
}

const BookingSteps: React.FC<BookingStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Informações" },
    { number: 2, title: "Data" },
    { number: 3, title: "Horário" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium",
                  step.number === currentStep 
                    ? "bg-audit-blue" 
                    : step.number < currentStep 
                      ? "bg-audit-teal" 
                      : "bg-gray-300"
                )}
              >
                {step.number < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={cn(
                "mt-2 text-sm",
                step.number === currentStep ? "font-medium" : "text-gray-500"
              )}>
                {step.title}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "h-1 w-16 mx-4",
                  step.number < currentStep ? "bg-audit-teal" : "bg-gray-300"
                )}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingSteps;
