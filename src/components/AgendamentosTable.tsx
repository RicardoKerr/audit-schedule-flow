
import React, { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Agendamento, cancelarAgendamento } from '@/services/agendamentoService';
import { CalendarCheck, RefreshCcw, X } from 'lucide-react';

interface AgendamentosTableProps {
  agendamentos: Agendamento[];
  onVoltar: () => void;
  onRemarcar?: (agendamento: Agendamento) => void;
  onCancelar?: (agendamento: Agendamento) => void;
  modo: 'remarcar' | 'cancelar';
}

const AgendamentosTable: React.FC<AgendamentosTableProps> = ({
  agendamentos,
  onVoltar,
  onRemarcar,
  onCancelar,
  modo
}) => {
  const [carregando, setCarregando] = useState<string | null>(null);

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  const getAssuntoFormatado = (agendamento: Agendamento) => {
    if (agendamento.assunto === 'other' && agendamento.outro_assunto) {
      return agendamento.outro_assunto;
    }
    
    const assuntos = {
      'financial': 'Auditoria Financeira',
      'accounting': 'Auditoria Contábil',
      'fiscal': 'Auditoria Fiscal',
      'other': 'Outro'
    };
    
    return assuntos[agendamento.assunto as keyof typeof assuntos] || agendamento.assunto;
  };

  const handleAction = async (agendamento: Agendamento) => {
    setCarregando(agendamento.id);
    
    try {
      if (modo === 'remarcar' && onRemarcar) {
        onRemarcar(agendamento);
      } else if (modo === 'cancelar' && onCancelar) {
        await cancelarAgendamento(agendamento.id);
        toast.success('Agendamento cancelado com sucesso!');
        onVoltar();
      }
    } catch (error) {
      console.error(`Erro ao ${modo === 'remarcar' ? 'remarcar' : 'cancelar'} agendamento:`, error);
      toast.error(`Não foi possível ${modo === 'remarcar' ? 'remarcar' : 'cancelar'} o agendamento`);
    } finally {
      setCarregando(null);
    }
  };

  const getActionButton = (agendamento: Agendamento) => {
    if (modo === 'remarcar') {
      return (
        <Button
          onClick={() => handleAction(agendamento)}
          disabled={carregando === agendamento.id}
          className="bg-audit-blue hover:bg-audit-blue/90 text-white"
        >
          <RefreshCcw className="mr-1" size={16} />
          Remarcar
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => handleAction(agendamento)}
          disabled={carregando === agendamento.id}
          variant="destructive"
        >
          <X className="mr-1" size={16} />
          Cancelar
        </Button>
      );
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-audit-blue mb-4 text-center">
        {modo === 'remarcar' ? 'Remarcar' : 'Cancelar'} Agendamento
      </h2>
      
      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agendamentos.map((agendamento) => (
              <TableRow key={agendamento.id}>
                <TableCell>{formatarData(agendamento.data)}</TableCell>
                <TableCell>{agendamento.horario}</TableCell>
                <TableCell>{getAssuntoFormatado(agendamento)}</TableCell>
                <TableCell>
                  {getActionButton(agendamento)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6">
        <Button 
          variant="outline"
          onClick={onVoltar}
          className="text-audit-blue border-audit-blue hover:bg-audit-blue/10"
        >
          Voltar
        </Button>
      </div>
    </Card>
  );
};

export default AgendamentosTable;
