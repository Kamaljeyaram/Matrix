import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateMeetingCode, markMeetingCodeAsUsed, generateJitsiLink } from '@/services/meetingService';

interface MeetingJoinProps {
  onMeetingJoined?: (jitsiLink: string) => void;
}

export const MeetingJoin: React.FC<MeetingJoinProps> = ({ onMeetingJoined }) => {
  const [meetingCode, setMeetingCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleJoinMeeting = async () => {
    if (!meetingCode.trim()) {
      setError('Please enter a meeting code');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const validation = validateMeetingCode(meetingCode.toUpperCase());
      
      if (!validation.valid) {
        setError('Invalid or expired meeting code');
        return;
      }

      // Mark the code as used
      markMeetingCodeAsUsed(meetingCode.toUpperCase());
      
      // Generate Jitsi link and redirect
      const jitsiLink = generateJitsiLink(meetingCode.toUpperCase());
      
      if (onMeetingJoined) {
        onMeetingJoined(jitsiLink);
      } else {
        // Open Jitsi meeting in new tab
        window.open(jitsiLink, '_blank');
      }
    } catch (err) {
      setError('Failed to join meeting. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinMeeting();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Join Meeting</CardTitle>
        <CardDescription>
          Enter your meeting code to join the appointment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="meetingCode" className="text-sm font-medium">
            Meeting Code
          </label>
          <Input
            id="meetingCode"
            type="text"
            placeholder="Enter meeting code"
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-center uppercase"
            disabled={isValidating}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleJoinMeeting}
          className="w-full"
          disabled={isValidating || !meetingCode.trim()}
        >
          {isValidating ? 'Validating...' : 'Join Meeting'}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>Make sure you have received the meeting code via Telegram</p>
        </div>
      </CardContent>
    </Card>
  );
};