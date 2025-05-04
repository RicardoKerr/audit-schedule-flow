
import { BookingData, BookingResponse } from "../types/booking";

const WEBHOOK_URL = "https://n8n.rakewells.com/webhook-test/36d0e8b6-f524-4451-856f-41e1e3c20741";

export const submitBooking = async (bookingData: BookingData): Promise<BookingResponse> => {
  try {
    const payload = {
      ...bookingData,
      date: bookingData.date ? bookingData.date.toISOString() : null,
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Erro ao agendar. Por favor, tente novamente.");
    }

    return {
      success: true,
      message: "Seu agendamento foi realizado com sucesso!",
      bookingId: data.bookingId || "temp-id-123",
    };
  } catch (error) {
    console.error("Booking submission error:", error);
    return {
      success: false,
      message: error instanceof Error 
        ? error.message 
        : "Ocorreu um erro ao processar seu agendamento. Por favor, tente novamente.",
    };
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  // In a real implementation, this would check against the database
  // For this demo, we'll simulate a response
  try {
    const response = await fetch(`${WEBHOOK_URL}?email=${encodeURIComponent(email)}`, {
      method: "GET",
    });
    
    const data = await response.json();
    return data.exists || false;
  } catch (error) {
    console.error("Email check error:", error);
    return false;
  }
};
