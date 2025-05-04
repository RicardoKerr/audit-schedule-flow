
import React from 'react';

const BookingHeader: React.FC = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-audit-blue mb-2">
        Agende sua Auditoria
      </h1>
      <p className="text-audit-dark/70 max-w-2xl mx-auto">
        Preencha os campos abaixo para agendar uma sessão de auditoria com nossos especialistas.
      </p>
    </div>
  );
};

export default BookingHeader;
