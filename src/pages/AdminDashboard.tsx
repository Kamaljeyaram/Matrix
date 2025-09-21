import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Users, 
  Stethoscope, 
  Heart, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Activity,
  LogOut,
  Settings,
  UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats] = useState({
    totalUsers: 1250,
    totalDoctors: 45,
    totalPatients: 1205,
    activeAppointments: 89,
    systemHealth: 98,
    monthlyGrowth: 12.5
  });

  const [recentActivity] = useState([
    { type: "new_patient", user: "John Smith", time: "2 minutes ago" },
    { type: "appointment", user: "Dr. Johnson & Sarah Wilson", time: "5 minutes ago" },
    { type: "new_doctor", user: "Dr. Michael Chen", time: "1 hour ago" },
    { type: "system_alert", user: "Database backup completed", time: "2 hours ago" },
  ]);

  const [topDoctors] = useState([
    { name: "Dr. Sarah Johnson", specialty: "Cardiology", patients: 85, rating: 4.9 },
    { name: "Dr. Michael Chen", specialty: "Internal Medicine", patients: 72, rating: 4.8 },
    { name: "Dr. Emily Davis", specialty: "Pediatrics", patients: 68, rating: 4.9 },
    { name: "Dr. James Wilson", specialty: "Orthopedics", patients: 55, rating: 4.7 },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_patient": return <Heart className="w-4 h-4 text-vital-healthy" />;
      case "appointment": return <Calendar className="w-4 h-4 text-medical-primary" />;
      case "new_doctor": return <Stethoscope className="w-4 h-4 text-medical-secondary" />;
      case "system_alert": return <Activity className="w-4 h-4 text-vital-warning" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-medical-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">System Management & Analytics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="medical-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-medical-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-vital-healthy">+{stats.monthlyGrowth}% from last month</p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
              <Stethoscope className="h-4 w-4 text-medical-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDoctors}</div>
              <p className="text-xs text-muted-foreground">Across all specialties</p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Patients</CardTitle>
              <Heart className="h-4 w-4 text-vital-healthy" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active patient base</p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-vital-healthy" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemHealth}%</div>
              <Progress value={stats.systemHealth} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="medical-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-medical-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest system events and user activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-medical-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Administrative tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full btn-medical gap-2">
                <UserPlus className="w-4 h-4" />
                Add New Doctor
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Users className="w-4 h-4" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Calendar className="w-4 h-4" />
                View Appointments
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Activity className="w-4 h-4" />
                System Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Top Doctors */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-medical-primary" />
              Top Performing Doctors
            </CardTitle>
            <CardDescription>Doctors ranked by patient load and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topDoctors.map((doctor, index) => (
                <div key={index} className="p-4 bg-secondary/50 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{doctor.name.split(' ').map(n => n[1]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Patients:</span>
                      <span className="font-medium">{doctor.patients}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rating:</span>
                      <Badge variant="secondary" className="status-healthy">
                        ⭐ {doctor.rating}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;