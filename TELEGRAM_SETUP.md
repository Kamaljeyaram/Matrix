# Telegram Integration Setup Guide

This guide will help you set up Telegram messaging for appointment notifications in your Health Dashboard.

## 🤖 Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/start` to begin the conversation
3. Send `/newbot` to create a new bot
4. Choose a name for your bot: `Health Dashboard Bot`
5. Choose a username ending in 'bot': `health_dashboard_bot`
6. **Copy the HTTP API token** provided (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## 👨‍⚕️ Step 2: Get Doctor's Chat ID

1. Have each doctor start a conversation with your bot
2. Each doctor should send `/start` to your bot
3. To get their chat ID, visit: `https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates`
4. Look for the `"chat":{"id":123456789}` in the response
5. Note down each doctor's chat ID

## 🔧 Step 3: Configure the Application

1. Create a `.env` file in your project root:
```
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

2. Update the doctor chat IDs in `src/config/telegram.ts`:
```typescript
DOCTOR_CHAT_IDS: {
  'dr-sarah': 'actual_chat_id_here',
  'dr-michael': 'actual_chat_id_here',
  // ... etc
}
```

## 📱 Step 4: Test the Integration

1. Book an appointment in the patient dashboard
2. Check if the doctor receives a Telegram message
3. The message should include:
   - Patient details
   - Appointment date/time
   - Google Meet link
   - Appointment code

## 🚀 How It Works

1. **Patient books appointment** → Fills out booking form
2. **System generates meeting** → Creates Google Meet link and appointment code
3. **Telegram message sent** → Doctor receives notification instantly
4. **Doctor enters code** → Uses appointment code in doctor dashboard to confirm

## 📋 Message Format

The Telegram message will look like this:

```
🏥 New Appointment Booking

👤 Patient: John Doe
📅 Date: 2024-12-25
⏰ Time: 14:00
📋 Type: Consultation
💬 Reason: Routine check-up

📹 Google Meet Link: [Join Meeting](https://meet.google.com/abc-defg-hij)
🔑 Appointment Code: ABC12345

Please use this code to confirm the appointment in your dashboard.
```

## 🔍 Troubleshooting

- **Bot not responding**: Check if bot token is correct
- **Messages not sending**: Verify doctor chat IDs
- **Connection failed**: Check internet connection and API status
- **Demo mode**: If connection fails, system will simulate message sending

## 🔒 Security Notes

- Keep your bot token secure and never commit it to version control
- Use environment variables for sensitive configuration
- Consider rate limiting for production use
- Monitor bot usage and API quotas

## 📞 Support

If you need help with setup, check the console logs for detailed error messages or contact support.