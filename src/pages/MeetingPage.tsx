import React, { useState } from 'react';
import { MeetingJoin } from '@/components/MeetingJoin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Video, Calendar, Clock } from 'lucide-react';

export const MeetingPage: React.FC = () => {
  const [activeMeeting, setActiveMeeting] = useState<string | null>(null);

  const handleMeetingJoined = (jitsiLink: string) => {
    setActiveMeeting(jitsiLink);
  };

  if (activeMeeting) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Meeting Active
              </CardTitle>
              <CardDescription>
                Your meeting is now active. Click the button below to open Jitsi Meet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => window.open(activeMeeting, '_blank')}
                className="w-full"
                size="lg"
              >
                <Video className="mr-2 h-4 w-4" />
                Open Meeting
              </Button>
              <Button 
                variant="outline"
                onClick={() => setActiveMeeting(null)}
                className="w-full"
              >
                Enter Different Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">HealthStream Meetings</h1>
          <p className="text-muted-foreground">
            Join your scheduled appointment using the meeting code sent to your Telegram
          </p>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              How to Join Your Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <Calendar className="h-8 w-8 mx-auto text-blue-500" />
                <h3 className="font-semibold">1. Book Appointment</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule your appointment through our platform
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-8 w-8 mx-auto bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                  T
                </div>
                <h3 className="font-semibold">2. Check Telegram</h3>
                <p className="text-sm text-muted-foreground">
                  Receive your meeting code via Telegram
                </p>
              </div>
              <div className="text-center space-y-2">
                <Video className="h-8 w-8 mx-auto text-green-500" />
                <h3 className="font-semibold">3. Join Meeting</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the code below to join your appointment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meeting Join Component */}
        <div className="flex justify-center">
          <MeetingJoin onMeetingJoined={handleMeetingJoined} />
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• Make sure you have received the meeting code via Telegram</p>
              <p>• Meeting codes are case-insensitive and expire after use</p>
              <p>• Join the meeting 5 minutes before your scheduled time</p>
              <p>• Contact support if you haven't received your meeting code</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};