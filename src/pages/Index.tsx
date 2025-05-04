
import React, { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import BookingLayout from '@/components/BookingLayout';
import ClientInfoForm from '@/components/ClientInfoForm';
import DateSelection from '@/components/DateSelection';
import TimeSelection from '@/components/TimeSelection';
import BookingComplete from '@/components/BookingComplete';
import { BookingData, BookingStep, ClientInfo } from '@/types/booking';
import { submitBooking } from '@/services/bookingService';

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
        const response = await submitBooking(bookingData);
        
        if (response.success) {
          setBookingId(response.bookingId);
          setCurrentStep(4);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error('Error submitting booking:', error);
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

  const renderStep = () => {
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
        return <BookingComplete booking={bookingData} bookingId={bookingId} />;
      default:
        return null;
    }
  };

  return (
    <BookingLayout currentStep={currentStep} showSteps={currentStep < 4}>
      {renderStep()}
    </BookingLayout>
  );
};

export default Index;
