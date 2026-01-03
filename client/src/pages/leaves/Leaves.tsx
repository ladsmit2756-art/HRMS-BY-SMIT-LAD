import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function Leaves() {
  const { user } = useAuth();
  const { leaves, requestLeave, updateLeaveStatus, employees } = useData();
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState<"paid" | "sick" | "unpaid">("paid");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  if (!user) return null;
  const isAdmin = user.role === 'admin';

  // Filter leaves based on role
  const displayedLeaves = isAdmin 
    ? leaves 
    : leaves.filter(l => l.employeeId === user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    requestLeave({
      employeeId: user.id,
      type: leaveType,
      startDate,
      endDate,
      reason
    });
    setIsNewRequestOpen(false);
    // Reset form
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200';
      default: return 'bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-orange-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Manage employee leave requests" : "View and request time off"}
          </p>
        </div>
        
        {!isAdmin && (
          <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" /> New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Time Off</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select value={leaveType} onValueChange={(v: any) => setLeaveType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea 
                    placeholder="Why are you taking leave?" 
                    value={reason} 
                    onChange={e => setReason(e.target.value)} 
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsNewRequestOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit Request</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Request History</CardTitle>
          <CardDescription>
            {isAdmin ? "All leave requests across the organization" : "Your past and upcoming leaves"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayedLeaves.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No leave requests found.</p>
            ) : (
              displayedLeaves.map((leave) => {
                const emp = employees.find(e => e.id === leave.employeeId);
                return (
                  <div key={leave.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-secondary/20 transition-colors gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">
                            {isAdmin ? emp?.name : leave.type.charAt(0).toUpperCase() + leave.type.slice(1) + " Leave"}
                          </h4>
                          <Badge variant="outline" className={getStatusColor(leave.status)}>
                            {leave.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {format(new Date(leave.startDate), "MMM d, yyyy")} - {format(new Date(leave.endDate), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          "{leave.reason}"
                        </p>
                        {isAdmin && <p className="text-xs text-primary mt-1">Requested by: {emp?.name}</p>}
                      </div>
                    </div>

                    {isAdmin && leave.status === 'pending' && (
                      <div className="flex items-center gap-2 self-end md:self-center">
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => updateLeaveStatus(leave.id, 'rejected')}>
                          Reject
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updateLeaveStatus(leave.id, 'approved')}>
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
