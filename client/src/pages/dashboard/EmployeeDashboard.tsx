import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CalendarCheck, User, ArrowRight, Sun, Moon } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { clockIn, clockOut, attendance, leaves } = useData();

  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(a => a.employeeId === user.id && a.date === today);
  const isCheckedIn = !!todayRecord;
  const isCheckedOut = !!todayRecord?.checkOut;

  const myLeaves = leaves.filter(l => l.employeeId === user.id);
  const pendingLeaves = myLeaves.filter(l => l.status === 'pending').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
          <CalendarCheck className="h-4 w-4" />
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Attendance Card */}
        <Card className="relative overflow-hidden border-border/60 shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Time Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Status</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${isCheckedIn && !isCheckedOut ? 'bg-green-100 text-green-700' : isCheckedOut ? 'bg-secondary text-secondary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {isCheckedOut ? "Checked Out" : isCheckedIn ? "Working" : "Not Started"}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Clock In</p>
                  <p className="font-mono text-lg font-semibold">{todayRecord?.checkIn || "--:--"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Clock Out</p>
                  <p className="font-mono text-lg font-semibold">{todayRecord?.checkOut || "--:--"}</p>
                </div>
              </div>

              {!isCheckedOut ? (
                !isCheckedIn ? (
                  <Button onClick={() => clockIn(user.id)} className="w-full gap-2 shadow-lg shadow-primary/20">
                    <Sun className="h-4 w-4" /> Clock In
                  </Button>
                ) : (
                  <Button onClick={() => clockOut(user.id)} variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
                    <Moon className="h-4 w-4" /> Clock Out
                  </Button>
                )
              ) : (
                <Button disabled variant="secondary" className="w-full gap-2">
                  Completed for Today
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Quick View */}
        <Card className="border-border/60 shadow-md transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              My Profile
            </CardTitle>
            <CardDescription>Job details & info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID</span>
                <span className="font-medium">{user.employeeId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{(user as any).department}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium">{(user as any).position}</span>
              </div>
            </div>
            <Link href="/profile">
              <Button variant="outline" className="w-full group">
                View Full Profile
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Leaves Summary */}
        <Card className="border-border/60 shadow-md transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Leave Balance
            </CardTitle>
            <CardDescription>Annual leave summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <div className="p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-900">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pendingLeaves}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
            <Link href="/leaves">
              <Button variant="secondary" className="w-full">
                Request Leave
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myLeaves.length === 0 && attendance.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
              )}
              {/* Combine and sort recent events in a real app */}
              <div className="flex items-center gap-4 p-3 rounded-lg border border-border/40 hover:bg-secondary/30 transition-colors">
                <div className="h-9 w-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Shift Started</p>
                  <p className="text-xs text-muted-foreground">Today at {todayRecord?.checkIn || "09:00 AM"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
