// Update this page (the content is just a fallback if you fail to update the page)
import { AppointmentBookingDemo } from '@/components/AppointmentBookingDemo';
import { MeetingJoin } from '@/components/MeetingJoin';

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
    </div>
  );
};

const MeetingSection = () => (
  <div className="space-y-8">
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold">HealthStream Meetings</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Book appointments and join meetings seamlessly. Get your meeting details via Telegram
        and join with a simple meeting code.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">Book Appointment</h3>
        <AppointmentBookingDemo />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">Join Meeting</h3>
        <MeetingJoin />
      </div>
    </div>
  </div>
);

export default Index;
