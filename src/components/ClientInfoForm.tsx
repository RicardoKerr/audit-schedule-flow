
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StepNavigation from './StepNavigation';
import { ClientInfo } from '@/types/booking';
import { cn } from '@/lib/utils';

interface ClientInfoFormProps {
  clientInfo: ClientInfo;
  onClientInfoChange: (info: ClientInfo) => void;
  onNext: () => void;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({ clientInfo, onClientInfoChange, onNext }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInfo, string>>>({});
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone: string) => {
    // Simplified validation for Brazilian phone with optional country code
    const phoneRegex = /^(?:(?:\+|00)55|)?(?:\s|\()?(\d{2})(?:\s|\))?\s?(\d{4,5})(?:-|\s)?(\d{4})$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (field: keyof ClientInfo, value: string) => {
    const newClientInfo = { ...clientInfo, [field]: value };
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    onClientInfoChange(newClientInfo);
  };

  const handleNext = () => {
    // Validate all fields
    const newErrors: Partial<Record<keyof ClientInfo, string>> = {};
    
    if (!clientInfo.fullName.trim()) {
      newErrors.fullName = "O nome é obrigatório";
    }
    
    if (!clientInfo.email.trim()) {
      newErrors.email = "O email é obrigatório";
    } else if (!validateEmail(clientInfo.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!clientInfo.phone.trim()) {
      newErrors.phone = "O telefone é obrigatório";
    } else if (!validatePhone(clientInfo.phone)) {
      newErrors.phone = "Formato inválido";
    }
    
    if (!clientInfo.subject) {
      newErrors.subject = "Selecione um assunto";
    } else if (clientInfo.subject === 'other' && !clientInfo.otherSubject?.trim()) {
      newErrors.otherSubject = "Especifique o assunto";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onNext();
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Completo<span className="text-audit-error">*</span></Label>
          <Input
            id="fullName"
            value={clientInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={cn(errors.fullName && "border-audit-error")}
          />
          {errors.fullName && (
            <p className="text-audit-error text-sm">{errors.fullName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email<span className="text-audit-error">*</span></Label>
          <Input
            id="email"
            type="email"
            value={clientInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={cn(errors.email && "border-audit-error")}
          />
          {errors.email && (
            <p className="text-audit-error text-sm">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone<span className="text-audit-error">*</span></Label>
          <Input
            id="phone"
            value={clientInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+55 (XX) XXXXX-XXXX"
            className={cn(errors.phone && "border-audit-error")}
          />
          {errors.phone && (
            <p className="text-audit-error text-sm">{errors.phone}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Assunto<span className="text-audit-error">*</span></Label>
          <Select
            value={clientInfo.subject}
            onValueChange={(value) => handleChange('subject', value)}
          >
            <SelectTrigger className={cn(errors.subject && "border-audit-error")}>
              <SelectValue placeholder="Selecione um assunto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financial">Auditoria Financeira</SelectItem>
              <SelectItem value="accounting">Auditoria Contábil</SelectItem>
              <SelectItem value="fiscal">Auditoria Fiscal</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-audit-error text-sm">{errors.subject}</p>
          )}
        </div>
        
        {clientInfo.subject === 'other' && (
          <div className="space-y-2">
            <Label htmlFor="otherSubject">Especifique<span className="text-audit-error">*</span></Label>
            <Input
              id="otherSubject"
              value={clientInfo.otherSubject || ''}
              onChange={(e) => handleChange('otherSubject', e.target.value)}
              className={cn(errors.otherSubject && "border-audit-error")}
            />
            {errors.otherSubject && (
              <p className="text-audit-error text-sm">{errors.otherSubject}</p>
            )}
          </div>
        )}
      </div>
      
      <StepNavigation 
        onNext={handleNext} 
        showPrevious={false}
        nextLabel="Selecionar Data"
        isNextDisabled={false}
      />
    </Card>
  );
};

export default ClientInfoForm;
