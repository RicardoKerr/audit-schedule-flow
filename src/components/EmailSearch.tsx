
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buscarAgendamentosPorEmail } from '@/services/agendamentoService';
import { Agendamento } from '@/services/agendamentoService';

interface EmailSearchProps {
  onAgendamentosFound: (agendamentos: Agendamento[]) => void;
  onVoltar: () => void;
  actionLabel: string;
}

const EmailSearch: React.FC<EmailSearchProps> = ({ 
  onAgendamentosFound, 
  onVoltar,
  actionLabel 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!email.trim()) {
      setError('O email é obrigatório');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const agendamentos = await buscarAgendamentosPorEmail(email);
      if (agendamentos.length === 0) {
        toast.error('Nenhum agendamento encontrado para este email');
        return;
      }
      onAgendamentosFound(agendamentos);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast.error('Erro ao buscar agendamentos. Tente novamente.');
      setError('Não foi possível buscar seus agendamentos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-audit-blue mb-4 text-center">
        {actionLabel} Agendamento
      </h2>
      
      <div className="space-y-6 my-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email<span className="text-audit-error">*</span></Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o email usado no agendamento"
            className={cn(error && "border-audit-error")}
          />
          {error && (
            <p className="text-audit-error text-sm">{error}</p>
          )}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline"
            onClick={onVoltar}
            className="text-audit-blue border-audit-blue hover:bg-audit-blue/10"
          >
            Voltar
          </Button>
          
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-audit-blue hover:bg-audit-blue/90 text-white"
          >
            {isLoading ? 'Buscando...' : 'Buscar Agendamentos'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EmailSearch;
