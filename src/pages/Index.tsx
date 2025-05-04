
import React, { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import BookingLayout from '@/components/BookingLayout';
import ClientInfoForm from '@/components/ClientInfoForm';
import DateSelection from '@/components/DateSelection';
import TimeSelection from '@/components/TimeSelection';
import BookingComplete from '@/components/BookingComplete';
import EmailSearch from '@/components/EmailSearch';
import AgendamentosTable from '@/components/AgendamentosTable';
import RemarcarAgendamento from '@/components/RemarcarAgendamento';
import { BookingData, BookingStep, ClientInfo } from '@/types/booking';
import { submitBooking } from '@/services/bookingService';
import { Agendamento, criarAgendamento } from '@/services/agendamentoService';
import { CalendarCheck, RefreshCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AcaoAgendamento = 'agendar' | 'remarcar' | 'cancelar' | null;

const Index = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    date: null,
    time: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | undefined>();
  const [tipoAcao, setTipoAcao] = useState<AcaoAgendamento>('agendar');
  const [agendamentosSelecionados, setAgendamentosSelecionados] = useState<Agendamento[]>([]);
  const [agendamentoAtual, setAgendamentoAtual] = useState<Agendamento | null>(null);

  const resetarFormulario = () => {
    setBookingData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      date: null,
      time: null,
    });
    setCurrentStep(1);
    setBookingId(undefined);
    setAgendamentosSelecionados([]);
    setAgendamentoAtual(null);
  };

  const selecionarAcao = (acao: AcaoAgendamento) => {
    setTipoAcao(acao);
    resetarFormulario();
    if (acao === 'agendar') {
      setCurrentStep(1);
    } else {
      setCurrentStep(5); // Passo para busca por email
    }
  };

  const handleClientInfoChange = (clientInfo: ClientInfo) => {
    setBookingData(prev => ({ ...prev, ...clientInfo }));
  };

  const handleDateChange = (date: Date) => {
    setBookingData(prev => ({ ...prev, date }));
  };

  const handleTimeChange = (time: string) => {
    setBookingData(prev => ({ ...prev, time }));
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as BookingStep);
    } else {
      // Submit booking
      try {
        setIsSubmitting(true);
        
        if (bookingData.date && bookingData.time) {
          // Criar agendamento no Supabase
          const novoAgendamento = {
            nome: bookingData.fullName,
            email: bookingData.email,
            telefone: bookingData.phone,
            assunto: bookingData.subject,
            outro_assunto: bookingData.otherSubject,
            data: bookingData.date.toISOString().split('T')[0],
            horario: bookingData.time,
            status: 'confirmado' as const
          };
          
          const id = await criarAgendamento(novoAgendamento);
          setBookingId(id);
        }
        
        setCurrentStep(4);
        toast.success('Agendamento realizado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        toast.error('Ocorreu um erro ao confirmar o agendamento. Por favor, tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as BookingStep);
    }
  };

  const handleAgendamentosEncontrados = (agendamentos: Agendamento[]) => {
    setAgendamentosSelecionados(agendamentos);
    setCurrentStep(6); // Passo para exibir a tabela de agendamentos
  };

  const handleRemarcarSelecionado = (agendamento: Agendamento) => {
    setAgendamentoAtual(agendamento);
    setCurrentStep(7); // Passo para remarcar
  };

  const handleVoltar = () => {
    if (currentStep === 5 || currentStep === 4) {
      selecionarAcao(null);
    } else if (currentStep === 6) {
      setCurrentStep(5); // Voltar para busca de email
    } else if (currentStep === 7) {
      setCurrentStep(6); // Voltar para a lista de agendamentos
    } else {
      handlePrevious();
    }
  };

  const renderAcoesIniciais = () => {
    return (
      <div className="max-w-md mx-auto p-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-audit-blue mb-6 text-center">
          Gerenciamento de Auditoria
        </h1>
        
        <div className="space-y-4">
          <Button 
            onClick={() => selecionarAcao('agendar')}
            className="bg-audit-blue hover:bg-audit-blue/90 text-white w-full py-6 text-lg"
          >
            <CalendarCheck className="mr-2" size={24} />
            Agendar Auditoria
          </Button>
          
          <Button 
            onClick={() => selecionarAcao('remarcar')}
            variant="outline"
            className="border-audit-blue text-audit-blue hover:bg-audit-blue/10 w-full py-6 text-lg"
          >
            <RefreshCcw className="mr-2" size={24} />
            Remarcar Agendamento
          </Button>
          
          <Button 
            onClick={() => selecionarAcao('cancelar')}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10 w-full py-6 text-lg"
          >
            <X className="mr-2" size={24} />
            Cancelar Agendamento
          </Button>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    if (tipoAcao === null) {
      return renderAcoesIniciais();
    }

    switch (currentStep) {
      case 1:
        return (
          <ClientInfoForm
            clientInfo={bookingData}
            onClientInfoChange={handleClientInfoChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <DateSelection
            selectedDate={bookingData.date}
            onDateChange={handleDateChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <TimeSelection
            bookingData={bookingData}
            selectedTime={bookingData.time}
            onTimeChange={handleTimeChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <BookingComplete 
            booking={bookingData} 
            bookingId={bookingId}
            onVoltar={() => selecionarAcao(null)}
          />
        );
      case 5:
        return (
          <EmailSearch 
            onAgendamentosFound={handleAgendamentosEncontrados}
            onVoltar={() => selecionarAcao(null)}
            actionLabel={tipoAcao === 'remarcar' ? 'Remarcar' : 'Cancelar'}
          />
        );
      case 6:
        return (
          <AgendamentosTable 
            agendamentos={agendamentosSelecionados}
            onVoltar={handleVoltar}
            onRemarcar={tipoAcao === 'remarcar' ? handleRemarcarSelecionado : undefined}
            onCancelar={tipoAcao === 'cancelar' ? () => handleVoltar() : undefined}
            modo={tipoAcao === 'remarcar' ? 'remarcar' : 'cancelar'}
          />
        );
      case 7:
        return agendamentoAtual ? (
          <RemarcarAgendamento 
            agendamento={agendamentoAtual}
            onVoltar={handleVoltar}
            onConcluido={() => selecionarAcao(null)}
          />
        ) : null;
      default:
        return null;
    }
  };

  // Determinar se deve mostrar os passos baseado no tipo de ação e etapa atual
  const showSteps = tipoAcao === 'agendar' && currentStep < 4;

  return (
    <BookingLayout currentStep={tipoAcao === 'agendar' ? currentStep : 1} showSteps={showSteps}>
      {renderStep()}
    </BookingLayout>
  );
};

export default Index;
