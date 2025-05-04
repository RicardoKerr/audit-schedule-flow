
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Agendamento, remarcarAgendamento } from '@/services/agendamentoService';
import DateSelection from './DateSelection';
import TimeSelection from './TimeSelection';
import { BookingData } from '@/types/booking';

interface RemarcarAgendamentoProps {
  agendamento: Agendamento;
  onVoltar: () => void;
  onConcluido: () => void;
}

const RemarcarAgendamento: React.FC<RemarcarAgendamentoProps> = ({
  agendamento,
  onVoltar,
  onConcluido
}) => {
  const [step, setStep] = useState<'data' | 'horario'>('data');
  const [bookingData, setBookingData] = useState<BookingData>({
    fullName: agendamento.nome,
    email: agendamento.email,
    phone: agendamento.telefone,
    subject: agendamento.assunto,
    otherSubject: agendamento.outro_assunto,
    date: null,
    time: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (date: Date) => {
    setBookingData(prev => ({ ...prev, date }));
    setStep('horario');
  };

  const handleTimeChange = (time: string) => {
    setBookingData(prev => ({ ...prev, time }));
  };

  const handleSubmit = async () => {
    if (!bookingData.date || !bookingData.time) {
      toast.error('Selecione uma data e horário para remarcar');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataFormatada = bookingData.date.toISOString().split('T')[0];
      await remarcarAgendamento(
        agendamento.id, 
        dataFormatada,
        bookingData.time
      );
      
      toast.success('Agendamento remarcado com sucesso!');
      onConcluido();
    } catch (error) {
      console.error('Erro ao remarcar agendamento:', error);
      toast.error('Não foi possível remarcar o agendamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'data') {
    return (
      <DateSelection
        selectedDate={bookingData.date}
        onDateChange={handleDateChange}
        onNext={() => {}}
        onPrevious={onVoltar}
      />
    );
  }

  return (
    <Card className="p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-audit-blue mb-4 text-center">
        Selecione um novo horário
      </h2>

      <TimeSelection
        bookingData={bookingData}
        selectedTime={bookingData.time}
        onTimeChange={handleTimeChange}
        onNext={handleSubmit}
        onPrevious={() => setStep('data')}
      />

      <div className="mt-4 text-center">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !bookingData.time}
          className="bg-audit-blue hover:bg-audit-blue/90 text-white w-full"
        >
          {isSubmitting ? 'Processando...' : 'Confirmar Remarcação'}
        </Button>
      </div>
    </Card>
  );
};

export default RemarcarAgendamento;
