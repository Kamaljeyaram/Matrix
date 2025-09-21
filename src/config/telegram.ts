// Telegram Configuration and Setup Guide
// Environment configuration for Telegram Bot integration

export const TELEGRAM_CONFIG = {
  // Bot token from @BotFather (store in environment variable)
    BOT_TOKEN: process.env.REACT_APP_TELEGRAM_BOT_TOKEN || '8102065213:AAHBD9iOU8k3hEPlDp3uwfUiGh-Yktc0lLM',
  
  // API base URL
  API_BASE_URL: 'https://api.telegram.org/bot',
  
  // Default chat IDs for doctors (replace with actual IDs)
  DOCTOR_CHAT_IDS: {
    'dr-sarah': '1679861448',     // Dr. Sarah Johnson
    'dr-michael': '1679861448',   // Dr. Michael Chen  
      'dr-emily': '1679861448',     // Dr. Emily Rodriguez
      'dr-james': '1679861448'      // Dr. James Wilson
  },
  
  // Message formatting options
  MESSAGE_OPTIONS: {
    parse_mode: 'Markdown' as const,
    disable_web_page_preview: false
  }
};

// Setup instructions as constants
export const SETUP_INSTRUCTIONS = {
  STEP_1: "Create a Telegram Bot via @BotFather",
  STEP_2: "Get the HTTP API token",
  STEP_3: "Get doctor's chat IDs via /getUpdates",
  STEP_4: "Add token to environment variables",
  STEP_5: "Update doctor chat IDs in configuration"
};

// Demo configuration for testing
export const DEMO_CONFIG = {
  SIMULATE_MESSAGES: true,
  TEST_CHAT_ID: '1679861448',
    DEMO_BOT_TOKEN: '8102065213:AAHBD9iOU8k3hEPlDp3uwfUiGh-Yktc0lLM'
};

export default {
  TELEGRAM_CONFIG,
  SETUP_INSTRUCTIONS,
  DEMO_CONFIG
};