import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentBookingDemo } from '@/components/AppointmentBookingDemo';
import { TelegramBotTest } from '@/components/TelegramBotTest';
import { MeetingJoin } from '@/components/MeetingJoin';
import { MessageSquare, Calendar, Video, TestTube } from 'lucide-react';

export const TestDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <TestTube className="h-8 w-8" />
            HealthStream Test Dashboard
          </h1>
          <p className="text-muted-foreground">
            Test and validate all the system components
          </p>
        </div>

        {/* Test Tabs */}
        <Tabs defaultValue="telegram" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="telegram" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Telegram Bot Test
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Booking
            </TabsTrigger>
            <TabsTrigger value="meeting" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Meeting Join
            </TabsTrigger>
          </TabsList>

          <TabsContent value="telegram" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Telegram Bot Testing</CardTitle>
                <CardDescription>
                  Test your Telegram bot connection and message sending functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TelegramBotTest />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Booking Demo</CardTitle>
                <CardDescription>
                  Test the complete appointment booking flow with Jitsi integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentBookingDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meeting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Join Test</CardTitle>
                <CardDescription>
                  Test the meeting code validation and Jitsi meeting joining
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto">
                  <MeetingJoin />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Components Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Telegram Bot
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Bot Token: 8102065213:AAHBD9iOU8k3hEPlDp3uwfUiGh-Yktc0lLM
                </p>
                <p className="text-xs text-green-600 mt-2">● Ready for testing</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Video className="h-4 w-4 text-green-500" />
                  Jitsi Meet
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Video conferencing platform
                </p>
                <p className="text-xs text-green-600 mt-2">● Available</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  Meeting Codes
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Local storage management
                </p>
                <p className="text-xs text-green-600 mt-2">● Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Telegram Bot Setup</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Create a bot using @BotFather on Telegram</li>
                  <li>Get your bot token and update the configuration</li>
                  <li>Start a conversation with your bot</li>
                  <li>Use the test function to verify connectivity</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2. Complete Workflow Test</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Book an appointment using the demo form</li>
                  <li>Check if the Telegram message is received</li>
                  <li>Use the meeting code to join the session</li>
                  <li>Verify the Jitsi meeting opens correctly</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3. Troubleshooting</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Check browser console for any errors</li>
                  <li>Verify bot token is correct and active</li>
                  <li>Ensure chat ID is obtained correctly</li>
                  <li>Test with different browsers if needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};