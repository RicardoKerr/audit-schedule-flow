
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { formatDatePtBR, getAvailableTimeSlots } from '@/utils/dateUtils';
import StepNavigation from './StepNavigation';
import { BookingData } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSelectionProps {
  bookingData: BookingData;
  selectedTime: string | null;
  onTimeChange: (time: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({ 
  bookingData, 
  selectedTime,
  onTimeChange, 
  onNext, 
  onPrevious 
}) => {
  const [availableSlots, setAvailableSlots] = useState<{time: string, id: string}[]>([]);
  
  useEffect(() => {
    if (bookingData.date) {
      const slots = getAvailableTimeSlots(bookingData.date);
      setAvailableSlots(slots);
    }
  }, [bookingData.date]);

  const subjectLabel = bookingData.subject === 'financial' 
    ? 'Auditoria Financeira' 
    : bookingData.subject === 'accounting' 
      ? 'Auditoria Contábil' 
      : bookingData.subject === 'fiscal' 
        ? 'Auditoria Fiscal' 
        : bookingData.otherSubject || 'Outro';

  return (
    <Card className="p-6 animate-fade-in">
      <h2 className="text-xl font-medium mb-4 text-center">Escolha o Horário Disponível</h2>
      
      {bookingData.date && (
        <div className="bg-audit-light p-4 rounded-lg mb-6">
          <p className="font-medium">Data selecionada:</p>
          <p className="text-audit-blue">{formatDatePtBR(bookingData.date)}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {availableSlots.map((slot) => (
          <Button
            key={slot.id}
            variant="outline"
            className={cn(
              "flex items-center justify-center gap-2 py-6",
              selectedTime === slot.time 
                ? "bg-audit-teal text-white border-audit-teal hover:bg-audit-teal hover:text-white" 
                : "hover:bg-audit-light"
            )}
            onClick={() => onTimeChange(slot.time)}
          >
            <Clock className="h-4 w-4" />
            <span>{slot.time}</span>
            {selectedTime === slot.time && <CheckCircle className="h-4 w-4 ml-1" />}
          </Button>
        ))}
      </div>
      
      {selectedTime && (
        <div className="border border-audit-light rounded-lg p-4 mb-6">
          <h3 className="font-medium text-lg mb-3">Resumo do Agendamento</h3>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium">Nome:</span>
              <span className="col-span-2">{bookingData.fullName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium">Data:</span>
              <span className="col-span-2">
                {bookingData.date ? formatDatePtBR(bookingData.date) : ''}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium">Horário:</span>
              <span className="col-span-2">{selectedTime}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium">Assunto:</span>
              <span className="col-span-2">{subjectLabel}</span>
            </div>
          </div>
        </div>
      )}
      
      <StepNavigation 
        onNext={onNext} 
        onPrevious={onPrevious}
        nextLabel="Confirmar Agendamento"
        isNextDisabled={!selectedTime}
      />
    </Card>
  );
};

export default TimeSelection;
