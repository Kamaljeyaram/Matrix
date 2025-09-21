// Simple TelegramService mock for development

interface AppointmentData {
  patientName: string;
  date: string;
  time: string;
  type: string;
  reason: string;
  meetLink: string;
  appointmentCode: string;
}

class TelegramService {
  async testConnection(): Promise<boolean> {
    // Simulate connection test
    console.log("Testing Telegram connection...");
    return false; // Return false to use simulation mode
  }

  async sendAppointmentNotification(doctorTelegramId: string, appointmentData: AppointmentData): Promise<{success: boolean; message: string}> {
    // Simulate sending notification
    console.log("Sending appointment notification:", { doctorTelegramId, appointmentData });
    
    // Simulate some delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: "Appointment notification sent successfully (simulated)"
    };
  }
}

export default TelegramService;