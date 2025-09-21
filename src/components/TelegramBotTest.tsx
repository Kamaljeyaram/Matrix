import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { getMe, sendMessage, sendMeetingLink } from '@/services/telegramService';

interface BotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
}

export const TelegramBotTest: React.FC = () => {
  const [chatId, setChatId] = useState('');
  const [testMessage, setTestMessage] = useState('Hello from HealthStream Dashboard! 🩺');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);

  const testBotConnection = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const info = await getMe();
      setBotInfo(info.result);
      setResult({ 
        success: true, 
        message: `Bot connected successfully! Bot name: ${info.result.first_name}` 
      });
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Failed to connect to bot: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!chatId.trim()) {
      setResult({ success: false, message: 'Please enter a chat ID' });
      return;
    }

    setIsLoading(true);
    setResult(null);
    
    try {
      await sendMessage(chatId, testMessage);
      setResult({ 
        success: true, 
        message: 'Test message sent successfully!' 
      });
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestAppointment = async () => {
    if (!chatId.trim()) {
      setResult({ success: false, message: 'Please enter a chat ID' });
      return;
    }

    setIsLoading(true);
    setResult(null);
    
    try {
      const meetingCode = 'TEST1234';
      const jitsiLink = `https://meet.jit.si/HealthStream-${meetingCode}`;
      const appointmentDetails = {
        date: new Date().toLocaleDateString(),
        time: '14:30',
        doctorName: 'Dr. Test',
        patientName: 'Test Patient'
      };

      await sendMeetingLink(chatId, meetingCode, jitsiLink, appointmentDetails);
      setResult({ 
        success: true, 
        message: 'Test appointment message sent successfully!' 
      });
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Failed to send appointment: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Telegram Bot Test
          </CardTitle>
          <CardDescription>
            Test your Telegram bot connection and messaging functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bot Info */}
          <div className="space-y-2">
            <Button onClick={testBotConnection} disabled={isLoading} className="w-full">
              {isLoading ? 'Testing...' : 'Test Bot Connection'}
            </Button>
            
            {botInfo && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800">Bot Information:</h4>
                <div className="text-sm text-green-700">
                  <p>Name: {botInfo.first_name}</p>
                  <p>Username: @{botInfo.username}</p>
                  <p>ID: {botInfo.id}</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat ID Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Chat ID</label>
            <Input
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Enter Telegram chat ID"
            />
            <div className="text-xs text-muted-foreground">
              Send /start to your bot and check the browser console for your chat ID
            </div>
          </div>

          {/* Test Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Message</label>
            <Input
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter test message"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={sendTestMessage} 
              disabled={isLoading || !chatId.trim()}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Test Message
            </Button>
            <Button 
              onClick={sendTestAppointment} 
              disabled={isLoading || !chatId.trim()}
              variant="outline"
              className="flex-1"
            >
              Send Test Appointment
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>{result.message}</AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Get Your Chat ID</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Start a chat with your bot by searching for it on Telegram</li>
            <li>Send /start to the bot</li>
            <li>Open your browser's developer console (F12)</li>
            <li>The chat ID will be logged in the console when you interact with the bot</li>
            <li>Alternatively, you can use the Telegram Bot API to get updates and find your chat ID</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Bot Token:</strong> 8102065213:AAHBD9iOU8k3hEPlDp3uwfUiGh-Yktc0lLM
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Make sure your bot is created and this token is valid
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};