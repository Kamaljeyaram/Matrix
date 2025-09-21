import { useState } from 'react';
import { generateMeetingCode, generateJitsiLink, storeMeetingCode } from '@/services/meetingService';
import { sendMeetingLink } from '@/services/telegramService';

interface AppointmentData {
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  telegramChatId: string;
}

interface UseAppointmentBookingReturn {
  isBooking: boolean;
  bookAppointment: (appointmentData: AppointmentData) => Promise<{ success: boolean; meetingCode?: string; error?: string }>;
}

export const useAppointmentBooking = (): UseAppointmentBookingReturn => {
  const [isBooking, setIsBooking] = useState(false);

  const bookAppointment = async (appointmentData: AppointmentData) => {
    setIsBooking(true);

    try {
      // Generate meeting code and Jitsi link
      const meetingCode = generateMeetingCode();
      const jitsiLink = generateJitsiLink(meetingCode);

      // Create appointment ID (in production, this would come from your backend)
      const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store meeting code
      storeMeetingCode(meetingCode, appointmentId);

      // Send meeting link via Telegram
      await sendMeetingLink(
        appointmentData.telegramChatId,
        meetingCode,
        jitsiLink,
        {
          date: appointmentData.date,
          time: appointmentData.time,
          doctorName: appointmentData.doctorName,
          patientName: appointmentData.patientName
        }
      );

      return { success: true, meetingCode };
    } catch (error) {
      console.error('Error booking appointment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to book appointment' 
      };
    } finally {
      setIsBooking(false);
    }
  };

  return { isBooking, bookAppointment };
};