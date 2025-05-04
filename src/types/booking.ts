
export type BookingStep = 1 | 2 | 3 | 4;

export interface ClientInfo {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  otherSubject?: string;
}

export interface BookingData extends ClientInfo {
  date: Date | null;
  time: string | null;
}

export type AuditSubject = 'financial' | 'accounting' | 'fiscal' | 'other';

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
}
