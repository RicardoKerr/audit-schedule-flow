
import { supabase } from '@/integrations/supabase/client';

export interface Agendamento {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  outro_assunto?: string;
  data: string;
  horario: string;
  status: 'confirmado' | 'remarcado' | 'cancelado';
  created_at?: string;
  updated_at?: string;
}

export const buscarAgendamentosPorEmail = async (email: string): Promise<Agendamento[]> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('email', email)
    .eq('status', 'confirmado')
    .order('data', { ascending: true });
  
  if (error) {
    console.error('Erro ao buscar agendamentos:', error);
    throw new Error('Não foi possível buscar os agendamentos');
  }
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as 'confirmado' | 'remarcado' | 'cancelado'
  })) as Agendamento[];
};

export const remarcarAgendamento = async (
  id: string, 
  novaData: string, 
  novoHorario: string
): Promise<void> => {
  const { error } = await supabase
    .from('agendamentos')
    .update({ 
      data: novaData,
      horario: novoHorario,
      status: 'remarcado',
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao remarcar agendamento:', error);
    throw new Error('Não foi possível remarcar o agendamento');
  }
};

export const cancelarAgendamento = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('agendamentos')
    .update({ 
      status: 'cancelado',
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao cancelar agendamento:', error);
    throw new Error('Não foi possível cancelar o agendamento');
  }
};

export const criarAgendamento = async (agendamento: Omit<Agendamento, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .insert([agendamento])
    .select('id')
    .single();
  
  if (error) {
    console.error('Erro ao criar agendamento:', error);
    throw new Error('Não foi possível criar o agendamento');
  }
  
  return data.id;
};
