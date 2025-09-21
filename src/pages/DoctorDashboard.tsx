import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Stethoscope, 
  Users, 
  Video, 
  Activity, 
  Pill, 
  LogOut, 
  Eye, 
  Search,
  Bell,
  Calendar,
  Plus,
  Filter,
  MessageCircle,
  FileText,
  TrendingUp,
  Clock,
  AlertTriangle,
  Heart,
  Code,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  status: "stable" | "monitoring" | "critical";
  lastVisit: string;
  vitals: { bpm: number; spo2: number; temperature: number };
  medications: string[];
  nextAppointment?: string;
  phone: string;
  email: string;
}

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled" | "pending_confirmation";
  meetLink?: string;
  appointmentCode?: string;
}

interface PendingAppointment {
  patientName: string;
  date: string;
  time: string;
  type: string;
  reason: string;
  meetLink: string;
  appointmentCode: string;
  status: "pending_confirmation";
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("patients");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [appointmentCode, setAppointmentCode] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [pendingAppointments, setPendingAppointments] = useState<PendingAppointment[]>([]);
  
  const [patients] = useState<Patient[]>([
    {
      id: 1,
      name: "John Doe",
      age: 45,
      condition: "Hypertension",
      status: "stable",
      lastVisit: "2024-12-20",
      vitals: { bpm: 72, spo2: 98, temperature: 98.6 },
      medications: ["Lisinopril 10mg", "Aspirin 81mg"],
      phone: "+1 (555) 123-4567",
      email: "john.doe@email.com"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      age: 32,
      condition: "Diabetes Type 2",
      status: "monitoring",
      lastVisit: "2024-12-18",
      vitals: { bpm: 68, spo2: 97, temperature: 98.2 },
      medications: ["Metformin 500mg", "Insulin"],
      phone: "+1 (555) 987-6543",
      email: "sarah.wilson@email.com"
    },
    {
      id: 3,
      name: "Michael Brown",
      age: 58,
      condition: "Heart Disease",
      status: "critical",
      lastVisit: "2024-12-21",
      vitals: { bpm: 95, spo2: 94, temperature: 99.1 },
      medications: ["Atorvastatin 20mg", "Metoprolol 50mg"],
      phone: "+1 (555) 456-7890",
      email: "michael.brown@email.com"
    }
  ]);

  const [appointments] = useState<Appointment[]>([
    { id: 1, patientName: "John Doe", time: "09:00", type: "Follow-up", status: "scheduled" },
    { id: 2, patientName: "Emma Davis", time: "10:30", type: "Consultation", status: "scheduled" },
    { id: 3, patientName: "Robert Smith", time: "14:00", type: "Check-up", status: "completed" },
    { id: 4, patientName: "Lisa Johnson", time: "15:30", type: "Consultation", status: "scheduled" }
  ]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable": return "status-healthy";
      case "monitoring": return "status-warning";
      case "critical": return "status-critical";
      default: return "status-healthy";
    }
  };

  // Calendar utility functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const hasAppointmentOnDay = (day: number) => {
    // Sample appointment days - in real app, this would check actual appointment data
    const appointmentDays = [15, 18, 21, 25];
    return appointmentDays.includes(day);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Handle appointment code verification
  const handleCodeVerification = async () => {
    if (!appointmentCode.trim()) {
      alert("Please enter an appointment code");
      return;
    }

    setCodeStatus("verifying");

    // Simulate code verification (in real app, this would verify against database)
    setTimeout(() => {
      // Mock appointment data based on code
      const mockAppointment: PendingAppointment = {
        patientName: "John Doe",
        date: new Date().toISOString().split('T')[0],
        time: "14:00",
        type: "consultation",
        reason: "Routine check-up",
        meetLink: "https://meet.google.com/abc-defg-hij",
        appointmentCode: appointmentCode.toUpperCase(),
        status: "pending_confirmation"
      };

      // Add to pending appointments
      setPendingAppointments(prev => [...prev, mockAppointment]);
      setCodeStatus("success");
      
      // Reset after success
      setTimeout(() => {
        setAppointmentCode("");
        setCodeStatus("idle");
        setIsCodeDialogOpen(false);
      }, 2000);
    }, 1500);
  };

  // Confirm appointment
  const confirmAppointment = (appointment: PendingAppointment) => {
    // Remove from pending and add to confirmed appointments
    setPendingAppointments(prev => prev.filter(apt => apt.appointmentCode !== appointment.appointmentCode));
    // In real app, this would update the database
    console.log("Appointment confirmed:", appointment);
  };

  // Reject appointment
  const rejectAppointment = (appointment: PendingAppointment) => {
    setPendingAppointments(prev => prev.filter(apt => apt.appointmentCode !== appointment.appointmentCode));
    console.log("Appointment rejected:", appointment);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysArray = [];

    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
      daysArray.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false
      });
    }

    // Next month's leading days to fill the grid
    const remainingCells = 42 - daysArray.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      daysArray.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false
      });
    }

    return daysArray;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center medical-card p-6 shadow-lg">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-medical-primary">
              Doctor Dashboard
            </h1>
            <p className="text-muted-foreground text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-vital-healthy rounded-full animate-pulse"></div>
              Dr. Sarah Johnson - Cardiology
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 hover:shadow-md transition-all duration-200">
                  <Code className="w-4 h-4" />
                  Enter Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-medical-primary" />
                    Enter Appointment Code
                  </DialogTitle>
                  <DialogDescription>
                    Enter the appointment code received via WhatsApp to confirm the appointment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Appointment Code</Label>
                    <Input
                      id="code"
                      placeholder="Enter 8-digit code"
                      value={appointmentCode}
                      onChange={(e) => setAppointmentCode(e.target.value.toUpperCase())}
                      className="text-center text-lg tracking-wider"
                      maxLength={8}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCodeDialogOpen(false)}
                    className="flex-1"
                    disabled={codeStatus === "verifying"}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCodeVerification}
                    className="flex-1 btn-medical gap-2"
                    disabled={codeStatus === "verifying" || !appointmentCode.trim()}
                  >
                    {codeStatus === "verifying" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : codeStatus === "success" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Code Verified!
                      </>
                    ) : (
                      <>
                        <Code className="w-4 h-4" />
                        Verify Code
                      </>
                    )}
                  </Button>
                </div>
                {codeStatus === "success" && (
                  <div className="bg-vital-healthy/10 border border-vital-healthy/20 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 text-vital-healthy">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Appointment Found!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      The appointment has been added to your pending appointments list.
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" className="relative gap-2 hover:shadow-md transition-all duration-200">
              <Bell className="w-4 h-4" />
              <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs animate-bounce">
                {3 + pendingAppointments.length}
              </Badge>
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="gap-2 hover:shadow-md transition-all duration-200">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="medical-card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <div className="p-2 bg-medical-primary/20 rounded-lg">
                <Users className="h-5 w-5 text-medical-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-medical-primary">{patients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active patients</p>
              <div className="mt-3 w-full bg-secondary rounded-full h-1">
                <div className="bg-medical-primary h-1 rounded-full" style={{width: '75%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
              <div className="p-2 bg-vital-critical/20 rounded-lg">
                <Activity className="h-5 w-5 text-vital-critical animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-vital-critical">
                {patients.filter(p => p.status === "critical").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Require attention</p>
              <div className="mt-3 w-full bg-secondary rounded-full h-1">
                <div className="bg-vital-critical h-1 rounded-full animate-pulse" style={{width: '33%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <div className="p-2 bg-vital-healthy/20 rounded-lg">
                <Calendar className="h-5 w-5 text-vital-healthy" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-vital-healthy">{appointments.filter(a => a.status === "scheduled").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
              <div className="mt-3 w-full bg-secondary rounded-full h-1">
                <div className="bg-vital-healthy h-1 rounded-full" style={{width: '80%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <div className="p-2 bg-medical-secondary/20 rounded-lg">
                <MessageCircle className="h-5 w-5 text-medical-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-medical-secondary">12</div>
              <p className="text-xs text-muted-foreground mt-1">Unread</p>
              <div className="mt-3 w-full bg-secondary rounded-full h-1">
                <div className="bg-medical-secondary h-1 rounded-full" style={{width: '60%'}}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="medical-card p-2 shadow-lg">
            <TabsList className="grid w-full grid-cols-4 bg-transparent space-x-1">
              <TabsTrigger 
                value="patients" 
                className="data-[state=active]:bg-medical-primary data-[state=active]:text-white rounded-xl gap-2 transition-all duration-200 hover:bg-secondary"
              >
                <Users className="w-4 h-4" />
                Patients
              </TabsTrigger>
              <TabsTrigger 
                value="appointments" 
                className="data-[state=active]:bg-vital-healthy data-[state=active]:text-white rounded-xl gap-2 transition-all duration-200 hover:bg-secondary"
              >
                <Calendar className="w-4 h-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-medical-secondary data-[state=active]:text-white rounded-xl gap-2 transition-all duration-200 hover:bg-secondary"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="alerts" 
                className="data-[state=active]:bg-vital-critical data-[state=active]:text-white rounded-xl gap-2 transition-all duration-200 hover:bg-secondary"
              >
                <AlertTriangle className="w-4 h-4" />
                Alerts
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            {/* Modern Search and Filter */}
            <div className="medical-card p-6 shadow-lg">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name or condition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 rounded-xl transition-all duration-200"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 h-12 border border-border rounded-xl bg-background text-foreground transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="stable">Stable</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="critical">Critical</option>
                </select>
                <Button className="h-12 px-6 btn-medical rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                  <Plus className="w-4 h-4" />
                  Add Patient
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Patients List */}
              <Card className="medical-card border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-secondary/50 border-b p-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-medical-primary rounded-xl">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    My Patients ({filteredPatients.length})
                  </CardTitle>
                  <CardDescription>Click on a patient to view details</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <div 
                      key={patient.id}
                      className={`group p-5 bg-secondary/30 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border ${
                        selectedPatient?.id === patient.id ? 'ring-2 ring-medical-primary shadow-lg bg-secondary/50' : 'border-secondary'
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 ring-2 ring-background shadow-md">
                            <AvatarFallback className="bg-medical-primary text-white font-semibold">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">Age {patient.age} • {patient.condition}</p>
                            <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-3">
                          <Badge className={`${getStatusColor(patient.status)} px-3 py-1 rounded-full font-medium`}>
                            {patient.status}
                          </Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1 rounded-lg">
                              <Eye className="w-3 h-3" />
                              View
                            </Button>
                            <Button size="sm" className="gap-1 bg-vital-healthy hover:bg-vital-healthy/80 text-white border-0 rounded-lg">
                              <Video className="w-3 h-3" />
                              Meet
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Enhanced Patient Details */}
              <Card className="medical-card border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-secondary/50 border-b p-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-medical-secondary rounded-xl">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Patient Details
                  </CardTitle>
                  <CardDescription>
                    {selectedPatient ? `${selectedPatient.name}'s medical information` : "Select a patient to view details"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedPatient ? (
                    <div className="space-y-6">
                      {/* Enhanced Patient Info */}
                      <div className="bg-secondary/30 p-5 rounded-xl border">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 ring-3 ring-background shadow-lg">
                            <AvatarFallback className="bg-medical-primary text-white text-xl font-bold">
                              {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h3 className="font-bold text-xl">{selectedPatient.name}</h3>
                            <p className="text-muted-foreground flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              {selectedPatient.email}
                            </p>
                            <p className="text-muted-foreground flex items-center gap-2">
                              <div className="w-4 h-4 flex items-center justify-center">📞</div>
                              {selectedPatient.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Vitals */}
                      <div>
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                          <Heart className="w-5 h-5 text-vital-critical" />
                          Current Vitals
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-secondary/30 rounded-xl border">
                            <div className="w-8 h-8 bg-vital-critical rounded-full mx-auto mb-2 flex items-center justify-center">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm text-vital-critical font-medium">Heart Rate</p>
                            <p className="text-2xl font-bold">{selectedPatient.vitals.bpm}</p>
                            <p className="text-xs text-muted-foreground">BPM</p>
                            <Progress value={75} className="h-2 mt-3" />
                          </div>
                          <div className="text-center p-4 bg-secondary/30 rounded-xl border">
                            <div className="w-8 h-8 bg-medical-primary rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">
                              O₂
                            </div>
                            <p className="text-sm text-medical-primary font-medium">SpO2</p>
                            <p className="text-2xl font-bold">{selectedPatient.vitals.spo2}</p>
                            <p className="text-xs text-muted-foreground">%</p>
                            <Progress value={selectedPatient.vitals.spo2} className="h-2 mt-3" />
                          </div>
                          <div className="text-center p-4 bg-secondary/30 rounded-xl border">
                            <div className="w-8 h-8 bg-vital-warning rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">
                              🌡️
                            </div>
                            <p className="text-sm text-vital-warning font-medium">Temperature</p>
                            <p className="text-2xl font-bold">{selectedPatient.vitals.temperature}</p>
                            <p className="text-xs text-muted-foreground">°F</p>
                            <Progress value={60} className="h-2 mt-3" />
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Medications */}
                      <div>
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                          <Pill className="w-5 h-5 text-vital-healthy" />
                          Current Medications
                        </h3>
                        <div className="space-y-3">
                          {selectedPatient.medications.map((med: string, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border group hover:shadow-md transition-all duration-200">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-vital-healthy rounded-lg flex items-center justify-center">
                                  <Pill className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium">{med}</span>
                              </div>
                              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <FileText className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Enhanced Quick Actions */}
                      <div className="space-y-4">
                        <Button className="w-full h-12 bg-vital-healthy hover:bg-vital-healthy/80 text-white border-0 rounded-xl gap-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                          <Video className="w-5 h-5" />
                          Start Video Consultation
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-10 gap-2 rounded-xl transition-all duration-200">
                            <FileText className="w-4 h-4" />
                            View History
                          </Button>
                          <Button variant="outline" className="h-10 gap-2 rounded-xl transition-all duration-200">
                            <Calendar className="w-4 h-4" />
                            Schedule
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-10 gap-2 rounded-xl transition-all duration-200">
                            <MessageCircle className="w-4 h-4" />
                            Message
                          </Button>
                          <Button variant="outline" className="h-10 gap-2 rounded-xl transition-all duration-200">
                            <Pill className="w-4 h-4" />
                            Prescribe
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <p className="text-lg">Select a patient from the list to view their details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Modern Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center medical-card p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-vital-healthy">Today's Schedule</h3>
              <Button className="h-12 px-6 bg-vital-healthy hover:bg-vital-healthy/80 text-white border-0 rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <Plus className="w-4 h-4" />
                New Appointment
              </Button>
            </div>

            {/* Pending Appointments Section */}
            {pendingAppointments.length > 0 && (
              <Card className="medical-card border-0 shadow-xl overflow-hidden border-l-4 border-l-vital-warning">
                <CardHeader className="bg-vital-warning/10 border-b p-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-vital-warning rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    Pending Confirmations ({pendingAppointments.length})
                  </CardTitle>
                  <CardDescription>New appointment requests requiring your confirmation</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {pendingAppointments.map((appointment, index) => (
                    <div key={index} className="group p-5 bg-secondary/30 border border-vital-warning/20 rounded-xl hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold text-lg">{appointment.patientName}</p>
                            <p className="text-sm text-muted-foreground">{appointment.type}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-vital-warning" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-vital-warning" />
                              {appointment.time}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm"><strong>Reason:</strong> {appointment.reason}</p>
                            <p className="text-sm"><strong>Code:</strong> <span className="font-mono bg-secondary px-2 py-1 rounded">{appointment.appointmentCode}</span></p>
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-medical-primary" />
                              <a href={appointment.meetLink} target="_blank" rel="noopener noreferrer" className="text-medical-primary hover:underline text-sm">
                                Google Meet Link
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-vital-critical border-vital-critical/30 hover:bg-vital-critical/10 rounded-lg"
                            onClick={() => rejectAppointment(appointment)}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-vital-healthy hover:bg-vital-healthy/80 text-white border-0 rounded-lg gap-2"
                            onClick={() => confirmAppointment(appointment)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirm
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="medical-card border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-secondary/50 border-b p-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-vital-healthy rounded-xl">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {appointments.filter(apt => apt.status === "scheduled").map((appointment) => (
                    <div key={appointment.id} className="group flex items-center justify-between p-5 bg-secondary/30 rounded-xl border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-vital-healthy rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">{appointment.patientName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold text-lg text-vital-healthy">{appointment.time}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="rounded-lg">
                            <Video className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="medical-card border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-secondary/50 border-b p-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-medical-primary rounded-xl">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    Calendar View
                  </CardTitle>
                  <CardDescription>{getMonthName(currentDate)}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => navigateMonth('prev')}
                      >
                        <div className="w-3 h-3 rotate-180">▶</div>
                        Previous
                      </Button>
                      <h4 className="font-bold text-lg text-medical-primary">{getMonthName(currentDate)}</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => navigateMonth('next')}
                      >
                        Next
                        <div className="w-3 h-3">▶</div>
                      </Button>
                    </div>

                    {/* Days of week */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <div key={day} className={`p-3 text-center font-bold text-sm rounded-lg ${
                          index === 0 || index === 6 
                            ? 'bg-vital-warning/20 text-vital-warning' 
                            : 'bg-medical-primary/20 text-medical-primary'
                        }`}>
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {generateCalendarDays().map((dayObj, i) => {
                        const isTodayDate = dayObj.isCurrentMonth && isToday(dayObj.day);
                        const hasAppointment = dayObj.isCurrentMonth && hasAppointmentOnDay(dayObj.day);
                        
                        return (
                          <div 
                            key={i} 
                            className={`
                              aspect-square p-2 text-center text-sm rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center font-medium relative
                              ${!dayObj.isCurrentMonth 
                                ? 'opacity-30 text-muted-foreground' 
                                : isTodayDate
                                  ? 'bg-medical-primary text-white shadow-lg scale-105 ring-2 ring-medical-primary/50'
                                  : hasAppointment
                                    ? 'bg-vital-healthy/20 text-vital-healthy border-2 border-vital-healthy/30 hover:bg-vital-healthy/30'
                                    : 'border hover:bg-secondary hover:border-medical-primary/50 hover:scale-105'
                              }
                            `}
                          >
                            <span className={`${isTodayDate ? 'font-bold' : ''}`}>
                              {dayObj.day}
                            </span>
                            {hasAppointment && !isTodayDate && (
                              <div className="w-1.5 h-1.5 bg-vital-healthy rounded-full mt-1"></div>
                            )}
                            {isTodayDate && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-vital-critical rounded-full animate-pulse"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Calendar Legend */}
                    <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-medical-primary rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Today</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-vital-healthy rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Appointments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-vital-critical rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Urgent</span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
                      <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <div className="text-lg font-bold text-medical-primary">8</div>
                        <div className="text-xs text-muted-foreground">This Week</div>
                      </div>
                      <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <div className="text-lg font-bold text-vital-healthy">
                          {generateCalendarDays().filter(day => day.isCurrentMonth && hasAppointmentOnDay(day.day)).length}
                        </div>
                        <div className="text-xs text-muted-foreground">This Month</div>
                      </div>
                      <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <div className="text-lg font-bold text-vital-warning">2</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Modern Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="medical-card p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-medical-secondary mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">Comprehensive overview of your practice metrics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="medical-card border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-secondary/50 border-b p-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-medical-secondary rounded-xl">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    Patient Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-vital-healthy rounded-full"></div>
                        <span className="font-medium">Stable Patients</span>
                      </span>
                      <span className="font-bold text-vital-healthy text-lg">{patients.filter(p => p.status === "stable").length}</span>
                    </div>
                    <Progress value={(patients.filter(p => p.status === "stable").length / patients.length) * 100} className="h-3" />
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-vital-warning rounded-full"></div>
                        <span className="font-medium">Monitoring</span>
                      </span>
                      <span className="font-bold text-vital-warning text-lg">{patients.filter(p => p.status === "monitoring").length}</span>
                    </div>
                    <Progress value={(patients.filter(p => p.status === "monitoring").length / patients.length) * 100} className="h-3" />
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-vital-critical rounded-full animate-pulse"></div>
                        <span className="font-medium">Critical</span>
                      </span>
                      <span className="font-bold text-vital-critical text-lg">{patients.filter(p => p.status === "critical").length}</span>
                    </div>
                    <Progress value={(patients.filter(p => p.status === "critical").length / patients.length) * 100} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="medical-card border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-secondary/50 border-b p-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-medical-primary rounded-xl">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const value = Math.random() * 100;
                      const appointments = Math.floor(Math.random() * 20) + 5;
                      return (
                        <div key={day} className="flex items-center gap-4">
                          <span className="w-10 text-sm font-semibold">{day}</span>
                          <div className="flex-1 relative">
                            <Progress value={value} className="h-4" />
                            <div className="absolute inset-0 flex items-center px-2">
                              <span className="text-xs font-medium text-foreground">{Math.round(value)}%</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-medical-primary w-8">{appointments}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Modern Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="medical-card p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-vital-critical mb-2">Critical Alerts & Notifications</h3>
              <p className="text-muted-foreground">Stay informed about urgent patient matters</p>
            </div>

            <Card className="medical-card border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-secondary/50 border-b p-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-vital-critical rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="group flex items-start gap-4 p-5 bg-secondary/30 border border-vital-critical/20 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="p-2 bg-vital-critical rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-vital-critical">Critical Patient Alert</p>
                      <p className="text-sm text-muted-foreground">Michael Brown's heart rate exceeded 100 BPM</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        2 minutes ago
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="text-vital-critical border-vital-critical/30 hover:bg-vital-critical/10 rounded-lg">
                      View Details
                    </Button>
                  </div>
                  
                  <div className="group flex items-start gap-4 p-5 bg-secondary/30 border border-vital-warning/20 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="p-2 bg-vital-warning rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-vital-warning">Appointment Reminder</p>
                      <p className="text-sm text-muted-foreground">John Doe's appointment in 15 minutes</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-2 h-2 bg-vital-warning rounded-full animate-pulse"></div>
                        Now
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="text-vital-warning border-vital-warning/30 hover:bg-vital-warning/10 rounded-lg">
                      Notify Patient
                    </Button>
                  </div>
                  
                  <div className="group flex items-start gap-4 p-5 bg-secondary/30 border border-medical-primary/20 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="p-2 bg-medical-primary rounded-lg">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-medical-primary">New Message</p>
                      <p className="text-sm text-muted-foreground">Sarah Wilson sent a message about her medication</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        5 minutes ago
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="text-medical-primary border-medical-primary/30 hover:bg-medical-primary/10 rounded-lg">
                      Reply
                    </Button>
                  </div>

                  <div className="group flex items-start gap-4 p-5 bg-secondary/30 border border-medical-secondary/20 rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="p-2 bg-medical-secondary rounded-lg">
                      <Pill className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-medical-secondary">Prescription Reminder</p>
                      <p className="text-sm text-muted-foreground">Time to review John Doe's medication dosage</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        1 hour ago
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="text-medical-secondary border-medical-secondary/30 hover:bg-medical-secondary/10 rounded-lg">
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;