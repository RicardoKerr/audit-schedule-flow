
import React from 'react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  onPrevious?: () => void;
  onNext: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
  showPrevious?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onPrevious,
  onNext,
  nextLabel = "Próximo",
  isNextDisabled = false,
  showPrevious = true,
}) => {
  return (
    <div className="flex justify-between mt-8">
      {showPrevious ? (
        <Button 
          variant="outline"
          onClick={onPrevious}
          className="text-audit-blue border-audit-blue hover:bg-audit-blue/10"
        >
          Anterior
        </Button>
      ) : (
        <div></div>
      )}
      
      <Button 
        onClick={onNext}
        disabled={isNextDisabled}
        className="bg-audit-blue hover:bg-audit-blue/90 text-white"
      >
        {nextLabel}
      </Button>
    </div>
  );
};

export default StepNavigation;
