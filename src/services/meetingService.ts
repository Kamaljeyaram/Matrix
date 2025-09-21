interface AppointmentDetails {
  date: string;
  time: string;
  doctorName: string;
  patientName?: string;
}

interface MeetingData {
  code: string;
  jitsiLink: string;
  createdAt: Date;
  appointmentId: string;
}

export const generateMeetingCode = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

export const generateJitsiLink = (meetingCode: string): string => {
  return `https://meet.jit.si/HealthStream-${meetingCode}`;
};

export const sendMeetingLink = async (chatId: string, meetingCode: string, jitsiLink: string, appointmentDetails: AppointmentDetails) => {
  const message = `
🩺 *Appointment Confirmed!*

Your appointment has been booked successfully.

📅 *Date:* ${appointmentDetails.date}
⏰ *Time:* ${appointmentDetails.time}
👨‍⚕️ *Doctor:* ${appointmentDetails.doctorName}

🔗 *Meeting Details:*
Meeting Code: \`${meetingCode}\`
Direct Link: ${jitsiLink}

You can join the meeting by:
1. Clicking the direct link above
2. Or entering the meeting code on our website

Please join 5 minutes before your scheduled time.
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🔗 Join Meeting',
                url: jitsiLink
              },
              {
                text: '🌐 Open Website',
                url: window.location.origin
              }
            ]
          ]
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending meeting link:', error);
    throw error;
  }
};

// Store meeting codes in localStorage for demo purposes
// In production, this should be stored in a database
export const storeMeetingCode = (code: string, appointmentId: string): void => {
  const meetings = JSON.parse(localStorage.getItem('meetingCodes') || '{}');
  meetings[code] = {
    appointmentId,
    createdAt: new Date().toISOString(),
    used: false
  };
  localStorage.setItem('meetingCodes', JSON.stringify(meetings));
};

export const validateMeetingCode = (code: string): { valid: boolean; meetingData?: MeetingData } => {
  const meetings = JSON.parse(localStorage.getItem('meetingCodes') || '{}');
  const meeting = meetings[code];
  
  if (!meeting || meeting.used) {
    return { valid: false };
  }
  
  return { valid: true, meetingData: meeting };
};

export const markMeetingCodeAsUsed = (code: string): void => {
  const meetings = JSON.parse(localStorage.getItem('meetingCodes') || '{}');
  if (meetings[code]) {
    meetings[code].used = true;
    localStorage.setItem('meetingCodes', JSON.stringify(meetings));
  }
};