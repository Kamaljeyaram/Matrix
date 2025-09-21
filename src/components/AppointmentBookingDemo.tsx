import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, User, MessageSquare, Video } from 'lucide-react';

export const AppointmentBookingDemo: React.FC = () => {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: 'Dr. Smith',
    date: '',
    time: '',
    telegramChatId: ''
  });

  const handleBooking = async () => {
    if (!formData.patientName || !formData.date || !formData.time || !formData.telegramChatId) {
      alert('Please fill in all fields');
      return;
    }

    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      const generatedCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      setMeetingCode(generatedCode);
      setBookingComplete(true);
      setIsBooking(false);
    }, 2000);
  };

  const openJitsiMeeting = () => {
    const jitsiLink = `https://meet.jit.si/HealthStream-${meetingCode}`;
    window.open(jitsiLink, '_blank');
  };

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Booked Successfully!
            </CardTitle>
            <CardDescription className="text-green-700">
              Your meeting details have been sent to Telegram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                <strong>Meeting Code:</strong> {meetingCode}
                <br />
                Check your Telegram for the complete meeting details and direct link.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-semibold">Appointment Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Patient: {formData.patientName}</div>
                <div>Doctor: {formData.doctorName}</div>
                <div>Date: {formData.date}</div>
                <div>Time: {formData.time}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={openJitsiMeeting} className="flex-1">
                <Video className="mr-2 h-4 w-4" />
                Join Meeting Now
              </Button>
              <Button variant="outline" onClick={() => setBookingComplete(false)}>
                Book Another
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Simulated Telegram Message */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Telegram Message (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-3 rounded-lg border text-sm space-y-2">
              <div className="font-bold">🩺 Appointment Confirmed!</div>
              <div>Your appointment has been booked successfully.</div>
              <div className="space-y-1">
                <div>📅 <strong>Date:</strong> {formData.date}</div>
                <div>⏰ <strong>Time:</strong> {formData.time}</div>
                <div>👨‍⚕️ <strong>Doctor:</strong> {formData.doctorName}</div>
              </div>
              <div className="space-y-1">
                <div>🔗 <strong>Meeting Details:</strong></div>
                <div>Meeting Code: <code>{meetingCode}</code></div>
                <div>Direct Link: https://meet.jit.si/HealthStream-{meetingCode}</div>
              </div>
              <div className="text-xs text-gray-600">
                Please join 5 minutes before your scheduled time.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Appointment
          </CardTitle>
          <CardDescription>
            Schedule your appointment and receive meeting details via Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-1">
                <User className="h-3 w-3" />
                Patient Name
              </label>
              <Input
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Doctor</label>
              <Input
                value={formData.doctorName}
                onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                placeholder="Doctor name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Time
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Telegram Chat ID
            </label>
            <Input
              value={formData.telegramChatId}
              onChange={(e) => setFormData(prev => ({ ...prev, telegramChatId: e.target.value }))}
              placeholder="Enter your Telegram chat ID"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Send /start to @YourHealthBot to get your chat ID
            </div>
          </div>

          <Button 
            onClick={handleBooking}
            disabled={isBooking}
            className="w-full"
          >
            {isBooking ? 'Booking Appointment...' : 'Book Appointment & Send to Telegram'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};