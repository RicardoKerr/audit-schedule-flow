
import React from 'react';
import BookingHeader from './BookingHeader';
import BookingSteps from './BookingSteps';
import { BookingStep } from '@/types/booking';

interface BookingLayoutProps {
  children: React.ReactNode;
  currentStep: BookingStep;
  showSteps?: boolean;
}

const BookingLayout: React.FC<BookingLayoutProps> = ({ 
  children, 
  currentStep,
  showSteps = true
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <BookingHeader />
        {showSteps && currentStep < 4 && <BookingSteps currentStep={currentStep} />}
        <div className="max-w-xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BookingLayout;
