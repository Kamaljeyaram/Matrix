// Telegram Bot Setup Instructions and Test
// Follow these steps to set up Telegram messaging for your health dashboard

/*
TELEGRAM BOT SETUP INSTRUCTIONS:

1. Create a Telegram Bot:
   - Open Telegram and search for @BotFather
   - Send /start to begin
   - Send /newbot to create a new bot
   - Choose a name for your bot (e.g., "Health Dashboard Bot")
   - Choose a username ending in 'bot' (e.g., "health_dashboard_bot")
   - Copy the HTTP API token provided

2. Get Doctor's Chat ID:
   - Have the doctor start a conversation with your bot
   - Send a message to get their chat ID
   - Use the getUpdates API to find their chat ID
   - URL: https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates

3. Environment Setup:
   - Add REACT_APP_TELEGRAM_BOT_TOKEN to your .env file
   - Replace the token in telegramService.ts with your actual token

4. Test the Integration:
   - Use the test function below to verify everything works
*/

import TelegramService from '../services/telegramService';

// Test function to verify Telegram integration
export const testTelegramIntegration = async () => {
  const telegramService = new TelegramService();
  
  console.log('Testing Telegram Integration...');
  
  // Test 1: Check bot connection
  console.log('1. Testing bot connection...');
  const isConnected = await telegramService.testConnection();
  console.log('Bot connection:', isConnected ? 'SUCCESS' : 'FAILED');
  
  if (!isConnected) {
    console.log('Note: Using demo mode - messages will be simulated');
    return;
  }
  
  // Test 2: Get bot info
  console.log('2. Getting bot information...');
  const botInfo = await telegramService.getBotInfo();
  console.log('Bot info:', botInfo);
  
  // Test 3: Send test message (replace with actual doctor's chat ID)
  const testChatId = '123456789'; // Replace with doctor's actual Telegram chat ID
  console.log('3. Sending test appointment notification...');
  
  const testAppointment = {
    patientName: 'John Doe (Test)',
    date: '2024-12-25',
    time: '14:00',
    type: 'Test Consultation',
    reason: 'Testing Telegram integration',
    meetLink: 'https://meet.google.com/test-meeting',
    appointmentCode: 'TEST123'
  };
  
  const result = await telegramService.sendAppointmentNotification(testChatId, testAppointment);
  console.log('Test message result:', result);
  
  return result;
};

// Example of how to use in your React component
export const TelegramTestComponent = () => {
  const handleTestTelegram = async () => {
    try {
      const result = await testTelegramIntegration();
      alert(`Telegram test ${result?.success ? 'successful' : 'failed'}: ${result?.message}`);
    } catch (error) {
      console.error('Telegram test error:', error);
      alert('Telegram test failed - check console for details');
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold text-blue-800 mb-2">Telegram Integration Test</h3>
      <p className="text-sm text-blue-600 mb-3">
        Click the button below to test Telegram message sending functionality.
      </p>
      <button 
        onClick={handleTestTelegram}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Telegram Integration
      </button>
    </div>
  );
};

export default {
  testTelegramIntegration,
  TelegramTestComponent
};