import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Attendance() {
  const { user } = useAuth();
  const { attendance, employees } = useData();

  if (!user) return null;
  const isAdmin = user.role === 'admin';

  // If Admin, show everyone. If Employee, show only mine.
  const displayedAttendance = isAdmin 
    ? attendance 
    : attendance.filter(a => a.employeeId === user.id);
  
  // Sort by date desc
  const sortedAttendance = [...displayedAttendance].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Attendance Records</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? "Global attendance monitoring" : "Your check-in history"}
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>
            Showing records for {isAdmin ? "all employees" : "current month"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {isAdmin && <TableHead>Employee</TableHead>}
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAttendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No records found.</TableCell>
                </TableRow>
              ) : (
                sortedAttendance.map((record) => {
                  const emp = employees.find(e => e.id === record.employeeId);
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {format(new Date(record.date), "MMM d, yyyy")}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {emp?.name.charAt(0)}
                            </div>
                            <span className="text-sm">{emp?.name}</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>{record.checkIn || '-'}</TableCell>
                      <TableCell>{record.checkOut || '-'}</TableCell>
                      <TableCell>{record.hoursWorked ? `${record.hoursWorked}h` : '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          record.status === 'present' ? 'bg-green-50 text-green-700 border-green-200' : 
                          record.status === 'absent' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
