
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookingData } from '@/types/booking';
import { formatDatePtBR } from '@/utils/dateUtils';
import { CheckCircle, Clock, Calendar, Mail, Phone, FileText } from 'lucide-react';

interface BookingCompleteProps {
  booking: BookingData;
  bookingId?: string;
}

const BookingComplete: React.FC<BookingCompleteProps> = ({ booking, bookingId }) => {
  const subjectLabel = booking.subject === 'financial' 
    ? 'Auditoria Financeira' 
    : booking.subject === 'accounting' 
      ? 'Auditoria Contábil' 
      : booking.subject === 'fiscal' 
        ? 'Auditoria Fiscal' 
        : booking.otherSubject || 'Outro';

  return (
    <Card className="p-6 animate-fade-in">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-audit-success/20 p-3 rounded-full">
            <CheckCircle className="h-10 w-10 text-audit-success" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-audit-blue mb-2">Agendamento Confirmado!</h2>
        <p className="text-gray-600">
          Seu agendamento foi confirmado com sucesso. Em breve você receberá um e-mail com todos os detalhes.
        </p>
        {bookingId && (
          <p className="mt-2 text-sm text-gray-500">
            ID do agendamento: {bookingId}
          </p>
        )}
      </div>

      <div className="bg-audit-light rounded-lg p-5">
        <h3 className="font-medium text-lg mb-4 text-audit-blue">Detalhes do Agendamento</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 mr-3 text-audit-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Data</p>
              <p>{booking.date ? formatDatePtBR(booking.date) : ''}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-3 text-audit-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Horário</p>
              <p>{booking.time}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FileText className="h-5 w-5 mr-3 text-audit-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Assunto</p>
              <p>{subjectLabel}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Mail className="h-5 w-5 mr-3 text-audit-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Email</p>
              <p>{booking.email}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-5 w-5 mr-3 text-audit-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Telefone</p>
              <p>{booking.phone}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Caso precise alterar ou cancelar seu agendamento, 
          utilize os links enviados para o seu e-mail.
        </p>
      </div>
    </Card>
  );
};

export default BookingComplete;
