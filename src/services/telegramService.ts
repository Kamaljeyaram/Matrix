// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = '8102065213:AAHBD9iOU8k3hEPlDp3uwfUiGh-Yktc0lLM';
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface AppointmentDetails {
  date: string;
  time: string;
  doctorName: string;
  patientName?: string;
  isForDoctor?: boolean;
}

// Add meeting-related functions
export const sendMeetingLink = async (chatId: string, meetingCode: string, jitsiLink: string, appointmentDetails: AppointmentDetails) => {
  // Ensure we have valid appointment details
  const safeDetails = {
    date: appointmentDetails.date || 'Not specified',
    time: appointmentDetails.time || 'Not specified',
    doctorName: appointmentDetails.doctorName || 'Doctor',
    patientName: appointmentDetails.patientName || 'Patient'
  };

  // Create different messages for doctor and patient
  let message: string;
  
  if (appointmentDetails.isForDoctor) {
    // Message for the doctor
    message = `👨‍⚕️ *New Appointment Request*

A patient has booked an appointment with you.

👤 *Patient:* ${safeDetails.patientName}
📅 *Date:* ${safeDetails.date}
⏰ *Time:* ${safeDetails.time}

🔗 *Meeting Details:*
Meeting Code: \`${meetingCode}\`
Direct Link: ${jitsiLink}

Please confirm your availability and join the meeting at the scheduled time.`;
  } else {
    // Message for the patient
    message = `🩺 *Appointment Confirmed!*

Your appointment has been booked successfully.

📅 *Date:* ${safeDetails.date}
⏰ *Time:* ${safeDetails.time}
👨‍⚕️ *Doctor:* ${safeDetails.doctorName}

🔗 *Meeting Details:*
Meeting Code: \`${meetingCode}\`
Direct Link: ${jitsiLink}

You can join the meeting by:
1. Clicking the direct link above
2. Or entering the meeting code on our website

Please join 5 minutes before your scheduled time.`;
  }

  // Validate message is not empty
  if (!message.trim()) {
    throw new Error('Message content is empty');
  }

  try {
    console.log('Sending to chat ID:', chatId);
    console.log('Bot token configured:', TELEGRAM_BOT_TOKEN ? 'Yes' : 'No');
    console.log('Message content:', message);
    console.log('Message length:', message.length);
    
    const requestBody = {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🔗 Join Meeting',
              url: jitsiLink
            }
          ]
        ]
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    console.log('Telegram API response:', responseData);

    if (!response.ok) {
      // Log detailed error information
      console.error('Telegram API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        response: responseData
      });
      
      // Handle specific error cases
      if (responseData.error_code === 400) {
        if (responseData.description?.includes('chat not found')) {
          throw new Error('Invalid chat ID. Please check your Telegram chat ID.');
        } else if (responseData.description?.includes('bot token')) {
          throw new Error('Invalid bot token. Please check your Telegram bot configuration.');
        } else {
          throw new Error(`Telegram API Error: ${responseData.description || 'Bad Request'}`);
        }
      }
      
      throw new Error(`HTTP error! status: ${response.status} - ${responseData.description || response.statusText}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error sending meeting link:', error);
    throw error;
  }
};

export const generateMeetingCode = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

export const generateJitsiLink = (meetingCode: string): string => {
  return `https://meet.jit.si/HealthStream-${meetingCode}`;
};

// Additional Telegram utility functions
export const sendMessage = async (chatId: string, message: string) => {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/getMe`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting bot info:', error);
    throw error;
  }
};

export const setWebhook = async (url: string) => {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting webhook:', error);
    throw error;
  }
};

export const sendAppointmentReminder = async (chatId: string, appointmentDetails: AppointmentDetails, meetingCode: string) => {
  const message = `🔔 *Appointment Reminder*

Your appointment is starting in 10 minutes!

📅 *Date:* ${appointmentDetails.date}
⏰ *Time:* ${appointmentDetails.time}
👨‍⚕️ *Doctor:* ${appointmentDetails.doctorName}

🔗 *Meeting Code:* \`${meetingCode}\`

Please join the meeting now.`;

  return sendMessage(chatId, message);
};

export const formatTelegramMessage = (title: string, content: Record<string, string>): string => {
  let message = `*${title}*\n\n`;
  
  for (const [key, value] of Object.entries(content)) {
    message += `${key}: ${value}\n`;
  }
  
  return message;
};

interface BotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
}

export const testBotConnection = async (): Promise<{ success: boolean; message: string; botInfo?: BotInfo }> => {
  try {
    console.log('Testing bot connection...');
    const response = await fetch(`${TELEGRAM_API_BASE}/getMe`);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: `Bot connection failed: ${data.description || response.statusText}`
      };
    }
    
    if (data.ok && data.result) {
      return {
        success: true,
        message: `Bot connected successfully: ${data.result.first_name}`,
        botInfo: data.result
      };
    } else {
      return {
        success: false,
        message: 'Invalid bot response'
      };
    }
  } catch (error) {
    console.error('Bot connection test failed:', error);
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const validateChatId = async (chatId: string): Promise<{ valid: boolean; message: string }> => {
  try {
    // Try to send a simple message to test if chat ID is valid
    const testMessage = '🤖 Testing connection...';
    
    const response = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.ok) {
      return {
        valid: true,
        message: 'Chat ID is valid'
      };
    } else {
      return {
        valid: false,
        message: data.description || 'Invalid chat ID'
      };
    }
  } catch (error) {
    return {
      valid: false,
      message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const sendSimpleTestMessage = async (chatId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const testMessage = 'Hello from HealthStream! This is a test message.';
    
    console.log('Sending simple test message to:', chatId);
    
    const response = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage
      }),
    });

    const data = await response.json();
    console.log('Simple test response:', data);
    
    if (response.ok && data.ok) {
      return {
        success: true,
        message: 'Simple test message sent successfully!'
      };
    } else {
      return {
        success: false,
        message: data.description || 'Failed to send test message'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Test error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};