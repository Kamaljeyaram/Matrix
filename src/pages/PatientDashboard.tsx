import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import TelegramService from "@/services/telegramService";
import "../styles/dashboard.css";
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Droplets, 
  Calendar, 
  Pill, 
  Video, 
  LogOut,
  TrendingUp,
  Clock,
  Bell,
  CheckCircle,
  AlertCircle,
  Plus,
  BarChart3,
  Target,
  Zap,
  Send,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  console.log("PatientDashboard component rendering...");
  
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    doctor: "",
    date: "",
    time: "",
    type: "",
    reason: ""
  });
  const [bookingStatus, setBookingStatus] = useState<"idle" | "booking" | "success" | "error">("idle");
  const [telegramService] = useState(new TelegramService());
  const [currentMeeting, setCurrentMeeting] = useState<{meetingId: string; joinUrl: string} | null>(null);
  
  const [vitals] = useState({
    bpm: 72,
    spo2: 98,
    temperature: 98.6,
    ecg: "Normal Sinus Rhythm"
  });

  // Mock data for charts
  const [vitalHistory] = useState([
    { time: "00:00", bpm: 70, spo2: 97, temp: 98.4 },
    { time: "04:00", bpm: 68, spo2: 98, temp: 98.2 },
    { time: "08:00", bpm: 72, spo2: 98, temp: 98.6 },
    { time: "12:00", bpm: 75, spo2: 97, temp: 98.8 },
    { time: "16:00", bpm: 73, spo2: 98, temp: 98.5 },
    { time: "20:00", bpm: 71, spo2: 98, temp: 98.7 },
  ]);

  const [healthGoals] = useState([
    { name: "Daily Steps", current: 8250, target: 10000, icon: Target },
    { name: "Water Intake", current: 6, target: 8, icon: Droplets },
    { name: "Sleep Hours", current: 7.5, target: 8, icon: Clock },
  ]);

  const [medications] = useState([
    { name: "Aspirin", dosage: "81mg", time: "8:00 AM", taken: true, nextDue: "Tomorrow 8:00 AM" },
    { name: "Metformin", dosage: "500mg", time: "12:00 PM", taken: true, nextDue: "Today 12:00 PM" },
    { name: "Lisinopril", dosage: "10mg", time: "6:00 PM", taken: false, nextDue: "Today 6:00 PM" },
    { name: "Vitamin D", dosage: "1000IU", time: "9:00 AM", taken: true, nextDue: "Tomorrow 9:00 AM" },
  ]);

  const [upcomingReminders] = useState([
    { type: "medication", title: "Take Lisinopril", time: "in 2 hours", urgent: true },
    { type: "appointment", title: "Cardiology Check-up", time: "Tomorrow 2:00 PM", urgent: false },
    { type: "test", title: "Blood Test Due", time: "in 3 days", urgent: false },
  ]);

  const [appointments] = useState([
    { doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "Dec 25, 2024", time: "2:00 PM", type: "Follow-up" },
    { doctor: "Dr. Michael Chen", specialty: "Internal Medicine", date: "Dec 28, 2024", time: "10:30 AM", type: "Consultation" },
  ]);

  // Available doctors for booking with Telegram IDs
  const [doctors] = useState([
    { 
      id: "dr-sarah", 
      name: "Dr. Sarah Johnson", 
      specialty: "Cardiology", 
      phone: "9025900546",
      telegramId: "123456789" // Doctor's Telegram Chat ID
    },
    { 
      id: "dr-michael", 
      name: "Dr. Michael Chen", 
      specialty: "Internal Medicine", 
      phone: "9025900546",
      telegramId: "987654321" // Doctor's Telegram Chat ID
    },
    { 
      id: "dr-emily", 
      name: "Dr. Emily Rodriguez", 
      specialty: "Dermatology", 
      phone: "9025900546",
      telegramId: "456789123" // Doctor's Telegram Chat ID
    },
    { 
      id: "dr-james", 
      name: "Dr. James Wilson", 
      specialty: "Neurology", 
      phone: "9025900546",
      telegramId: "789123456" // Doctor's Telegram Chat ID
    }
  ]);

  // Generate Google Meet link
  const generateMeetLink = () => {
    const meetId = Math.random().toString(36).substr(2, 10);
    return `https://meet.google.com/${meetId}`;
  };

  // Generate appointment code
  const generateAppointmentCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  // Send Telegram message automatically
  const sendTelegramMessage = async (doctorTelegramId: string, meetLink: string, appointmentCode: string, appointmentDetails: typeof bookingForm) => {
    try {
      // Test Telegram connection first
      const isConnected = await telegramService.testConnection();
      if (!isConnected) {
        console.log('Telegram connection failed, simulating message send');
        // Simulate successful send for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, message: "Telegram message sent successfully (simulated)" };
      }

      // Send appointment notification via Telegram
      const result = await telegramService.sendAppointmentNotification(doctorTelegramId, {
        patientName: "John Doe",
        date: appointmentDetails.date,
        time: appointmentDetails.time,
        type: appointmentDetails.type,
        reason: appointmentDetails.reason || "General consultation",
        meetLink: meetLink,
        appointmentCode: appointmentCode
      });

      return result;
    } catch (error) {
      console.error("Failed to send Telegram message:", error);
      return { success: false, message: "Failed to send Telegram message" };
    }
  };

  // Handle appointment booking with Telegram integration
  const handleBookAppointment = async () => {
    if (!bookingForm.doctor || !bookingForm.date || !bookingForm.time || !bookingForm.type) {
      alert("Please fill in all required fields");
      return;
    }

    setBookingStatus("booking");

    try {
      const selectedDoctor = doctors.find(doc => doc.id === bookingForm.doctor);
      if (selectedDoctor) {
        const meetLink = generateMeetLink();
        const appointmentCode = generateAppointmentCode();
        
        // Send Telegram message to doctor
        const messageResult = await sendTelegramMessage(selectedDoctor.telegramId, meetLink, appointmentCode, bookingForm);
        
        if (messageResult.success) {
          // Store appointment data (in real app, this would be saved to database)
          const appointmentData = {
            ...bookingForm,
            meetLink,
            appointmentCode,
            doctorPhone: selectedDoctor.phone,
            doctorTelegramId: selectedDoctor.telegramId,
            patientName: "John Doe",
            status: "pending_confirmation"
          };
          
          console.log("Appointment booked:", appointmentData);
          setBookingStatus("success");
          
          // Reset form after successful booking
          setTimeout(() => {
            setBookingForm({
              doctor: "",
              date: "",
              time: "",
              type: "",
              reason: ""
            });
            setBookingStatus("idle");
            setIsBookingOpen(false);
          }, 3000);
        } else {
          setBookingStatus("error");
          setTimeout(() => setBookingStatus("idle"), 3000);
        }
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingStatus("error");
      setTimeout(() => setBookingStatus("idle"), 3000);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getVitalStatus = (vital: string, value: number) => {
    if (vital === "bpm") {
      if (value >= 60 && value <= 100) return "healthy";
      if (value >= 50 && value <= 120) return "warning";
      return "critical";
    }
    if (vital === "spo2") {
      if (value >= 95) return "healthy";
      if (value >= 90) return "warning";
      return "critical";
    }
    if (vital === "temperature") {
      if (value >= 97.8 && value <= 99.1) return "healthy";
      if (value >= 96.8 && value <= 100.4) return "warning";
      return "critical";
    }
    return "healthy";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center medical-card p-6 shadow-lg">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-medical-primary">
              Patient Dashboard
            </h1>
            <p className="text-muted-foreground text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-vital-healthy rounded-full animate-pulse"></div>
              Welcome back, John Doe • {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="relative gap-2 hover:shadow-md transition-all duration-200">
              <Bell className="w-4 h-4" />
              <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs animate-bounce">
                3
              </Badge>
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="gap-2 hover:shadow-md transition-all duration-200">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Enhanced Vitals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Heart Rate Card */}
          <Card className="medical-card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-vital-critical/5 to-vital-critical/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-vital-critical/15 rounded-xl">
                  <Heart className="h-6 w-6 text-vital-critical animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Heart Rate</CardTitle>
                  <p className="text-xs text-muted-foreground/70">Real-time monitoring</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-4xl font-bold text-vital-critical">{vitals.bpm}</div>
                <div className="text-lg font-medium text-muted-foreground">BPM</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant="secondary" 
                  className={`px-3 py-1 font-medium status-${getVitalStatus("bpm", vitals.bpm)} capitalize`}
                >
                  {getVitalStatus("bpm", vitals.bpm)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-vital-critical rounded-full animate-pulse"></div>
                  Live
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Normal: 60-100</span>
                  <span>{vitals.bpm}/100</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-vital-critical to-vital-critical/80 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{width: `${Math.min((vitals.bpm / 100) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blood Oxygen Card */}
          <Card className="medical-card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-medical-primary/5 to-medical-primary/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-medical-primary/15 rounded-xl">
                  <Droplets className="h-6 w-6 text-medical-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Blood Oxygen</CardTitle>
                  <p className="text-xs text-muted-foreground/70">Saturation level</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-4xl font-bold text-medical-primary">{vitals.spo2}</div>
                <div className="text-lg font-medium text-muted-foreground">SpO₂%</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant="secondary" 
                  className={`px-3 py-1 font-medium status-${getVitalStatus("spo2", vitals.spo2)} capitalize`}
                >
                  {getVitalStatus("spo2", vitals.spo2)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-medical-primary rounded-full animate-pulse"></div>
                  Excellent
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Normal: {'>'}95%</span>
                  <span>{vitals.spo2}/100</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-medical-primary to-medical-primary/80 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{width: `${vitals.spo2}%`}}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Card */}
          <Card className="medical-card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-vital-warning/5 to-vital-warning/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-vital-warning/15 rounded-xl">
                  <Thermometer className="h-6 w-6 text-vital-warning" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Temperature</CardTitle>
                  <p className="text-xs text-muted-foreground/70">Body temperature</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-4xl font-bold text-vital-warning">{vitals.temperature}</div>
                <div className="text-lg font-medium text-muted-foreground">°F</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant="secondary" 
                  className={`px-3 py-1 font-medium status-${getVitalStatus("temperature", vitals.temperature)} capitalize`}
                >
                  {getVitalStatus("temperature", vitals.temperature)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-vital-warning rounded-full"></div>
                  Normal
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Normal: 97.8-99.1°F</span>
                  <span>{vitals.temperature}°F</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-vital-warning to-vital-warning/80 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{width: `${((vitals.temperature - 95) / (105 - 95)) * 100}%`}}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ECG Status Card */}
          <Card className="medical-card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-vital-healthy/5 to-vital-healthy/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-vital-healthy/15 rounded-xl">
                  <Activity className="h-6 w-6 text-vital-healthy" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">ECG Status</CardTitle>
                  <p className="text-xs text-muted-foreground/70">Heart rhythm</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-4xl font-bold text-vital-healthy">Normal</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1 font-medium status-healthy bg-vital-healthy/10 text-vital-healthy border-vital-healthy/20"
                >
                  Stable
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-vital-healthy rounded-full animate-pulse"></div>
                  Active
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Sinus Rhythm</span>
                  <span>Regular</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-vital-healthy to-vital-healthy/80 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{width: '100%'}}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Reminders Section */}
        <Card className="medical-card border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-secondary/50 border-b p-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-medical-primary rounded-xl">
                <Bell className="w-5 h-5 text-white" />
              </div>
              Today's Reminders
            </CardTitle>
            <CardDescription>Stay on top of your health schedule</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingReminders.map((reminder, index) => (
                <div key={index} className={`group p-5 rounded-xl border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                  reminder.urgent 
                    ? 'border-vital-critical/20 bg-vital-critical/5' 
                    : 'border-medical-primary/20 bg-medical-primary/5'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      reminder.urgent ? 'bg-vital-critical' : 'bg-medical-primary'
                    }`}>
                      {reminder.urgent ? 
                        <AlertCircle className="w-4 h-4 text-white animate-pulse" /> :
                        <CheckCircle className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold">{reminder.title}</p>
                      <p className="text-sm text-muted-foreground">{reminder.time}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={`w-full mt-3 ${
                          reminder.urgent ? 'text-vital-critical border-vital-critical/30' : 'text-medical-primary border-medical-primary/30'
                        }`}
                      >
                        {reminder.urgent ? "Take Now" : "View Details"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modern Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="medical-card p-2 shadow-lg">
            <TabsList className="grid w-full grid-cols-4 bg-transparent space-x-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-medical-primary data-[state=active]:text-white rounded-xl gap-2 transition-all duration-200 hover:bg-secondary"
              >
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="vitals" 
                className="data-[state=active]:bg-vital-healthy data-[state=active]:text-white rounded-xl gap-2 transition-all duration-200 hover:bg-secondary"
              >
                <Activity className="w-4 h-4" />
                Vital Trends
              </TabsTrigger>
              <TabsTrigger 
                value="medications" 
                className="data-[state=active]:bg-medical-secondary data-[state=active]:text-white rounded-xl gap-2 transition-all duration-200 hover:bg-secondary"
              >
                <Pill className="w-4 h-4" />
                Medications
              </TabsTrigger>
              <TabsTrigger 
                value="appointments" 
                className="data-[state=active]:bg-vital-critical data-[state=active]:text-white rounded-xl gap-2 transition-all duration-200 hover:bg-secondary"
              >
                <Calendar className="w-4 h-4" />
                Appointments
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Health Goals */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-medical-primary" />
                  Daily Health Goals
                </CardTitle>
                <CardDescription>Track your daily health objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {healthGoals.map((goal, index) => {
                    const IconComponent = goal.icon;
                    const percentage = (goal.current / goal.target) * 100;
                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-medical-primary" />
                            <span className="font-medium">{goal.name}</span>
                          </div>
                          <Badge variant={percentage >= 100 ? "default" : "secondary"}>
                            {percentage >= 100 ? "Complete" : "In Progress"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{goal.current}</span>
                            <span>{goal.target}</span>
                          </div>
                          <Progress value={Math.min(percentage, 100)} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            {/* Vital Signs Chart */}
            <Card className="medical-card border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-secondary/50 border-b p-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-vital-healthy rounded-xl">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Vital Signs Trends
                </CardTitle>
                <CardDescription>24-hour vital signs monitoring</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vitalHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Line 
                        type="monotone"
                        dataKey="bpm"
                        stroke="hsl(var(--medical-primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--medical-primary))", strokeWidth: 2, r: 4 }}
                        name="Heart Rate (BPM)"
                      />
                      <Line 
                        type="monotone"
                        dataKey="spo2"
                        stroke="hsl(var(--medical-secondary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--medical-secondary))", strokeWidth: 2, r: 4 }}
                        name="SpO2 (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Temperature Chart */}
            <Card className="medical-card border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-secondary/50 border-b p-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-vital-warning rounded-xl">
                    <Thermometer className="w-5 h-5 text-white" />
                  </div>
                  Temperature Trend
                </CardTitle>
                <CardDescription>Body temperature over 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vitalHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        domain={['dataMin - 0.5', 'dataMax + 0.5']}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="hsl(var(--medical-primary))"
                        fill="hsl(var(--medical-primary))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        name="Temperature (°F)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Card className="medical-card border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-secondary/50 border-b p-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-medical-secondary rounded-xl">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  Medication Schedule
                </CardTitle>
                <CardDescription>Your daily medication tracking</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {medications.map((med, index) => (
                  <div key={index} className="group flex items-center justify-between p-5 bg-secondary/30 rounded-xl border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${med.taken ? 'bg-vital-healthy' : 'bg-vital-warning animate-pulse'}`} />
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-medical-secondary rounded-lg flex items-center justify-center">
                          <Pill className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{med.name}</h4>
                          <p className="text-sm text-muted-foreground">{med.dosage} • {med.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={med.taken ? "default" : "destructive"}
                        className={med.taken ? "bg-vital-healthy" : "animate-pulse"}
                      >
                        {med.taken ? "Taken" : "Pending"}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant={med.taken ? "outline" : "default"}
                        disabled={med.taken}
                        className={`gap-2 ${!med.taken ? 'bg-vital-healthy hover:bg-vital-healthy/80 text-white border-0' : ''}`}
                      >
                        {med.taken ? <CheckCircle className="w-4 h-4" /> : "Mark Taken"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center medical-card p-6 shadow-lg">
              <div>
                <h2 className="text-2xl font-bold text-vital-critical">Appointments</h2>
                <p className="text-muted-foreground">Manage your upcoming appointments</p>
              </div>
              
              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <Button className="h-12 px-6 bg-vital-critical hover:bg-vital-critical/80 text-white border-0 rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-vital-critical" />
                      Book New Appointment
                    </DialogTitle>
                    <DialogDescription>
                      Schedule a consultation with your healthcare provider
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor">Doctor</Label>
                      <Select value={bookingForm.doctor} onValueChange={(value) => setBookingForm({...bookingForm, doctor: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Select value={bookingForm.time} onValueChange={(value) => setBookingForm({...bookingForm, time: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Appointment Type</Label>
                      <Select value={bookingForm.type} onValueChange={(value) => setBookingForm({...bookingForm, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="routine">Routine Check-up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason (Optional)</Label>
                      <Textarea
                        id="reason"
                        placeholder="Describe your symptoms or reason for visit..."
                        value={bookingForm.reason}
                        onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleBookAppointment}
                        disabled={bookingStatus === "booking"}
                        className="flex-1 bg-vital-critical hover:bg-vital-critical/80 text-white border-0"
                      >
                        {bookingStatus === "booking" ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Booking...
                          </>
                        ) : bookingStatus === "success" ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Booked!
                          </>
                        ) : bookingStatus === "error" ? (
                          <>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Failed
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Book Appointment
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Upcoming Appointments */}
            <Card className="medical-card border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-secondary/50 border-b p-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-vital-critical rounded-xl">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Your scheduled consultations</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {appointments.map((appointment, index) => (
                  <div key={index} className="group flex items-center justify-between p-5 bg-secondary/30 rounded-xl border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-vital-critical/10 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-vital-critical" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{appointment.doctor}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                        <p className="text-sm">{appointment.date} at {appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-vital-critical/10 text-vital-critical border-vital-critical/20">
                        {appointment.type}
                      </Badge>
                      <Button size="sm" className="gap-2 bg-vital-healthy hover:bg-vital-healthy/80 text-white border-0 rounded-lg">
                        <Video className="w-4 h-4" />
                        Join Call
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard; 
   