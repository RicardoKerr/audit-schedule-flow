
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { formatDatePtBR, isDateAvailable } from '@/utils/dateUtils';
import StepNavigation from './StepNavigation';
import { Calendar } from '@/components/ui/calendar';
import { addMonths, format, isToday, isWeekend, set, startOfMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateSelectionProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ 
  selectedDate, 
  onDateChange, 
  onNext, 
  onPrevious 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthOffset, setMonthOffset] = useState(0);

  const handleDayClick = (day: Date | undefined) => {
    if (day && isDateAvailable(day)) {
      onDateChange(day);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = startOfMonth(addMonths(prevMonth, -1));
      if (newMonth >= new Date()) {
        setMonthOffset(monthOffset - 1);
        return newMonth;
      }
      return prevMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = startOfMonth(addMonths(prevMonth, 1));
      if (newMonth < addMonths(new Date(), 3)) {
        setMonthOffset(monthOffset + 1);
        return newMonth;
      }
      return prevMonth;
    });
  };

  const isPreviousMonthDisabled = monthOffset <= 0 && currentMonth <= new Date();
  const isNextMonthDisabled = monthOffset >= 2;

  return (
    <Card className="p-6 animate-fade-in">
      <h2 className="text-xl font-medium mb-4 text-center">Escolha a Data Desejada</h2>
      
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handlePreviousMonth}
          disabled={isPreviousMonthDisabled}
        >
          <ChevronLeft className="h-4 w-4" />
          Mês Anterior
        </Button>
        <h3 className="font-medium">{format(currentMonth, 'MMMM yyyy').charAt(0).toUpperCase() + format(currentMonth, 'MMMM yyyy').slice(1)}</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleNextMonth}
          disabled={isNextMonthDisabled}
        >
          Próximo Mês
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate || undefined}
        onSelect={(day) => handleDayClick(day)}
        month={currentMonth}
        className={cn("mx-auto pointer-events-auto border rounded-md p-3")}
        disabled={[
          (date) => !isDateAvailable(date),
          (date) => isWeekend(date),
          (date) => date < new Date() && !isToday(date)
        ]}
        modifiers={{
          selected: selectedDate ? [selectedDate] : [],
          available: Array(90).fill(0).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return isDateAvailable(date) ? date : null;
          }).filter(Boolean) as Date[]
        }}
        modifiersClassNames={{
          selected: 'bg-audit-blue text-white hover:bg-audit-blue hover:text-white',
          available: 'bg-audit-light hover:bg-audit-teal hover:text-white'
        }}
      />
      
      {selectedDate && (
        <div className="mt-4 p-3 bg-audit-light rounded-lg text-center">
          <p className="font-medium">Data selecionada:</p>
          <p className="text-audit-blue">{formatDatePtBR(selectedDate)}</p>
        </div>
      )}
      
      <StepNavigation 
        onNext={onNext} 
        onPrevious={onPrevious}
        nextLabel="Selecionar Horário"
        isNextDisabled={!selectedDate}
      />
    </Card>
  );
};

export default DateSelection;
