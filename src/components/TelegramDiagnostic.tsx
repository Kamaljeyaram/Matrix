import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { testBotConnection, validateChatId, sendMessage, sendSimpleTestMessage } from '@/services/telegramService';
import { CheckCircle, AlertTriangle, MessageSquare, Settings } from 'lucide-react';

interface BotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
}

export const TelegramDiagnostic: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    botTest?: { success: boolean; message: string; botInfo?: BotInfo };
    chatTest?: { valid: boolean; message: string };
    messageTest?: { success: boolean; message: string };
    simpleTest?: { success: boolean; message: string };
  }>({});
  const [chatId, setChatId] = useState('1679861448');
  const [isLoading, setIsLoading] = useState(false);

  const runBotTest = async () => {
    setIsLoading(true);
    try {
      const result = await testBotConnection();
      setTestResults(prev => ({ ...prev, botTest: result }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        botTest: {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
    setIsLoading(false);
  };

  const runChatIdTest = async () => {
    if (!chatId.trim()) {
      alert('Please enter a chat ID');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await validateChatId(chatId);
      setTestResults(prev => ({ ...prev, chatTest: result }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        chatTest: {
          valid: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
    setIsLoading(false);
  };

  const runSimpleTest = async () => {
    if (!chatId.trim()) {
      alert('Please enter a chat ID');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await sendSimpleTestMessage(chatId);
      setTestResults(prev => ({ ...prev, simpleTest: result }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        simpleTest: {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
    setIsLoading(false);
  };

  const runMessageTest = async () => {
    if (!chatId.trim()) {
      alert('Please enter a chat ID');
      return;
    }
    
    setIsLoading(true);
    try {
      const testMessage = `🧪 *Test Message*\n\nThis is a test message from HealthStream Dashboard.\n\nTime: ${new Date().toLocaleString()}`;
      await sendMessage(chatId, testMessage);
      setTestResults(prev => ({
        ...prev,
        messageTest: {
          success: true,
          message: 'Test message sent successfully!'
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        messageTest: {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
    setIsLoading(false);
  };

  const runAllTests = async () => {
    await runBotTest();
    if (chatId.trim()) {
      await runChatIdTest();
      await runSimpleTest();
      await runMessageTest();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Telegram Integration Diagnostic
        </CardTitle>
        <CardDescription>
          Test your Telegram bot configuration and troubleshoot issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bot Configuration Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Current Configuration</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Bot Token:</strong> 8102065213:***...*** (configured)</p>
            <p><strong>API Endpoint:</strong> https://api.telegram.org/bot8102065213:***</p>
            <p><strong>Test Chat ID:</strong> {chatId}</p>
          </div>
        </div>

        {/* Chat ID Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Chat ID</label>
          <Input
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="Enter Telegram chat ID to test"
          />
          <p className="text-xs text-muted-foreground">
            Send /start to your bot and use the chat ID from the response
          </p>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={runBotTest} disabled={isLoading} variant="outline">
            Test Bot Connection
          </Button>
          <Button onClick={runChatIdTest} disabled={isLoading || !chatId.trim()} variant="outline">
            Test Chat ID
          </Button>
          <Button onClick={runSimpleTest} disabled={isLoading || !chatId.trim()} variant="outline">
            Send Simple Test
          </Button>
          <Button onClick={runMessageTest} disabled={isLoading || !chatId.trim()} variant="outline">
            Send Formatted Test
          </Button>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={runAllTests} disabled={isLoading} className="w-full">
            Run All Tests
          </Button>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {testResults.botTest && (
            <Alert variant={testResults.botTest.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {testResults.botTest.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <strong>Bot Test:</strong> {testResults.botTest.message}
                  {testResults.botTest.botInfo && (
                    <div className="mt-1 text-xs">
                      Bot: @{testResults.botTest.botInfo.username} ({testResults.botTest.botInfo.first_name})
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {testResults.chatTest && (
            <Alert variant={testResults.chatTest.valid ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {testResults.chatTest.valid ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <strong>Chat ID Test:</strong> {testResults.chatTest.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {testResults.simpleTest && (
            <Alert variant={testResults.simpleTest.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {testResults.simpleTest.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <strong>Simple Test:</strong> {testResults.simpleTest.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {testResults.messageTest && (
            <Alert variant={testResults.messageTest.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {testResults.messageTest.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <strong>Message Test:</strong> {testResults.messageTest.message}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>

        {/* Troubleshooting Tips */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold mb-2">Troubleshooting Tips</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Make sure your bot token is correct and the bot is active</li>
            <li>• Verify the chat ID by sending /start to your bot</li>
            <li>• Check that the bot has permission to send messages</li>
            <li>• Ensure your internet connection is stable</li>
            <li>• Try testing with a different chat ID</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};