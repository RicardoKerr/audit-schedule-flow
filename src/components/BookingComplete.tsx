
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { BookingData } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { CalendarCheck } from 'lucide-react';

interface BookingCompleteProps {
  booking: BookingData;
  bookingId?: string;
  onVoltar?: () => void;
}

const BookingComplete: React.FC<BookingCompleteProps> = ({ 
  booking, 
  bookingId,
  onVoltar
}) => {
  const formatSubject = (subject: string) => {
    const subjects: Record<string, string> = {
      financial: "Auditoria Financeira",
      accounting: "Auditoria Contábil",
      fiscal: "Auditoria Fiscal",
      other: booking.otherSubject || "Outro",
    };
    return subjects[subject] || subject;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Não especificado";
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Card className="p-6 animate-fade-in space-y-4">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-green-100 rounded-full p-3 mb-2">
          <CalendarCheck className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-audit-blue">Agendamento Confirmado!</h2>
        <p className="text-audit-dark/70 text-center mt-2">
          Seu agendamento foi realizado com sucesso. Enviamos um e-mail de confirmação para {booking.email}.
        </p>
      </div>

      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="font-semibold text-audit-blue mb-3">Detalhes do Agendamento</h3>
        
        <div className="space-y-2">
          <div className="grid grid-cols-[120px_1fr]">
            <span className="text-audit-dark/70">Nome:</span>
            <span className="font-medium">{booking.fullName}</span>
          </div>
          
          <div className="grid grid-cols-[120px_1fr]">
            <span className="text-audit-dark/70">Email:</span>
            <span className="font-medium">{booking.email}</span>
          </div>
          
          <div className="grid grid-cols-[120px_1fr]">
            <span className="text-audit-dark/70">Telefone:</span>
            <span className="font-medium">{booking.phone}</span>
          </div>
          
          <div className="grid grid-cols-[120px_1fr]">
            <span className="text-audit-dark/70">Assunto:</span>
            <span className="font-medium">{formatSubject(booking.subject)}</span>
          </div>
          
          <div className="grid grid-cols-[120px_1fr]">
            <span className="text-audit-dark/70">Data:</span>
            <span className="font-medium">{formatDate(booking.date)}</span>
          </div>
          
          <div className="grid grid-cols-[120px_1fr]">
            <span className="text-audit-dark/70">Horário:</span>
            <span className="font-medium">{booking.time || "Não especificado"}</span>
          </div>

          {bookingId && (
            <div className="grid grid-cols-[120px_1fr]">
              <span className="text-audit-dark/70">Código:</span>
              <span className="font-medium font-mono">{bookingId.substring(0, 8)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        {onVoltar && (
          <Button 
            onClick={onVoltar}
            className="bg-audit-blue hover:bg-audit-blue/90 text-white"
          >
            Voltar ao Início
          </Button>
        )}
      </div>
    </Card>
  );
};

export default BookingComplete;
